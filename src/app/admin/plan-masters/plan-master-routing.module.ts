import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { RptCapacityBalancingEditComponent } from './report/rpt-capacity-balancing/rpt-capacity-balancing-edit.component';
import { RptCapacityBalancingListComponent } from './report/rpt-capacity-balancing/rpt-capacity-balancing-list.component';
import { CapacityBalancingComponent } from './report/rpt-capacity-balancing/capacity-balancing/capacity-balancing.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    // Cân đối năng lực
                    { path: 'rpt-capacity-balancing', component: RptCapacityBalancingListComponent, data: { permission: 'Pages.Administration.RptCapacityBalancing' } },
                    { path: 'rpt-capacity-balancing-add', component: RptCapacityBalancingEditComponent, data: { permission: 'Pages.Administration.RptCapacityBalancing.Create', editPageState: EditPageState.add } },
                    { path: 'rpt-capacity-balancing-edit', component: RptCapacityBalancingEditComponent, data: { permission: 'Pages.Administration.RptCapacityBalancing.Edit', editPageState: EditPageState.edit } },
                    { path: 'rpt-capacity-balancing-view', component: RptCapacityBalancingEditComponent, data: { permission: 'Pages.Administration.RptCapacityBalancing.View', editPageState: EditPageState.viewDetail } },
                    // Cân đối năng lực excel
                    { path: 'capacity-balancing', component: CapacityBalancingComponent, data: { permission: 'Pages.Administration.CapacityBalancing' } },

                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class PlanMasterRoutingModule {

    constructor(
        private router: Router
    ) {
        router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                window.scroll(0, 0);
            }
        });
    }
}
