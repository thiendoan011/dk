import { Injectable, inject } from '@angular/core';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { AppUrlService } from '@shared/common/nav/app-url.service';
import { AccountServiceProxy, SwitchToLinkedAccountInput, SwitchToLinkedAccountOutput } from '@shared/service-proxies/service-proxies';

@Injectable({
    providedIn: 'root' // Đảm bảo service này là singleton global
})
export class LinkedAccountService {

    // Inject dependencies bằng hàm inject() thay vì constructor
    private readonly _accountService = inject(AccountServiceProxy);
    private readonly _appUrlService = inject(AppUrlService);
    private readonly _authService = inject(AppAuthService);

    constructor() { }

    switchToAccount(userId: number, tenantId?: number): void {
        const input = new SwitchToLinkedAccountInput();
        input.targetUserId = userId;
        input.targetTenantId = tenantId;

        this._accountService.switchToLinkedAccount(input)
            .subscribe((result: SwitchToLinkedAccountOutput) => {
                let targetUrl = this._appUrlService.getAppRootUrlOfTenant(result.tenancyName) + '?switchAccountToken=' + result.switchAccountToken;
                if (input.targetTenantId) {
                    targetUrl = targetUrl + '&tenantId=' + input.targetTenantId;
                }

                this._authService.logout(true, targetUrl);
            });
    }
}