import { NgModule } from '@angular/core';
import { commonDeclarationImports } from '../core/ultils/CommonDeclarationModule';
import { MaterialStoreRoutingModule } from './material-store-routing.module';
import { MaterialStoreServiceProxyModule } from './material-store-service-proxy.module';
import { MWWarehouseListComponent } from './mw-warehouse/mw-warehouse-list.component';
import { MWWarehouseEditComponent } from './mw-warehouse/mw-warehouse-edit.component';
import { MWGroupListComponent } from './mw-group/mw-group-list.component';
import { MWGroupEditComponent } from './mw-group/mw-group-edit.component';
import { MWTypeListComponent } from './mw-type/crud/mw-type-list.component';
import { MWTypeEditComponent } from './mw-type/crud/mw-type-edit.component';
import { MWTypeImportComponent } from './mw-type/mw-type-import/mw-type-import.component';
import { MWTypeSupplierPriceEdittableComponent } from './mw-type/crud/edittable/mw-type-supplier-price-edittable.component';


export const materialStoreComponent = [
    
]

@NgModule({
    imports: [
        MaterialStoreRoutingModule,
        MaterialStoreServiceProxyModule,
        ...commonDeclarationImports,
    ],
    declarations: [
        // Kho vật tư nguyên liệu
        MWWarehouseListComponent, MWWarehouseEditComponent,
        // Nhóm vật liệu
        MWGroupListComponent, MWGroupEditComponent,
        // Loại vật liệu
        MWTypeListComponent, MWTypeEditComponent,MWTypeImportComponent, MWTypeSupplierPriceEdittableComponent
    ],
    exports: [

    ],
    providers: [

    ]
})
export class MaterialStoreModule { }
