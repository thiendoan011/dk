import { Component, Injector, Input } from "@angular/core";
import { AppMenu } from "../app-menu";
import { AppNavigationService } from "../app-navigation.service";
import { AppComponentBase } from "@shared/common/app-component-base";

@Component({
    templateUrl: './menu-list.component.html',
    selector: 'app-menu-list',
    standalone: true
})
export class MenuListComponent extends AppComponentBase {
    @Input() item: any; // Menu item passed from parent component
    menu: AppMenu = new AppMenu(null, null, null);
    constructor(injector: Injector,
        private _appNavigationService: AppNavigationService) {
        super(injector);
    }
    loadMenu() {
        this._appNavigationService.getMenus().subscribe(menu => {
            this.menu = menu;
        });
    }
}
