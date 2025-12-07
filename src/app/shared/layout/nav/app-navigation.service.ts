import { Injectable, inject } from '@angular/core';
import { AppMenu } from './app-menu';
import { AppMenuItem } from './app-menu-item';
import { AppMenuServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { PermissionCheckerService } from 'abp-ng2-module'; // Hoặc đường dẫn đúng trong project của bạn
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppNavigationService {

    // 1. Inject Dependencies bằng inject()
    private readonly _permissionCheckerService = inject(PermissionCheckerService);
    private readonly _appSessionService = inject(AppSessionService);
    private readonly _appMenuService = inject(AppMenuServiceProxy);

    // Biến static để lưu cache hoặc truy cập global nếu code cũ cần
    static appMenus: AppMenuItem[] = [];

    constructor() { }

    // 2. Logic lấy menu từ API (đã được refactor)
    getMenus(): Observable<AppMenu> {
        const subject = new Subject<AppMenu>();

        this.getMenuList().subscribe(appMenus => {
            this.buildTreeMenu(appMenus);
            // Lọc các item cấp 1 (không có parent) để tạo Root Menu
            const menu = new AppMenu('MainMenu', 'MainMenu', appMenus.filter(x => x.parent == null));
            subject.next(menu);
            subject.complete();
        });

        return subject.asObservable();
    }

    // 3. Hàm lấy danh sách phẳng từ Server
    getMenuList(): Observable<AppMenuItem[]> {
        const subject = new Subject<AppMenuItem[]>();

        this._appMenuService.getAllMenus().subscribe(response => {
            let appMenus: AppMenuItem[] = [];

            // Lọc theo permission ngay khi nhận dữ liệu
            const filteredResponse = response.filter(x => this._permissionCheckerService.isGranted(x.permissionName));

            filteredResponse.forEach(x => {
                const appMenu = new AppMenuItem(x.name, x.permissionName, x.icon, x.route);
                appMenu.id = x.menuId; // Giả định AppMenuItem có property id/parentId (cần thêm vào class nếu thiếu)
                appMenu.parentId = x.parentId;
                appMenu.items = [];
                appMenus.push(appMenu);
            });

            AppNavigationService.appMenus = appMenus;
            subject.next(appMenus);
            subject.complete();
        });

        return subject.asObservable();
    }

    // 4. Hàm chuyển danh sách phẳng sang cây (Tree)
    buildTreeMenu(appMenus: AppMenuItem[]) {
        const dist = {};

        // Map ID
        appMenus.forEach((x) => {
            dist[x.id] = x;
        });

        // Gán con vào cha
        appMenus.forEach((x) => {
            const parent = dist[x.parentId];
            if (parent) {
                parent.items.push(x);
                x.parent = parent;
            }
        });
    }

    // 5. Logic check permission đệ quy
    checkChildMenuItemPermission(menuItem: AppMenuItem): boolean {
        if (menuItem.permissionName && this._permissionCheckerService.isGranted(menuItem.permissionName)) {
            return true;
        }

        if (menuItem.items && menuItem.items.length) {
            for (let i = 0; i < menuItem.items.length; i++) {
                if (this.checkChildMenuItemPermission(menuItem.items[i])) {
                    return true;
                }
            }
        }
        return false;
    }

    // 6. Logic ẩn hiện menu (bao gồm check Feature, Auth, Permission)
    showMenuItem(menuItem: AppMenuItem): boolean {
        // Logic nghiệp vụ riêng: Ẩn Subscription nếu Tenant chưa có Edition
        if (menuItem.permissionName === 'Pages.Administration.Tenant.SubscriptionManagement' &&
            this._appSessionService.tenant &&
            !this._appSessionService.tenant.edition) {
            return false;
        }

        if (menuItem.requiresAuthentication && !this._appSessionService.user) {
            return false;
        }

        if (menuItem.permissionName && !this._permissionCheckerService.isGranted(menuItem.permissionName)) {
            return false;
        }

        if (menuItem.hasFeatureDependency() && !menuItem.featureDependencySatisfied()) {
            return false;
        }

        // Nếu là menu cha (có con), kiểm tra xem có con nào được phép hiện không
        if (menuItem.items && menuItem.items.length) {
            return this.checkChildMenuItemPermission(menuItem);
        }

        return true;
    }
}