import { NgModule } from '@angular/core';
import { commonDeclarationImports } from '../core/ultils/CommonDeclarationModule';
import { PlanMasterRoutingModule } from './plan-master-routing.module';
import { PlanMasterServiceProxyModule } from './plan-master-service-proxy.module';
import { RptCapacityBalancingListComponent } from './report/rpt-capacity-balancing/rpt-capacity-balancing-list.component';
import { RptCapacityBalancingEditComponent } from './report/rpt-capacity-balancing/rpt-capacity-balancing-edit.component';
import { CapacityBalancingComponent } from './report/rpt-capacity-balancing/capacity-balancing/capacity-balancing.component';
@NgModule({
    imports: [
        ...commonDeclarationImports,
        PlanMasterRoutingModule,
        PlanMasterServiceProxyModule
    ],
    declarations: [
        RptCapacityBalancingListComponent, RptCapacityBalancingEditComponent, CapacityBalancingComponent
    ],
    exports: [

    ],
    providers: [

    ]
})
export class PlanMasterModule { }
