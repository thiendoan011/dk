import { Component, Injector, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import cho @if
import { FormsModule } from '@angular/forms';     // Import cho ngModel
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProfileServiceProxy, SendEmailActivationLinkInput } from '@shared/service-proxies/service-proxies';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { finalize } from 'rxjs/operators';
import { LocalizePipe } from "../../shared/common/pipes/localize.pipe";

@Component({
    templateUrl: './email-activation.component.html',
    animations: [accountModuleAnimation()],
    standalone: true, // ✅ Standalone
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        LocalizePipe
    ]
})
export class EmailActivationComponent extends AppComponentBase implements OnInit {

    model: SendEmailActivationLinkInput = new SendEmailActivationLinkInput();

    // REFACTOR: Dùng signal
    saving = signal<boolean>(false);

    // REFACTOR: Dùng inject()
    private _profileService = inject(ProfileServiceProxy);
    private _router = inject(Router);

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {

    }

    save(): void {
        this.saving.set(true);
        this._profileService.sendVerificationSms(this.model)
            .pipe(finalize(() => { this.saving.set(false); }))
            .subscribe(() => {
                this.message.success(this.l('ActivationMailSentMessage'), this.l('MailSent')).then(() => {
                    this._router.navigate(['account/login']);
                });
            });
    }
}