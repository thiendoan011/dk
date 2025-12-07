import { Component, Injector, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProfileServiceProxy, UserLoginAttemptDto, UserLoginServiceProxy } from '@shared/service-proxies/service-proxies';
import moment from 'moment';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';

@Component({
    selector: 'loginAttemptsModal',
    templateUrl: './login-attempts-modal.component.html',
    standalone: true,
    imports: [CommonModule, ModalModule]
})
export class LoginAttemptsModalComponent extends AppComponentBase {

    @ViewChild('loginAttemptsModal') modal: ModalDirective;

    userLoginAttempts: UserLoginAttemptDto[];
    profilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';
    defaultProfilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';

    private readonly _userLoginService = inject(UserLoginServiceProxy);
    private readonly _profileService = inject(ProfileServiceProxy);

    constructor(injector: Injector) {
        super(injector);
    }

    show(): void {
        this._userLoginService.getRecentUserLoginAttempts().subscribe(result => {
            this.userLoginAttempts = result.items;
            this._profileService.getProfilePicture().subscribe(result => {
                if (result && result.profilePicture) {
                    this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
                }
                this.modal.show();
            });
        });
    }

    close(): void {
        this.modal.hide();
    }

    getLoginAttemptTime(userLoginAttempt: UserLoginAttemptDto): string {
        return moment(userLoginAttempt.creationTime).fromNow() + ' (' + moment(userLoginAttempt.creationTime).format('YYYY-MM-DD HH:mm:ss') + ')';
    }
}