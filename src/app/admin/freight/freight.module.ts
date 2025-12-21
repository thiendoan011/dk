import { NgModule } from '@angular/core';
import { commonDeclarationImports } from '../core/ultils/CommonDeclarationModule';
import { FreightRoutingModule } from './freight-routing.module';
import { FreightServiceProxyModule } from './freight-service-proxy.module';
import { FREFreightEditComponent } from './fre-freight/fre-freight-edit.component';
import { FREFreightListComponent } from './fre-freight/fre-freight-list.component';
import { FRELocationEditComponent } from './fre-location/fre-location-edit.component';
import { FRELocationListComponent } from './fre-location/fre-location-list.component';
import { FREFreightGoodEdittableComponent } from './fre-freight/edittable/fre-freight-good-edittable.component';
import { FREFreightRouteEdittableComponent } from './fre-freight/edittable/fre-freight-route-edittable.component';
import { FREFreightVehicleRequestEdittableComponent } from './fre-freight/edittable/fre-freight-vehicle-request-edittable.component';
import { FREFreightGoodUserEdittableComponent } from './fre-freight/edittable/fre-freight-good-user-edittable.component';
import { FREGoodsListComponent } from './fre-goods/fre-goods-list.component';
import { FREGoodsEditComponent } from './fre-goods/fre-goods-edit.component';
@NgModule({
    imports: [
        commonDeclarationImports,
        FreightRoutingModule,
        FreightServiceProxyModule,
    ],
    declarations: [
        // Vận chuyển hàng hóa
        FREFreightListComponent, FREFreightEditComponent,
            // Editable vận chuyển hàng hóa
            FREFreightRouteEdittableComponent, FREFreightGoodEdittableComponent, 
            FREFreightGoodUserEdittableComponent, FREFreightVehicleRequestEdittableComponent,
        // Địa điểm
        FRELocationListComponent, FRELocationEditComponent,
        //Hàng hóa
        FREGoodsListComponent, FREGoodsEditComponent,
    ],
    exports: [

    ],
    providers: [

    ]
})
export class FreightModule { }
