import { Component, OnInit, Injector, ViewChild, ViewEncapsulation, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { AppConsts } from '@shared/AppConsts';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { SubscriptionStartType, AsposeServiceProxy, ReportInfo, FileDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LoginAttemptsModalComponent } from './shared/layout/login-attempts-modal.component';
import { LinkedAccountsModalComponent } from './shared/layout/linked-accounts-modal.component';
import { ChangePasswordModalComponent } from './shared/layout/profile/change-password-modal.component';
import { ChangeProfilePictureModalComponent } from './shared/layout/profile/change-profile-picture-modal.component';
import { MySettingsModalComponent } from './shared/layout/profile/my-settings-modal.component';
import { NotificationSettingsModalComponent } from './shared/layout/notifications/notification-settings-modal.component';
import { ThemeSelectionPanelComponent } from './shared/layout/theme-selection/theme-selection-panel.component';
import { DefaultLayoutComponent } from './shared/layout/themes/default/default-layout.component';
import { Theme2LayoutComponent } from './shared/layout/themes/theme2/theme2-layout.component';
import { Theme3LayoutComponent } from './shared/layout/themes/theme3/theme3-layout.component';
import { Theme4LayoutComponent } from './shared/layout/themes/theme4/theme4-layout.component';
import { Theme5LayoutComponent } from './shared/layout/themes/theme5/theme5-layout.component';
import { Theme6LayoutComponent } from './shared/layout/themes/theme6/theme6-layout.component';
import { Theme7LayoutComponent } from './shared/layout/themes/theme7/theme7-layout.component';
import { Theme8LayoutComponent } from './shared/layout/themes/theme8/theme8-layout.component';
import { Theme9LayoutComponent } from './shared/layout/themes/theme9/theme9-layout.component';
import { Theme10LayoutComponent } from './shared/layout/themes/theme10/theme10-layout.component';
import { Theme11LayoutComponent } from './shared/layout/themes/theme11/theme11-layout.component';
import { Theme12LayoutComponent } from './shared/layout/themes/theme12/theme12-layout.component';
import { UserNotificationHelper } from './shared/layout/notifications/UserNotificationHelper';
import moment from 'moment';

@Component({
	selector: 'app-app',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.less'],
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		CommonModule,
		RouterOutlet,
		// Modals
		LoginAttemptsModalComponent,
		LinkedAccountsModalComponent,
		ChangePasswordModalComponent,
		ChangeProfilePictureModalComponent,
		MySettingsModalComponent,
		NotificationSettingsModalComponent,
		ThemeSelectionPanelComponent,
		// ChatBarComponent, 

		// Layouts - Khai báo ở đây để HTML hiểu thẻ <default-layout>...
		DefaultLayoutComponent,
		Theme2LayoutComponent,
		Theme3LayoutComponent,
		Theme4LayoutComponent,
		Theme5LayoutComponent,
		Theme6LayoutComponent,
		Theme7LayoutComponent,
		Theme8LayoutComponent,
		Theme9LayoutComponent,
		Theme10LayoutComponent,
		Theme11LayoutComponent,
		Theme12LayoutComponent
	]
})
export class AppComponent extends AppComponentBase implements OnInit, AfterViewInit {
	// ... Giữ nguyên logic cũ của bạn ...
	subscriptionStartType = SubscriptionStartType;
	theme: string;
	installationMode = true;

	// Inject services
	private readonly _userNotificationHelper = inject(UserNotificationHelper);
	private readonly http = inject(HttpClient);
	// private readonly asposeService = inject(AsposeServiceProxy); 

	@ViewChild('loginAttemptsModal') loginAttemptsModal: LoginAttemptsModalComponent;
	@ViewChild('linkedAccountsModal') linkedAccountsModal: LinkedAccountsModalComponent;
	@ViewChild('changePasswordModal') changePasswordModal: ChangePasswordModalComponent;
	@ViewChild('changeProfilePictureModal') changeProfilePictureModal: ChangeProfilePictureModalComponent;
	@ViewChild('mySettingsModal') mySettingsModal: MySettingsModalComponent;
	@ViewChild('notificationSettingsModal') notificationSettingsModal: NotificationSettingsModalComponent;
	@ViewChild('themeSelectionPanel') themeSelectionPanel: ThemeSelectionPanelComponent;
	// @ViewChild('chatBarComponent') chatBarComponent: ChatBarComponent;

	constructor(injector: Injector) {
		super(injector);
	}

	ngOnInit(): void {
		this._userNotificationHelper.settingsModal = this.notificationSettingsModal;
		this.theme = abp.setting.get('App.UiManagement.Theme').toLocaleLowerCase();
		this.installationMode = UrlHelper.isInstallUrl(location.href);

		this.registerGlobals();
		this.overrideReportFunct();
	}

	ngAfterViewInit(): void {
		if (this.appSession.application) {
			// Logic check subscription expire
			if (this.subscriptionStatusBarVisible()) {
				// animation logic
			}
		}
	}

	subscriptionStatusBarVisible(): boolean {
		return this.appSession.tenantId > 0 &&
			(this.appSession.tenant.isInTrialPeriod ||
				this.subscriptionIsExpiringSoon());
	}

	subscriptionIsExpiringSoon(): boolean {
		if (this.appSession.tenant.subscriptionEndDateUtc) {
			return moment().utc().add(AppConsts.subscriptionExpireNootifyDayCount, 'days') >= moment(this.appSession.tenant.subscriptionEndDateUtc);
		}
		return false;
	}

	registerGlobals() {
		(window as any).LoginAttemptsModal = this.loginAttemptsModal;
		(window as any).LinkedAccountsModal = this.linkedAccountsModal;
		(window as any).PasswordChangeModal = this.changePasswordModal;
		(window as any).ChangeProfilePictureModal = this.changeProfilePictureModal;
		(window as any).MySettingsModal = this.mySettingsModal;
		(window as any).NotificationSettingsModal = this.notificationSettingsModal;
		(window as any).ThemeSelectionPanel = this.themeSelectionPanel;
	}

	overrideReportFunct() {
		const self = this;
		AsposeServiceProxy.prototype.getReport = function (info: ReportInfo): Observable<FileDto> {
			let url_ = AppConsts.remoteServiceBaseUrl + "/api/Aspose/GetReport";
			url_ = url_.replace(/[?&]$/, "");

			const content_ = JSON.stringify(info);
			const options_: any = {
				body: content_,
				observe: "response",
				responseType: "blob",
				headers: new HttpHeaders({
					"Content-Type": "application/json",
					"Accept": "application/json"
				})
			};

			abp.ui.setBusy();
			return self.http.request("post", url_, options_).pipe(
				mergeMap((response_: any) => {
					abp.ui.clearBusy();
					return (this as any).processGetReport(response_);
				})
			) as Observable<FileDto>;
		};
	}

	getRecentlyLinkedUsers(): void {
		// logic cũ
	}

	onMySettingsModalSaved(): void {
		// logic cũ
	}
}