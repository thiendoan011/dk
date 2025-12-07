import { Component, Injector, ViewEncapsulation, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppComponentBase } from '@shared/common/app-component-base';
import { NotificationServiceProxy, UserNotification } from '@shared/service-proxies/service-proxies';
import { UserNotificationHelper } from './UserNotificationHelper';
import moment from 'moment';
import { AppCommonModule } from '@app/shared/common/app-common.module';
// Hoặc import lẻ nếu muốn tối ưu: import { PaginatorModule } from 'primeng/paginator'

@Component({
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.less'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AppCommonModule // Import module chung chứa PrimeNG Table/Paginator
    ]
})
export class NotificationsComponent extends AppComponentBase implements OnInit {

    // Helper pagination (nếu dùng PrimengTableHelper)
    // primengTableHelper = new PrimengTableHelper(); 

    readStateFilter = 'ALL';
    dateRange: Date[] = [moment().startOf('day').toDate(), moment().endOf('day').toDate()];
    loading = false;
    notifications: any[] = []; // Sửa type cho đúng IFormattedUserNotification

    private readonly _notificationService = inject(NotificationServiceProxy);
    private readonly _userNotificationHelper = inject(UserNotificationHelper);

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        this.getNotifications();
    }

    reloadPage(): void {
        this.getNotifications();
    }

    getNotifications(): void {
        this.loading = true;
        // Gọi API lấy danh sách thông báo với 3 tham số đúng: state, maxResultCount, skipCount
        this._notificationService.getUserNotifications(
            this.readStateFilter === 'ALL' ? undefined : (this.readStateFilter === 'UNREAD' ? 0 : 1),
            undefined,  // maxResultCount - undefined to get all
            0  // skipCount - start from 0
        ).subscribe(result => {
            this.loading = false;
            this.notifications = result.items.map(item => this._userNotificationHelper.format(item));
        });
    }

    setAsRead(record: any): void {
        this.setNotificationAsRead(record, () => {
            this.getNotifications();
        });
    }

    setNotificationAsRead(userNotification: any, callback: () => void): void {
        this._userNotificationHelper.setAsRead(userNotification.userNotificationId, () => {
            if (callback) {
                callback();
            }
        });
    }

    // ... Các hàm helper khác như delete, setAllAsRead...
}