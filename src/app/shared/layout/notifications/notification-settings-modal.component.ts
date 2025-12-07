import { Component, Injector, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/common/app-component-base';
import { NotificationServiceProxy, GetNotificationSettingsOutput, NotificationSubscriptionWithDisplayNameDto } from '@shared/service-proxies/service-proxies';
import { LocalizePipe } from "../../../../shared/common/pipes/localize.pipe";
import { ButtonBusyDirective } from '@shared/utils/button-busy.directive';
import { finalize } from '@node_modules/rxjs/dist/types';

@Component({
    selector: 'notificationSettingsModal',
    templateUrl: './notification-settings-modal.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ModalModule,
        LocalizePipe,
        ButtonBusyDirective
    ]
})
export class NotificationSettingsModalComponent extends AppComponentBase {

    @ViewChild('modal') modal: ModalDirective;

    active = false;
    saving = false;
    settings: GetNotificationSettingsOutput;

    private readonly _notificationService = inject(NotificationServiceProxy);

    constructor(injector: Injector) {
        super(injector);
    }

    show(): void {
        this.active = true;
        this._notificationService.getNotificationSettings().subscribe((result: GetNotificationSettingsOutput) => {
            this.settings = result;
            this.modal.show();
        });
    }

    save(): void {
        this.saving = true;
        this._notificationService.updateNotificationSettings(this.settings)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}