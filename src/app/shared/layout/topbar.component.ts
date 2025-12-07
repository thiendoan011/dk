import { Component, Injector, OnInit, ViewEncapsulation, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as _ from 'lodash';

// Modules & Services
import { AbpMultiTenancyService, AbpSessionService } from 'abp-ng2-module';
import { AppConsts } from '@shared/AppConsts';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { LinkedAccountService } from '@app/shared/layout/linked-account.service';
import { ThemesLayoutBaseComponent } from '@app/shared/layout/themes/themes-layout-base.component';
import { ChangeUserLanguageDto, LinkedUserDto, ProfileServiceProxy, UserLinkServiceProxy } from '@shared/service-proxies/service-proxies';
import { ImpersonationService } from '@app/admin/zero-base/users/impersonation.service';
import { WebConsts } from '@app/ultilities/enum/consts';
import { LoginMethod } from '@app/ultilities/enum/login-method';
import { UtilsModule } from '@shared/utils/utils.module';

// COMPONENTS CON (Bắt buộc import để HTML hiểu thẻ)
import { HeaderNotificationsComponent } from './notifications/header-notifications.component';
import { UserMenuComponent } from './nav/user-menu.component';

@Component({
    selector: 'topbar',
    templateUrl: './topbar.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true, // Component chuẩn Angular 19
    imports: [
        CommonModule,
        RouterModule,
        UtilsModule,
        // Import 2 component này để HTML hoạt động
        HeaderNotificationsComponent,
        UserMenuComponent
    ]
})
export class TopBarComponent extends ThemesLayoutBaseComponent implements OnInit {

    languages: abp.localization.ILanguageInfo[] = [];
    currentLanguage: abp.localization.ILanguageInfo;
    isImpersonatedLogin = false;
    isMultiTenancyEnabled = false;
    shownLoginName = '';
    profilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';
    defaultProfilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    chatConnected = false;
    unreadChatMessageCount = 0;

    // INJECT SERVICE (Thay thế constructor injection dài dòng)
    private readonly _abpSessionService = inject(AbpSessionService);
    private readonly _abpMultiTenancyService = inject(AbpMultiTenancyService);
    private readonly _profileServiceProxy = inject(ProfileServiceProxy);
    // private readonly _userLinkServiceProxy = inject(UserLinkServiceProxy); // Chưa dùng có thể comment
    private readonly _authService = inject(AppAuthService);
    private readonly _impersonationService = inject(ImpersonationService);
    private readonly _linkedAccountService = inject(LinkedAccountService);
    private readonly _zone = inject(NgZone);

    // CONSTRUCTOR
    // Vẫn phải giữ Injector ở đây để thỏa mãn lớp cha (ThemesLayoutBaseComponent)
    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.isMultiTenancyEnabled = this._abpMultiTenancyService.isEnabled;
        this.languages = _.filter(abp.localization.languages, l => (<any>l).isDisabled === false);
        this.currentLanguage = abp.localization.currentLanguage;
        this.isImpersonatedLogin = this._abpSessionService.impersonatorUserId > 0;

        this.setCurrentLoginInformations();
        this.getProfilePicture();
        this.registerToEvents();
    }

    registerToEvents() {
        abp.event.on('profilePictureChanged', () => {
            this.getProfilePicture();
        });

        abp.event.on('app.chat.connected', () => {
            // Dùng NgZone để đảm bảo UI update khi event từ bên ngoài bắn vào
            this._zone.run(() => {
                this.chatConnected = true;
            });
        });

        abp.event.on('app.chat.unreadMessageCountChanged', count => {
            this._zone.run(() => {
                this.unreadChatMessageCount = count;
            });
        });
    }

    changeLanguage(languageName: string): void {
        const input = new ChangeUserLanguageDto();
        input.languageName = languageName;

        this._profileServiceProxy.changeLanguage(input).subscribe(() => {
            abp.utils.setCookieValue(
                'Abp.Localization.CultureName',
                languageName,
                new Date(new Date().getTime() + 5 * 365 * 86400000), // 5 year
                abp.appPath
            );
            window.location.reload();
        });
    }

    setCurrentLoginInformations(): void {
        this.shownLoginName = this.appSession.getShownLoginName();
    }

    getProfilePicture(): void {
        this._profileServiceProxy.getProfilePicture().subscribe(result => {
            if (result && result.profilePicture) {
                this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            } else {
                this.profilePicture = this.defaultProfilePicture;
            }
        });
    }

    // Các hàm show modal - Sử dụng event trigger global
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

    get chatEnabled(): boolean {
        return (!this.appSession.tenantId || this.feature.isEnabled('App.ChatFeature'));
    }
}