import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { VHEVehicleEditComponent } from './vhe-vehicle/vhe-vehicle-edit.component';
import { VHEVehicleListComponent } from './vhe-vehicle/vhe-vehicle-list.component';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { VHEDriverListComponent } from './vhe-driver/vhe-driver-list.component';
import { VHEDriverEditComponent } from './vhe-driver/vhe-driver-edit.component';
import { VHEVehicleRequestListComponent } from './vhe-vehicle-request/vhe-vehicle-request-list.component';
import { VHEVehicleRequestEditComponent } from './vhe-vehicle-request/vhe-vehicle-request-edit.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    // Xe
                    { path: 'vhe-vehicle', component: VHEVehicleListComponent, data: { permission: 'Pages.Administration.VHEVehicle' } },
                    { path: 'vhe-vehicle-add', component: VHEVehicleEditComponent, data: { permission: 'Pages.Administration.VHEVehicle.Create', editPageState: EditPageState.add } },
                    { path: 'vhe-vehicle-edit', component: VHEVehicleEditComponent, data: { permission: 'Pages.Administration.VHEVehicle.Edit', editPageState: EditPageState.edit } },
                    { path: 'vhe-vehicle-view', component: VHEVehicleEditComponent, data: { permission: 'Pages.Administration.VHEVehicle.View', editPageState: EditPageState.viewDetail } },
                    // Tài xế
                    { path: 'vhe-driver', component: VHEDriverListComponent, data: { permission: 'Pages.Administration.VHEDriver' } },
                    { path: 'vhe-driver-add', component: VHEDriverEditComponent, data: { permission: 'Pages.Administration.VHEDriver.Create', editPageState: EditPageState.add } },
                    { path: 'vhe-driver-edit', component: VHEDriverEditComponent, data: { permission: 'Pages.Administration.VHEDriver.Edit', editPageState: EditPageState.edit } },
                    { path: 'vhe-driver-view', component: VHEDriverEditComponent, data: { permission: 'Pages.Administration.VHEDriver.View', editPageState: EditPageState.viewDetail } },
                    // Phiếu yêu cầu xe
                    { path: 'vhe-vehicle-request', component: VHEVehicleRequestListComponent, data: { permission: 'Pages.Administration.VHEVehicleRequest' } },
                    { path: 'vhe-vehicle-request-add', component: VHEVehicleRequestEditComponent, data: { permission: 'Pages.Administration.VHEVehicleRequest.Create', editPageState: EditPageState.add } },
                    { path: 'vhe-vehicle-request-edit', component: VHEVehicleRequestEditComponent, data: { permission: 'Pages.Administration.VHEVehicleRequest.Edit', editPageState: EditPageState.edit } },
                    { path: 'vhe-vehicle-request-view', component: VHEVehicleRequestEditComponent, data: { permission: 'Pages.Administration.VHEVehicleRequest.View', editPageState: EditPageState.viewDetail } },
                    
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})

export class VehicleRoutingModule {

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
