import { Component, EventEmitter, Injector, Output, ViewChild, inject } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LinkToUserInput, UserLinkServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppCommonModule } from '../common/app-common.module';
import { ValidationMessagesComponent } from '@shared/utils/validation-messages.component';
import { ButtonBusyDirective } from '@shared/utils/button-busy.directive';
@Component({
    selector: 'linkAccountModal',
    templateUrl: './link-account-modal.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ModalModule,
        AppCommonModule,
        ValidationMessagesComponent,
        ButtonBusyDirective
    ]
})
export class LinkAccountModalComponent extends AppComponentBase {

    @ViewChild('linkAccountModal') modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    linkUser: LinkToUserInput = new LinkToUserInput();

    private readonly _userLinkService = inject(UserLinkServiceProxy);

    constructor(injector: Injector) {
        super(injector);
    }

    show(): void {
        this.active = true;
        this.linkUser = new LinkToUserInput();
        this.linkUser.tenancyName = this.appSession.tenancyName;
        this.modal.show();
    }

    onShown(): void {
        document.getElementById('TenancyName').focus();
    }

    save(): void {
        this.saving = true;
        this._userLinkService.linkToUser(this.linkUser)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}