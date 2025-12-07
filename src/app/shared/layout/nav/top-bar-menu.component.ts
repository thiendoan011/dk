import { Component, Injector, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppMenu } from './app-menu';
import { AppNavigationService } from './app-navigation.service';
import { MenuListComponent } from './menu-list/menu-list.component';

@Component({
    templateUrl: './top-bar-menu.component.html',
    selector: 'top-bar-menu',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        MenuListComponent
    ]
})
export class TopBarMenuComponent extends AppComponentBase implements OnInit {

    menu: AppMenu | null = null;

    private readonly _appNavigationService = inject(AppNavigationService);

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        // SUBSCRIBE Observable từ Service mới
        this._appNavigationService.getMenus().subscribe(menu => {
            this.menu = menu;
        });
    }

    showMenuItem(menuItem): boolean {
        return this._appNavigationService.showMenuItem(menuItem);
    }
}