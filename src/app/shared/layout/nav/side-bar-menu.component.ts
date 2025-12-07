import { Component, Injector, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppMenu } from './app-menu';
import { AppNavigationService } from './app-navigation.service';
import { MenuListComponent } from './menu-list/menu-list.component';

@Component({
    templateUrl: './side-bar-menu.component.html',
    selector: 'side-bar-menu',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        MenuListComponent // Import component con để đệ quy
    ]
})
export class SideBarMenuComponent extends AppComponentBase implements OnInit {

    menu: AppMenu | null = null; // Khởi tạo null

    private readonly _appNavigationService = inject(AppNavigationService);

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        // SUBSCRIBE Observable từ Service mới
        this._appNavigationService.getMenus().subscribe(menu => {
            this.menu = menu;
            // Nếu cần trigger change detection thủ công (nếu dùng OnPush):
            // this.cdr.markForCheck(); 
        });
    }

    showMenuItem(menuItem): boolean {
        // Logic ẩn hiện item gọi từ Service
        return this._appNavigationService.showMenuItem(menuItem);
    }
}