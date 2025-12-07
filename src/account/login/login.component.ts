import { Component, OnInit, inject, signal, ChangeDetectionStrategy, Injector } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SessionServiceProxy, UpdateUserSignInTokenOutput, API_BASE_URL } from '@shared/service-proxies/service-proxies';
import { AbpSessionService } from 'abp-ng2-module';
import { UrlHelper } from 'shared/helpers/UrlHelper';
import { ExternalLoginProvider, LoginService } from './login.service';
import { WebConsts } from '@app/ultilities/enum/consts';
import { LoginMethod } from '@app/ultilities/enum/login-method';
import { AppConsts } from '@shared/AppConsts';
// Import Validation Component (nếu chưa có standalone thì phải import SharedModule chứa nó)
import { ValidationMessagesComponent } from '@shared/utils/validation-messages.component';
import { LocalizePipe } from "../../shared/common/pipes/localize.pipe"; // Cần check path chính xác

@Component({
    templateUrl: './login.component.html',
    animations: [accountModuleAnimation()],
    standalone: true,
    imports: [
        FormsModule,
        RouterLink,
        NgIf,
        ValidationMessagesComponent,
        LocalizePipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent extends AppComponentBase implements OnInit {
    submitting = signal<boolean>(false);

    public loginService = inject(LoginService);
    private _router = inject(Router);
    private _sessionService = inject(AbpSessionService);
    private _sessionAppService = inject(SessionServiceProxy);
    private baseUrl = inject(API_BASE_URL, { optional: true }) || "";

    isMultiTenancyEnabled: boolean = this.multiTenancy.isEnabled;
    adfsRemoteUrl: string;
    hasAdfsError = false;
    releaseDate = AppConsts.releaseVersion;

    canFogotPassword = this.setting.getBoolean('gAMSProCore.FogotPasswordEnable') && (this.setting.get(WebConsts.LoginMethodConsts) == LoginMethod.normal);
    canEmailActive = this.setting.getBoolean('gAMSProCore.EmailActivationEnable') && (this.setting.get(WebConsts.LoginMethodConsts) == LoginMethod.normal);
    LoginMethod = LoginMethod;

    constructor() {
        super(inject(Injector));
        this.adfsRemoteUrl = this.baseUrl + '/api/TokenAuth/LoginAdfs';
    }

    get multiTenancySideIsTeanant(): boolean {
        return this._sessionService.tenantId > 0;
    }

    get isTenantSelfRegistrationAllowed(): boolean {
        return this.setting.getBoolean('App.TenantManagement.AllowSelfRegistration');
    }

    get isSelfRegistrationAllowed(): boolean {
        if (!this._sessionService.tenantId) {
            return false;
        }
        return this.setting.getBoolean('App.UserManagement.AllowSelfRegistration');
    }

    ngOnInit(): void {
        if (this._sessionService.userId > 0 && UrlHelper.getReturnUrl() && UrlHelper.getSingleSignIn()) {
            this._sessionAppService.updateUserSignInToken()
                .subscribe((result: UpdateUserSignInTokenOutput) => {
                    const initialReturnUrl = UrlHelper.getReturnUrl();
                    const returnUrl = initialReturnUrl + (initialReturnUrl.indexOf('?') >= 0 ? '&' : '?') +
                        'accessToken=' + result.signInToken +
                        '&userId=' + result.encodedUserId +
                        '&tenantId=' + result.encodedTenantId;

                    location.href = returnUrl;
                });
        }

        let state = UrlHelper.getQueryParametersUsingHash().state;
        // Logic OpenID Connect nếu có
    }

    login(): void {
        abp.ui.setBusy(undefined, '', 1);
        this.submitting.set(true);

        this.loginService.authenticate(
            () => {
                this.submitting.set(false);
                abp.ui.clearBusy();
            }
        );
    }

    externalLogin(provider: ExternalLoginProvider) {
        this.loginService.externalAuthenticate(provider);
    }
}