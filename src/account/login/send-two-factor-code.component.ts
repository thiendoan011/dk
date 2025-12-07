import { Component, Injector, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SendTwoFactorAuthCodeModel, TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { LoginService } from './login.service';
import { LocalizePipe } from "../../shared/common/pipes/localize.pipe";

@Component({
    templateUrl: './send-two-factor-code.component.html',
    animations: [accountModuleAnimation()],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        LocalizePipe
    ]
})
export class SendTwoFactorCodeComponent extends AppComponentBase implements OnInit {

    selectedTwoFactorProvider = signal<string>('');
    submitting = signal<boolean>(false);
    twoFactorProviders: string[] = [];

    // ✅ THÊM: Biến local để lưu userId, tránh lỗi undefined khi gọi API
    private _userId: number;

    private _tokenAuthService = inject(TokenAuthServiceProxy);
    private _router = inject(Router);
    private _loginService = inject(LoginService);

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        // Lấy kết quả login từ service
        const result = this._loginService.authenticateResult;

        // Kiểm tra kỹ nếu result tồn tại
        if (result && result.twoFactorAuthProviders && result.twoFactorAuthProviders.length > 0) {
            this._userId = result.userId; // ✅ Lưu userId vào biến local
            this.twoFactorProviders = result.twoFactorAuthProviders;
            this.selectedTwoFactorProvider.set(this.twoFactorProviders[0]);
        } else {
            // Nếu không có thông tin (vd: F5 trang), đá về login
            this._router.navigate(['account/login']);
        }
    }

    sendCode(): void {
        // Kiểm tra an toàn lần cuối
        if (!this._userId) {
            this._router.navigate(['account/login']);
            return;
        }

        this.submitting.set(true);

        const model = new SendTwoFactorAuthCodeModel();
        model.userId = this._userId;
        model.provider = this.selectedTwoFactorProvider();

        // ✅ FIX: Dùng this._userId đã được gán giá trị
        this._tokenAuthService.sendTwoFactorAuthCode(model)
            .subscribe({
                next: () => {
                    this.submitting.set(false);
                    this._router.navigate(['account/verify-code'], {
                        queryParams: {
                            provider: this.selectedTwoFactorProvider()
                        }
                    });
                },
                error: (err) => {
                    this.submitting.set(false);
                }
            });
    }
}