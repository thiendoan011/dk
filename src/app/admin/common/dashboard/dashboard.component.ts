import { ViewEncapsulation, Component, Injector } from "@angular/core";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";

@Component({
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class DashboardComponent extends DefaultComponentBase{

    constructor(injector: Injector) {
        super(injector);
    }
    ngOnInit(): void {

    }
}