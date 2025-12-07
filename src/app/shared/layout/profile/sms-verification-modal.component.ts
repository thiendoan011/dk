import { Component, ElementRef, EventEmitter, Injector, Output, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProfileServiceProxy, VerifySmsCodeInputDto } from '@shared/service-proxies/service-proxies';
import { finalize } from '@node_modules/rxjs/dist/types';

@Component({
    selector: 'smsVerificationModal',
    templateUrl: './sms-verification-modal.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ModalModule
    ]
})
export class SmsVerificationModalComponent extends AppComponentBase {

    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('modal') modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    verifyCodeInput: VerifySmsCodeInputDto = new VerifySmsCodeInputDto();

    private readonly _profileService = inject(ProfileServiceProxy);

    constructor(injector: Injector) {
        super(injector);
    }

    show(): void {
        this.active = true;
        this.modal.show();
        this.verifyCodeInput = new VerifySmsCodeInputDto();
    }

    onShown(): void {
        if (this.nameInput) {
            this.nameInput.nativeElement.focus();
        }
    }

    save(): void {
        this.saving = true;
        this._profileService.verifySmsCode(this.verifyCodeInput)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}