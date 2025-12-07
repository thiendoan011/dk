import { NgModule } from '@angular/core';
import { commonDeclarationImports } from '../core/ultils/CommonDeclarationModule';
import { VehicleRoutingModule } from './vehicle-routing.module';
import { VehicleServiceProxyModule } from './vehicle-service-proxy.module';
import { VHEVehicleListComponent } from './vhe-vehicle/vhe-vehicle-list.component';
import { VHEVehicleEditComponent } from './vhe-vehicle/vhe-vehicle-edit.component';
import { VHEDriverListComponent } from './vhe-driver/vhe-driver-list.component';
import { VHEDriverEditComponent } from './vhe-driver/vhe-driver-edit.component';
import { VHEVehicleRequestEditComponent } from './vhe-vehicle-request/vhe-vehicle-request-edit.component';
import { VHEVehicleRequestListComponent } from './vhe-vehicle-request/vhe-vehicle-request-list.component';
@NgModule({
    imports: [
        commonDeclarationImports,
        VehicleRoutingModule,
        VehicleServiceProxyModule,
    ],
    declarations: [
        // Vận chuyển hàng hóa
        VHEVehicleListComponent, VHEVehicleEditComponent,
        // Tài xế
        VHEDriverEditComponent, VHEDriverListComponent,
        // Phiếu yêu cầu xe
        VHEVehicleRequestEditComponent,VHEVehicleRequestListComponent,
    ],
    exports: [

    ],
    providers: [

    ]
})
export class VehicleModule { }
