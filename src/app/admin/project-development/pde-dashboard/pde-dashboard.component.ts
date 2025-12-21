import { ViewEncapsulation, Component, Injector,OnInit } from "@angular/core";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";

@Component({
    templateUrl: './pde-dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PDEDashboardComponent extends DefaultComponentBase implements OnInit{

    constructor(injector: Injector) {
        super(injector);
    }
    ngOnInit(): void {

    }
}