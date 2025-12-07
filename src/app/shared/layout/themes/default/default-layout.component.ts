import { Component, Injector, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; // Bắt buộc để dùng <router-outlet>

// 1. Import Base Class
import { ThemesLayoutBaseComponent } from '../themes-layout-base.component';

// 2. Import các Component con được dùng trong HTML
import { DefaultBrandComponent } from './default-brand.component';
import { SideBarMenuComponent } from '@app/shared/layout/nav/side-bar-menu.component';
import { TopBarMenuComponent } from '@app/shared/layout/nav/top-bar-menu.component';
import { HeaderNotificationsComponent } from '@app/shared/layout/notifications/header-notifications.component';
import { UserMenuComponent } from '@app/shared/layout/nav/user-menu.component';
import { FooterComponent } from '@app/shared/layout/footer.component';

@Component({
    selector: 'default-layout',
    templateUrl: './default-layout.component.html',
    standalone: true, // BẮT BUỘC
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        RouterOutlet, // Để hiển thị nội dung trang con

        // Import các component giao diện
        DefaultBrandComponent,
        SideBarMenuComponent,
        TopBarMenuComponent,
        HeaderNotificationsComponent,
        UserMenuComponent,
        FooterComponent
    ]
})
export class DefaultLayoutComponent extends ThemesLayoutBaseComponent implements OnInit {

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        // Logic init riêng cho Default Theme
    }
}