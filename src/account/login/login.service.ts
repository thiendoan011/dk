import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenAuthServiceProxy, AuthenticateModel, AuthenticateResultModel, ExternalAuthenticateModel, ExternalAuthenticateResultModel, ExternalLoginProviderInfoModel } from '@shared/service-proxies/service-proxies';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { AppConsts } from '@shared/AppConsts';
import { finalize } from 'rxjs/operators';
export class ExternalLoginProvider {
    constructor(
        public name: string,
        public icon: string
    ) { }
}

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    // REFACTOR: Sử dụng inject()
    private _tokenAuthService = inject(TokenAuthServiceProxy);
    private _router = inject(Router);
    // private _logOutService = inject(LogOutService);
    // Nếu UtilsService không tồn tại, có thể dùng abp.utils trực tiếp

    authenticateModel: AuthenticateModel;
    authenticateResult: AuthenticateResultModel;
    externalLoginProviders: ExternalLoginProvider[] = [];
    rememberMe: boolean;

    constructor() {
        this.clear();
    }

    authenticate(finallyCallback?: () => void): void {
        finallyCallback = finallyCallback || (() => { });

        this._tokenAuthService
            .authenticate(this.authenticateModel)
            .pipe(finalize(finallyCallback))
            .subscribe({
                next: (result: AuthenticateResultModel) => {
                    this.processAuthenticateResult(result);
                },
                error: (err) => {
                    // Xử lý lỗi nếu cần
                }
            });
    }

    externalAuthenticate(provider: ExternalLoginProvider): void {
        this.ensureExternalLoginProviderInitialized(provider, () => {
            localStorage.setItem('external_auth_provider', provider.name);
            // Logic redirect OAuth của bạn ở đây (giữ nguyên từ code cũ)
            const redirectUrl = AppConsts.appBaseUrl + '/assets/login-loading.html'; // Ví dụ
            // window.location.href = ...
        });
    }

    initExternalLoginProviders(callback?: () => void) {
        this._tokenAuthService.getExternalAuthenticationProviders()
            .subscribe((providers: ExternalLoginProviderInfoModel[]) => {
                this.externalLoginProviders = providers.map(p => new ExternalLoginProvider(p.name, p.clientId));
                if (callback) {
                    callback();
                }
            });
    }

    private processAuthenticateResult(authenticateResult: AuthenticateResultModel) {
        this.authenticateResult = authenticateResult;

        if (authenticateResult.shouldResetPassword) {
            this._router.navigate(['account/reset-password'], {
                queryParams: {
                    userId: authenticateResult.userId,
                    tenantId: authenticateResult.impersonateOutput.tenancyId,
                    resetCode: authenticateResult.passwordResetCode
                }
            });
            this.clear();
        } else if (authenticateResult.requiresTwoFactorVerification) {
            this._router.navigate(['account/send-code']);
        } else if (authenticateResult.accessToken) {
            // Login thành công
            this.login(
                authenticateResult.accessToken,
                authenticateResult.encryptedAccessToken,
                authenticateResult.expireInSeconds,
                this.rememberMe
            );
        }
    }

    private login(accessToken: string, encryptedAccessToken: string, expireInSeconds: number, rememberMe?: boolean): void {
        const tokenExpireDate = rememberMe ? (new Date(new Date().getTime() + 1000 * expireInSeconds)) : undefined;

        // Lưu token (Dùng abp.auth hoặc CookieService)
        abp.auth.setToken(accessToken, tokenExpireDate);

        // Redirect
        let initialReturnUrl = UrlHelper.getReturnUrl();
        if (initialReturnUrl) {
            location.href = initialReturnUrl;
        } else {
            location.href = AppConsts.appBaseUrl;
        }
    }

    private clear(): void {
        this.authenticateModel = new AuthenticateModel();
        this.authenticateModel.rememberClient = false;
        this.authenticateResult = null;
        this.rememberMe = false;
    }

    private ensureExternalLoginProviderInitialized(provider: ExternalLoginProvider, callback: () => void) {
        // Logic check script loaded (giữ nguyên logic cũ nếu có)
        callback();
    }

    // Nếu bạn cần logout public
    logout(): void {
        // this._logOutService.logout();
    }
}