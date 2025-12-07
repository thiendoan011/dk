import { Component, EventEmitter, Injector, Output, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';

import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { CurrentUserProfileEditDto, ProfileServiceProxy, SettingScopes } from '@shared/service-proxies/service-proxies';
import { SmsVerificationModalComponent } from './sms-verification-modal.component';
import { finalize } from '@node_modules/rxjs/dist/types';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { TimeZoneComboComponent } from '@app/shared/common/timing/timezone-combo.component';
import { ValidationMessagesComponent } from "@shared/utils/validation-messages.component";

@Component({
    selector: 'mySettingsModal',
    templateUrl: './my-settings-modal.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ModalModule,
        AppCommonModule, // Chứa các directive validation (nếu có)
        SmsVerificationModalComponent, // Import component con
        TimeZoneComboComponent // Import timezone-combo component
        ,
        ValidationMessagesComponent
    ]
})
export class MySettingsModalComponent extends AppComponentBase {

    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('smsVerificationModal') smsVerificationModal: SmsVerificationModalComponent;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    user: CurrentUserProfileEditDto = null;
    showTimezoneSelection = abp.clock.provider.supportsMultipleTimezone;
    canChangeUserName = true;
    defaultTimezoneScope: SettingScopes = SettingScopes.User;
    isGoogleAuthenticatorEnabled = false;
    isPhoneNumberConfirmed = false;

    private readonly _profileService = inject(ProfileServiceProxy);

    constructor(injector: Injector) {
        super(injector);
    }

    show(): void {
        this.active = true;
        this._profileService.getCurrentUserProfileForEdit().subscribe((result) => {
            this.user = result;
            this.canChangeUserName = this.user.userName !== AppConsts.userManagement.defaultAdminUserName;
            this.modal.show();
        });
    }

    updateUserProfile(): void {
        this.saving = true;
        this._profileService.updateCurrentUserProfile(this.user)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.appSession.user.name = this.user.name;
                this.appSession.user.surname = this.user.surname;
                this.appSession.user.userName = this.user.userName;
                this.appSession.user.emailAddress = this.user.emailAddress;

                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);

                // Logic check confirm phone number (nếu cần)
                if (abp.setting.getBoolean('App.UserManagement.SmsVerificationEnabled') && !this.isPhoneNumberConfirmed && this.user.phoneNumber) {
                    this.smsVerificationModal.show();
                }
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}