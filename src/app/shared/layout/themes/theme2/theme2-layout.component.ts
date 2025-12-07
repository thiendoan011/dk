import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// Import Base Class
import { ThemesLayoutBaseComponent } from '../themes-layout-base.component';
import { UrlHelper } from '@shared/helpers/UrlHelper';

// Import Components con
import { Theme2BrandComponent } from './theme2-brand.component';
import { SideBarMenuComponent } from '@app/shared/layout/nav/side-bar-menu.component';
import { TopBarMenuComponent } from '@app/shared/layout/nav/top-bar-menu.component';
import { HeaderNotificationsComponent } from '@app/shared/layout/notifications/header-notifications.component';
import { UserMenuComponent } from '@app/shared/layout/nav/user-menu.component'; // Đảm bảo bạn có component này
import { FooterComponent } from '@app/shared/layout/footer.component';

@Component({
    selector: 'theme2-layout',
    templateUrl: './theme2-layout.component.html',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        RouterOutlet,
        Theme2BrandComponent,
        SideBarMenuComponent,
        TopBarMenuComponent,
        HeaderNotificationsComponent,
        UserMenuComponent, // Nếu chưa có, hãy comment dòng này lại
        FooterComponent
    ]
})
export class Theme2LayoutComponent extends ThemesLayoutBaseComponent implements OnInit {

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
    }
}