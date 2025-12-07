import { Component, Injector, OnInit, ViewChild, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppConsts } from '@shared/AppConsts';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AccountServiceProxy, PasswordComplexitySetting, ProfileServiceProxy, RegisterOutput } from '@shared/service-proxies/service-proxies';
import { LoginService } from '../login/login.service';
import { RegisterModel } from './register.model';
import { finalize, catchError } from 'rxjs/operators';
import { RecaptchaModule, RecaptchaComponent } from 'ng-recaptcha';
import { LocalizePipe } from "../../shared/common/pipes/localize.pipe"; // Import module thay vì component

@Component({
    templateUrl: './register.component.html',
    animations: [accountModuleAnimation()],
    standalone: true, // ✅ BẮT BUỘC: Standalone
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        RecaptchaModule // ✅ Import trực tiếp module Recaptcha vào đây
        ,
        LocalizePipe
    ]
})
export class RegisterComponent extends AppComponentBase implements OnInit {
    @ViewChild('recaptchaRef') recaptchaRef: RecaptchaComponent;

    model: RegisterModel = new RegisterModel();
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
    recaptchaSiteKey: string = AppConsts.recaptchaSiteKey;

    // REFACTOR: Dùng signal
    saving = signal<boolean>(false);

    // REFACTOR: Dùng inject()
    private _accountService = inject(AccountServiceProxy);
    private _router = inject(Router);
    public _loginService = inject(LoginService); // Public để template truy cập nếu cần
    private _profileService = inject(ProfileServiceProxy);

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        // Prevent to register new users in the host context
        if (this.appSession.tenant == null) {
            this._router.navigate(['account/login']);
            return;
        }

        this._profileService.getPasswordComplexitySetting().subscribe(result => {
            this.passwordComplexitySetting = result.setting;
        });
    }

    get useCaptcha(): boolean {
        return this.setting.getBoolean('App.UserManagement.UseCaptchaOnRegistration');
    }

    save(): void {
        if (this.useCaptcha && !this.model.captchaResponse) {
            this.message.warn(this.l('CaptchaCanNotBeEmpty'));
            return;
        }

        this.saving.set(true); // Signal set

        this._accountService.register(this.model)
            .pipe(
                finalize(() => { this.saving.set(false); }),
                catchError((err, caught): any => {
                    this.recaptchaRef?.reset(); // Thêm optional chain để tránh lỗi null
                    return err;
                })
            )
            .subscribe((result: RegisterOutput) => {
                if (!result.canLogin) {
                    this.showSuccessMessage(this.l('SuccessfullyRegistered'));
                    this._router.navigate(['account/login']);
                    return;
                }

                // Authenticate
                this.saving.set(true);
                this._loginService.authenticateModel.userNameOrEmailAddress = this.model.userName;
                this._loginService.authenticateModel.password = this.model.password;
                this._loginService.authenticate(() => { this.saving.set(false); });
            });
    }

    captchaResolved(captchaResponse: string): void {
        this.model.captchaResponse = captchaResponse;
    }
}