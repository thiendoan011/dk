import { Component, Injector, OnInit, ViewEncapsulation, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { NotificationServiceProxy, UserNotification } from '@shared/service-proxies/service-proxies';
import { IFormattedUserNotification, UserNotificationHelper } from './UserNotificationHelper';
import { MomentFromNowPipe } from "../../../../shared/utils/moment-from-now.pipe";

@Component({
    selector: 'header-notifications',
    templateUrl: './header-notifications.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MomentFromNowPipe
    ]
})
export class HeaderNotificationsComponent extends AppComponentBase implements OnInit {

    notifications: IFormattedUserNotification[] = [];
    unreadNotificationCount = 0;

    // Inject Dependencies
    private readonly _notificationService = inject(NotificationServiceProxy);
    private readonly _userNotificationHelper = inject(UserNotificationHelper);
    private readonly _zone = inject(NgZone);

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        this.loadNotifications();
        this.registerToEvents();
    }

    loadNotifications(): void {
        // Gọi API load notifications
        // Demo logic:
        this._notificationService.getUserNotifications(undefined, undefined, undefined)
            .subscribe(result => {
                this.unreadNotificationCount = result.unreadCount;
                this.notifications = [];
                result.items.forEach(item => {
                    this.notifications.push(this._userNotificationHelper.format(item));
                });
            });
    }

    registerToEvents() {
        // Lắng nghe sự kiện realtime từ SignalR (abp.event)
        abp.event.on('abp.notifications.received', (userNotification) => {
            this._zone.run(() => { // Cần chạy trong Zone để update UI
                this._userNotificationHelper.show(userNotification);
                this.loadNotifications();
            });
        });

        abp.event.on('app.notifications.refresh', () => {
            this._zone.run(() => {
                this.loadNotifications();
            });
        });

        abp.event.on('abp.notifications.read', (userNotificationId) => {
            this._zone.run(() => {
                this.loadNotifications();
            });
        });
    }

    setAllNotificationsAsRead(): void {
        this._userNotificationHelper.setAllAsRead(() => {
            this.loadNotifications();
        });
    }

    openNotificationSettingsModal(): void {
        // Logic mở modal settings thông qua Global Event hoặc ViewChild từ AppComponent
        // Cách tốt hơn: Dùng Service để mở Modal, hoặc emit event
        abp.event.trigger('app.show.notificationSettingsModal');
    }

    setNotificationAsRead(userNotification: IFormattedUserNotification): void {
        if (userNotification.state !== 'READ') {
            this._userNotificationHelper.setAsRead(userNotification.userNotificationId, () => {
                this.loadNotifications();
            });
        }
    }
}