import { Component, Injector, OnInit, inject, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AccountServiceProxy, PasswordComplexitySetting, ProfileServiceProxy, ResetPasswordOutput } from '@shared/service-proxies/service-proxies';
import { LoginService } from '../login/login.service';
import { ResetPasswordModel } from './reset-password.model';
import { finalize } from 'rxjs/operators';
import { LocalizePipe } from "../../shared/common/pipes/localize.pipe";

@Component({
    templateUrl: './reset-password.component.html',
    animations: [accountModuleAnimation()],
    standalone: true, // ✅
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        LocalizePipe
    ]
})
export class ResetPasswordComponent extends AppComponentBase implements OnInit {

    model: ResetPasswordModel = new ResetPasswordModel();
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
    saving = signal<boolean>(false);

    // REFACTOR: Inject
    private _accountService = inject(AccountServiceProxy);
    private _router = inject(Router);
    private _activatedRoute = inject(ActivatedRoute);
    private _loginService = inject(LoginService);
    private _profileService = inject(ProfileServiceProxy);

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        // Lấy thông tin từ URL
        this.model.userId = this._activatedRoute.snapshot.queryParams['userId'];
        this.model.resetCode = this._activatedRoute.snapshot.queryParams['resetCode'];

        // Nếu URL có tenantId, lưu vào session/cookie nếu cần (ABP thường tự handle qua query param 'tenantId' ở global interceptor)
        // Nhưng ở đây là form reset, ta chỉ cần gán vào model nếu API yêu cầu, 
        // tuy nhiên API ResetPassword của ABP thường tự suy diễn từ resetCode hoặc không cần tenantId tường minh trong body.

        // Lấy cấu hình độ mạnh mật khẩu để validate UI (nếu có)
        this._profileService.getPasswordComplexitySetting().subscribe(result => {
            this.passwordComplexitySetting = result.setting;
        });
    }

    save(): void {
        this.saving.set(true);
        this._accountService.resetPassword(this.model)
            .pipe(finalize(() => { this.saving.set(false); }))
            .subscribe({
                next: (result: ResetPasswordOutput) => {
                    if (!result.canLogin) {
                        this._router.navigate(['account/login']);
                        return;
                    }

                    // Tự động login sau khi reset thành công
                    this.saving.set(true);
                    this._loginService.authenticateModel.userNameOrEmailAddress = result.userName;
                    this._loginService.authenticateModel.password = this.model.password;
                    this._loginService.authenticate(() => {
                        this.saving.set(false);
                    });
                }
            });
    }
}