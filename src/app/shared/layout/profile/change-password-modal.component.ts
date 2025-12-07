import { Component, Injector, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { ChangePasswordInput, ProfileServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { finalize } from '@node_modules/rxjs/dist/types';

@Component({
    selector: 'changePasswordModal',
    templateUrl: './change-password-modal.component.html',
    styleUrls: ['./change-password-modal.component.less'], // Sửa lại đúng property
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ModalModule, // Để dùng bsModal
        AppCommonModule // Để dùng các validator directives cũ (nếu có)
    ]
})
export class ChangePasswordModalComponent extends AppComponentBase {

    @ViewChild('modal') modal: ModalDirective;

    active = false;
    saving = false;
    changePasswordInput: ChangePasswordInput = new ChangePasswordInput();

    // Inject Service
    private readonly _profileService = inject(ProfileServiceProxy);

    constructor(injector: Injector) {
        super(injector);
    }

    show(): void {
        this.active = true;
        this.modal.show();
        this.changePasswordInput = new ChangePasswordInput();
    }

    onShown(): void {
        document.getElementById('CurrentPassword').focus();
    }

    save(): void {
        this.saving = true;
        this._profileService.changePassword(this.changePasswordInput)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('YourPasswordHasBeenChangedSuccessfully'));
                this.close();
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}