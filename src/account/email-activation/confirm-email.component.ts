import { Component, Injector, OnInit, inject } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router'; // Thêm ActivatedRoute
import { AppComponentBase } from '@shared/common/app-component-base';
import { AccountServiceProxy, ActivateEmailInput } from '@shared/service-proxies/service-proxies';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { CommonModule } from '@angular/common';
import { LocalizePipe } from "../../shared/common/pipes/localize.pipe"; // Import CommonModule nếu template dùng pipe localize

@Component({
    template: `
    <div class="m-login__signin" [@routerTransition]>
        <div class="m-login__head">
            <h3 class="m-login__title">
                {{ 'EmailConfirmation' | localize }}
            </h3>
            <div class="m-login__desc">
                {{ waitMessage | localize }}
            </div>
        </div>
    </div>
    `,
    animations: [accountModuleAnimation()],
    standalone: true, // ✅ Standalone
    imports: [CommonModule, RouterLink, LocalizePipe]
})
export class ConfirmEmailComponent extends AppComponentBase implements OnInit {

    waitMessage: string = 'PleaseWaitWhileWeAreActivatingYourEmail';
    model: ActivateEmailInput = new ActivateEmailInput();

    // REFACTOR: Inject
    private _accountService = inject(AccountServiceProxy);
    private _router = inject(Router);
    private _activatedRoute = inject(ActivatedRoute);

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        this.model.userId = this._activatedRoute.snapshot.queryParams['userId'];
        this.model.confirmationCode = this._activatedRoute.snapshot.queryParams['confirmationCode'];

        this._accountService.activateEmail(this.model)
            .subscribe({
                next: () => {
                    this.notify.success(this.l('YourEmailIsConfirmed'));
                    this._router.navigate(['account/login']);
                },
                error: (error) => {
                    this.notify.error(this.l('EmailConfirmationFailed'));
                    // Có thể thêm logic redirect về trang lỗi nếu cần
                }
            });
    }
}