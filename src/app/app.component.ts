import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule (ngIf, ngFor...)
import { RouterOutlet } from '@angular/router'; // Bắt buộc cho routing
import { HttpHeaders, HttpResponseBase } from '@angular/common/http';

import { AppConsts } from '@shared/AppConsts';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { SubscriptionStartType, API_BASE_URL, AsposeServiceProxy, ReportInfo, FileDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from 'shared/common/app-component-base';

// Import các Modal Components (Bắt buộc phải có trong imports array vì là Standalone)
import { LinkedAccountsModalComponent } from '@app/shared/layout/linked-accounts-modal.component';
import { LoginAttemptsModalComponent } from '@app/shared/layout/login-attempts-modal.component';
import { ChangePasswordModalComponent } from '@app/shared/layout/profile/change-password-modal.component';
import { ChangeProfilePictureModalComponent } from '@app/shared/layout/profile/change-profile-picture-modal.component';
import { MySettingsModalComponent } from '@app/shared/layout/profile/my-settings-modal.component';
import { NotificationSettingsModalComponent } from '@app/shared/layout/notifications/notification-settings-modal.component';
import { UserNotificationHelper } from '@app/shared/layout/notifications/UserNotificationHelper';
// Nếu bạn có ChatBarComponent, hãy import và thêm vào imports array
// import { ChatBarComponent } from '@app/shared/layout/chat/chat-bar.component'; 

import moment from 'moment';
import { Observable, Subject, throwError, of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';

@Component({
	selector: 'app-root', // Thêm selector nếu chưa có
	templateUrl: './app.component.html',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		CommonModule,
		RouterOutlet,
		// Import các Modal Components để dùng trong template
		LoginAttemptsModalComponent,
		LinkedAccountsModalComponent,
		ChangePasswordModalComponent,
		ChangeProfilePictureModalComponent,
		MySettingsModalComponent,
		NotificationSettingsModalComponent
		// ChatBarComponent
	]
})
export class AppComponent extends AppComponentBase implements OnInit, AfterViewInit {

	subscriptionStartType = SubscriptionStartType;
	theme: string;
	installationMode = true;

	// ViewChild giữ nguyên logic cũ
	@ViewChild('loginAttemptsModal') loginAttemptsModal: LoginAttemptsModalComponent;
	@ViewChild('linkedAccountsModal') linkedAccountsModal: LinkedAccountsModalComponent;
	@ViewChild('changePasswordModal') changePasswordModal: ChangePasswordModalComponent;
	@ViewChild('changeProfilePictureModal') changeProfilePictureModal: ChangeProfilePictureModalComponent;
	@ViewChild('mySettingsModal') mySettingsModal: MySettingsModalComponent;
	@ViewChild('notificationSettingsModal') notificationSettingsModal: NotificationSettingsModalComponent;
	// @ViewChild('chatBarComponent') chatBarComponent: ChatBarComponent;

	// REFACTOR: Sử dụng inject()
	private _userNotificationHelper = inject(UserNotificationHelper);
	private baseUrl = inject(API_BASE_URL, { optional: true });

	// Cache store tĩnh
	static cachedStore = {};

	constructor() {
		super(inject(Injector));
	}

	ngOnInit(): void {
		// Logic xử lý URL
		let url = location.href.substr(8);
		url = location.href.substr(0, 8) + url.substr(0, url.indexOf('/'));

		this._userNotificationHelper.settingsModal = this.notificationSettingsModal;
		this.theme = abp.setting.get('App.UiManagement.Theme').toLocaleLowerCase();
		this.installationMode = UrlHelper.isInstallUrl(location.href);

		// Khởi tạo các logic ghi đè (Overrides)
		this.overrideReportFunct();
		this.registerModalOpenEvents();
		this.registerGlobalPrototypes(); // Chuyển logic prototype xuống hàm này cho gọn
		this.registerGlobalAbpOverrides(); // Chuyển logic ABP overrides xuống đây
		this.initCachedApi();
	}

	ngAfterViewInit(): void {
		// abp.signalr.autoConnect = false;
	}

	// --- Logic Subscription ---
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

	// --- Logic Modal Events ---
	registerModalOpenEvents(): void {
		// Sử dụng arrow function để giữ 'this' context, không cần biến 'scope'
		abp.event.on('app.show.loginAttemptsModal', () => this.loginAttemptsModal.show());
		abp.event.on('app.show.linkedAccountsModal', () => this.linkedAccountsModal.show());
		abp.event.on('app.show.changePasswordModal', () => this.changePasswordModal.show());
		abp.event.on('app.show.changeProfilePictureModal', () => this.changeProfilePictureModal.show());
		abp.event.on('app.show.mySettingsModal', () => this.mySettingsModal.show());
	}

	getRecentlyLinkedUsers(): void {
		abp.event.trigger('app.getRecentlyLinkedUsers');
	}

	onMySettingsModalSaved(): void {
		abp.event.trigger('app.onMySettingsModalSaved');
	}

	// --- Helpers & Overrides ---

	parseStringToMoment(str) {
		return moment(str);
	}

	// Hàm này chứa các logic sửa đổi Prototype (Array, Date, String...)
	private registerGlobalPrototypes() {
		const scope = this;

		// Date & Moment Extensions
		Date.prototype['toISOString_old'] = Date.prototype.toISOString;
		Date.prototype.toISOString = function () {
			return moment(this).format(scope.s('gAMSProCore.DateTimeFormatClient'));
		};

		String.prototype['toMoment'] = function () {
			return scope.parseStringToMoment(this);
		};
		String.prototype['clone'] = function () {
			return scope.parseStringToMoment(this).clone();
		};
		String.prototype['format'] = function (opt) {
			return scope.parseStringToMoment(this).format(opt);
		};

		moment.prototype['toISOString_old'] = moment.prototype.toISOString;
		moment.prototype.toISOString = function () {
			return moment(this).format(scope.s('gAMSProCore.DateTimeFormatClient'));
		};

		var stringPrototype: any = String.prototype;
		stringPrototype.toISOString = function () {
			return this;
		};

		// Array Extensions
		Array.prototype.firstOrDefault = function (callbackfn: (value: any, index: number, array: any[]) => boolean, option1?: any) {
			let result = this;
			if (callbackfn) {
				result = this.filter(callbackfn);
			}
			return result.length > 0 ? result[0] : option1;
		};

		Array.prototype.sum = function (callbackfn?: (value: any, index: number, array: any[]) => number) {
			let sum = 0;
			this.forEach((item, index) => {
				let value = callbackfn ? callbackfn(item, index, this) : item;
				sum += value || 0;
			});
			return sum;
		};

		Array.prototype.sumWDefault = function (callbackfn?: (value: any, index: number, array: any[]) => number, valDefault?: any) {
			if (!this) return undefined;
			let sum = 0;
			this.forEach((item, index) => {
				let value = callbackfn ? callbackfn(item, index, this) : item;
				if (value == null || value == undefined) {
					value = valDefault;
				}
				sum += value || 0;
			});
			return sum;
		};

		const unique = (value, index, self) => {
			return self.indexOf(value) === index;
		};

		Array.prototype.distinct = function () {
			return this.filter(unique);
		};
	}

	private registerGlobalAbpOverrides() {
		// SweetAlert2 CSS Override via jQuery
		var css = `<style>
            button.swal2-confirm:before { white-space: pre!important; content: '${this.l('Yes')} \\A'!important; color: white; }
            button.swal2-cancel:before { white-space: pre!important; content: '${this.l('Cancel')} \\A'!important; color: white; }
        </style>`;
		$('body').prepend(css);

		// ABP UI Overrides
		let oldSetBusy = abp.ui.setBusy;
		abp.ui.setBusy = function (elm?: any, text?: any, optionsOrPromise?: any) {
			return oldSetBusy(elm, text, optionsOrPromise || 1);
		};

		let oldClearBusy = abp.ui.clearBusy as any;
		abp.ui.clearBusy = function (elm?: any, optionsOrPromise?: any) {
			return oldClearBusy(elm, optionsOrPromise || 1);
		};

		abp.multiTenancy.getTenantIdCookie = function () {
			return 1;
		};
		abp.multiTenancy.setTenantIdCookie = function () { };
	}

	// --- API & Report Handling ---

	cachedRequest(getRequestPrototype, methodName) {
		let waitingRequest = [];
		let requestPrototypeOld = getRequestPrototype();

		return function (params) {
			let subject = new Subject<any>();
			let key = methodName + JSON.stringify(params);
			let response = AppComponent.cachedStore[key];

			if (response) {
				setTimeout(() => {
					if (response['data']) {
						subject.next(response['data']);
					} else {
						waitingRequest.push(() => {
							subject.next(response['data']);
						});
					}
				});
			} else {
				AppComponent.cachedStore[key] = {};
				// Lưu ý: 'this' ở đây phải là instance của service gọi hàm này
				requestPrototypeOld.call(this, params).subscribe(response => {
					AppComponent.cachedStore[key]['data'] = response;
					subject.next(response);
					waitingRequest.forEach(x => x());
					waitingRequest = [];
				});
			}
			return subject.asObservable();
		};
	}

	initCachedApi() {
		// Ví dụ cách dùng:
		// BranchServiceProxy.prototype.cM_BRANCH_Search = this.cachedRequest(() => {
		//     return BranchServiceProxy.prototype.cM_BRANCH_Search;
		// }, 'cM_BRANCH_Search');
	}

	overrideReportFunct() {
		// Lưu lại context để dùng trong function bên dưới
		const self = this;

		// Monkey-patching phương thức getReport của AsposeServiceProxy
		AsposeServiceProxy.prototype.getReport = function (info: ReportInfo): Observable<FileDto> {
			let url_ = self.baseUrl + "/api/Aspose/GetReport"; // Sử dụng self.baseUrl đã inject
			url_ = url_.replace(/[?&]$/, "");

			const content_ = JSON.stringify(info);

			let options_: any = {
				body: content_,
				observe: "response",
				responseType: "blob",
				headers: new HttpHeaders({
					"Content-Type": "application/json",
					"Accept": "application/json"
				})
			};

			abp.ui.setBusy();

			// 'this' ở đây là instance của AsposeServiceProxy
			// Đảm bảo rằng 'this.http' tồn tại trên instance đó
			return this.http.request("post", url_, options_).pipe(
				mergeMap((response_: any) => {
					abp.ui.clearBusy();
					return this.processGetReport(response_); // Gọi method của ServiceProxy
				}),
				catchError((response_: any) => {
					abp.ui.clearBusy();
					if (response_ instanceof HttpResponseBase) {
						try {
							return this.processGetReport(<any>response_);
						} catch (e) {
							return throwError(() => e);
						}
					}
					return throwError(() => response_);
				})
			);
		};
	}
}