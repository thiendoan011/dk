import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                   // { path: 'dashboard', component: DashboardComponent, data: { permission: 'Pages.Tenant.Dashboard' } }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MainRoutingModule { }
