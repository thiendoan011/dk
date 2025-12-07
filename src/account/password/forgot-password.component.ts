import { Component, Injector, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AccountServiceProxy, SendPasswordResetCodeInput } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { LocalizePipe } from "../../shared/common/pipes/localize.pipe";

@Component({
    templateUrl: './forgot-password.component.html',
    animations: [accountModuleAnimation()],
    standalone: true, // ✅
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        LocalizePipe
    ]
})
export class ForgotPasswordComponent extends AppComponentBase {

    model: SendPasswordResetCodeInput = new SendPasswordResetCodeInput();
    saving = signal<boolean>(false); // ✅ Signal

    private _accountService = inject(AccountServiceProxy);
    private _router = inject(Router);

    constructor(injector: Injector) {
        super(injector);
    }

    save(): void {
        this.saving.set(true);
        this._accountService.sendPasswordResetCode(this.model)
            .pipe(finalize(() => { this.saving.set(false); }))
            .subscribe({
                next: () => {
                    this.message.success(this.l('PasswordResetMailSentMessage'), this.l('MailSent'))
                        .then(() => {
                            this._router.navigate(['account/login']);
                        });
                },
                error: () => {
                    // Handle error if needed (AppComponentBase usually handles global errors)
                }
            });
    }
}