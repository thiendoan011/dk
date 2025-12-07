import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AbpMultiTenancyService, AbpSessionService } from 'abp-ng2-module';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { LinkedAccountService } from '@app/shared/layout/linked-account.service';
import { AppConsts } from '@shared/AppConsts';
import { ThemesLayoutBaseComponent } from '@app/shared/layout/themes/themes-layout-base.component';
import { LinkedUserDto, ProfileServiceProxy, UserLinkServiceProxy } from '@shared/service-proxies/service-proxies';
import { WebConsts } from '@app/ultilities/enum/consts';
import { LoginMethod } from '@app/ultilities/enum/login-method';
import { UtilsModule } from '@shared/utils/utils.module';
import { ImpersonationService } from '@app/admin/zero-base/users/impersonation.service';

@Component({
    selector: 'user-menu',
    templateUrl: './user-menu.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        UtilsModule
    ]
})
export class UserMenuComponent extends ThemesLayoutBaseComponent implements OnInit {

    isImpersonatedLogin = false;
    isMultiTenancyEnabled = false;
    shownLoginName = '';
    tenancyName = '';
    userName = '';
    profilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';
    recentlyLinkedUsers: LinkedUserDto[];
    isNormalLoginMethod = this.setting.get(WebConsts.LoginMethodConsts) == LoginMethod.normal;

    // Inject Dependencies bằng hàm inject() thay vì constructor
    private readonly _abpSessionService = inject(AbpSessionService);
    private readonly _abpMultiTenancyService = inject(AbpMultiTenancyService);
    private readonly _profileServiceProxy = inject(ProfileServiceProxy);
    private readonly _userLinkServiceProxy = inject(UserLinkServiceProxy);
    private readonly _authService = inject(AppAuthService);
    private readonly _impersonationService = inject(ImpersonationService);
    private readonly _linkedAccountService = inject(LinkedAccountService);

    constructor() {
        super();
    }

    ngOnInit() {
        this.isMultiTenancyEnabled = this._abpMultiTenancyService.isEnabled;
        this.isImpersonatedLogin = this._abpSessionService.impersonatorUserId > 0;

        this.setCurrentLoginInformations();
        this.getProfilePicture();
        this.registerToEvents();
    }

    registerToEvents() {
        abp.event.on('profilePictureChanged', () => {
            this.getProfilePicture();
        });

        abp.event.on('app.getRecentlyLinkedUsers', () => {
            this.getRecentlyLinkedUsers();
        });

        abp.event.on('app.onMySettingsModalSaved', () => {
            this.onMySettingsModalSaved();
        });
    }

    setCurrentLoginInformations(): void {
        this.shownLoginName = this.appSession.getShownLoginName();
        this.tenancyName = this.appSession.tenancyName;
        if (this.appSession.user) {
            this.userName = this.appSession.user.userName;
        }
    }

    getShownUserName(linkedUser: LinkedUserDto): string {
        if (!this._abpMultiTenancyService.isEnabled) {
            return linkedUser.username;
        }
        return (linkedUser.tenantId ? linkedUser.tenancyName : '.') + '\\' + linkedUser.username;
    }

    getProfilePicture(): void {
        if (this.appSession.user.profilePicture) {
            this.profilePicture = 'data:image/jpeg;base64,' + this.appSession.user.profilePicture.profilePicture;
            // this.updateView(); // Angular tự detect change, thường không cần gọi hàm này trừ khi dùng OnPush ngặt nghèo
        }
    }

    getRecentlyLinkedUsers(): void {
        this._userLinkServiceProxy.getRecentlyUsedLinkedUsers().subscribe(result => {
            this.recentlyLinkedUsers = result.items;
        });
    }

    showLoginAttempts(): void {
        abp.event.trigger('app.show.loginAttemptsModal');
    }

    showLinkedAccounts(): void {
        abp.event.trigger('app.show.linkedAccountsModal');
    }

    changePassword(): void {
        abp.event.trigger('app.show.changePasswordModal');
    }

    changeProfilePicture(): void {
        abp.event.trigger('app.show.changeProfilePictureModal');
    }

    changeMySettings(): void {
        abp.event.trigger('app.show.mySettingsModal');
    }

    logout(): void {
        if (abp.setting.get('gAMSProCore.LoginMethod') == LoginMethod.adfs) {
            this._authService.logoutAdfs();
        } else {
            this._authService.logout();
        }
    }

    onMySettingsModalSaved(): void {
        this.shownLoginName = this.appSession.getShownLoginName();
    }

    backToMyAccount(): void {
        this._impersonationService.backToImpersonator();
    }

    switchToLinkedUser(linkedUser: LinkedUserDto): void {
        this._linkedAccountService.switchToAccount(linkedUser.id, linkedUser.tenantId);
    }

    downloadCollectedData(): void {
        this._profileServiceProxy.prepareCollectedData().subscribe(() => {
            this.message.success(this.l('GdprDataPrepareStartedNotification'));
        });
    }
}