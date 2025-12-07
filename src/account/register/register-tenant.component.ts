import { Component, Injector, OnInit, ViewChild, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HostSettingsServiceProxy, RegisterTenantOutput, TenantRegistrationServiceProxy, CreateTenantInput, RegisterTenantInput } from '@shared/service-proxies/service-proxies';
import { LoginService } from '../login/login.service';
import { RegisterTenantModel } from './register-tenant.model';
import { TenantRegistrationHelperService } from './tenant-registration-helper.service';
import { finalize } from 'rxjs/operators';
import { RecaptchaModule, RecaptchaComponent } from 'ng-recaptcha';
import { AppConsts } from '@shared/AppConsts';
import { LocalizePipe } from "../../shared/common/pipes/localize.pipe";

@Component({
    templateUrl: './register-tenant.component.html',
    animations: [accountModuleAnimation()],
    standalone: true, // ✅ Standalone
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        RecaptchaModule // Import module Recaptcha
        ,
        LocalizePipe
    ]
})
export class RegisterTenantComponent extends AppComponentBase implements OnInit {
    @ViewChild('recaptchaRef') recaptchaRef: RecaptchaComponent;

    model: RegisterTenantModel = new RegisterTenantModel();
    recaptchaSiteKey: string = AppConsts.recaptchaSiteKey;

    // REFACTOR: Dùng Signal
    saving = signal<boolean>(false);

    // REFACTOR: Inject dependencies
    private _tenantRegistrationService = inject(TenantRegistrationServiceProxy);
    private _router = inject(Router);
    private _loginService = inject(LoginService); // Public nếu template dùng
    private _tenantRegistrationHelper = inject(TenantRegistrationHelperService);
    private _hostSettingsService = inject(HostSettingsServiceProxy);

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        // Kiểm tra xem có cho phép đăng ký tenant không
        this._hostSettingsService.getAllSettings()
            .subscribe(settings => {
                // Logic check setting enable register tenant
            });
    }

    get useCaptcha(): boolean {
        return this.setting.getBoolean('App.TenantManagement.UseCaptchaOnRegistration');
    }

    save(): void {
        if (this.useCaptcha && !this.model.captchaResponse) {
            this.message.warn(this.l('CaptchaCanNotBeEmpty'));
            return;
        }

        this.saving.set(true);

        // Map model sang DTO của API (RegisterTenantInput)
        const input = new RegisterTenantInput();
        input.tenancyName = this.model.tenancyName;
        input.name = this.model.name;
        input.adminEmailAddress = this.model.adminEmailAddress;
        input.adminPassword = this.model.adminPassword;
        input.editionId = this.model.editionId;
        input.captchaResponse = this.model.captchaResponse;
        input.subscriptionStartType = this.model.subscriptionStartType;

        this._tenantRegistrationService.registerTenant(input)
            .pipe(finalize(() => this.saving.set(false)))
            .subscribe((result: RegisterTenantOutput) => {
                this.notify.success(this.l('SuccessfullyRegistered'));

                // Chuyển hướng sang trang kết quả
                this._router.navigate(['account/register-tenant-result'], {
                    queryParams: {
                        tenantId: result.tenantId,
                        isActive: result.isActive
                    }
                });
            });
    }

    captchaResolved(captchaResponse: string): void {
        this.model.captchaResponse = captchaResponse;
    }
}