import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { MWWarehouseEditComponent } from './mw-warehouse/mw-warehouse-edit.component';
import { MWWarehouseListComponent } from './mw-warehouse/mw-warehouse-list.component';
import { MWGroupListComponent } from './mw-group/mw-group-list.component';
import { MWGroupEditComponent } from './mw-group/mw-group-edit.component';
import { MWTypeListComponent } from './mw-type/crud/mw-type-list.component';
import { MWTypeEditComponent } from './mw-type/crud/mw-type-edit.component';
import { MWTypeImportComponent } from './mw-type/mw-type-import/mw-type-import.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    // Kho vật tư nguyên liệu
                    { path: 'mw-warehouse', component: MWWarehouseListComponent, data: { permission: 'Pages.Administration.MWWarehouse' } },
                    { path: 'mw-warehouse-add', component: MWWarehouseEditComponent, data: { permission: 'Pages.Administration.MWWarehouse.Create', editPageState: EditPageState.add } },
                    { path: 'mw-warehouse-edit', component: MWWarehouseEditComponent, data: { permission: 'Pages.Administration.MWWarehouse.Edit', editPageState: EditPageState.edit } },
                    { path: 'mw-warehouse-view', component: MWWarehouseEditComponent, data: { permission: 'Pages.Administration.MWWarehouse.View', editPageState: EditPageState.viewDetail } },
                    
                    // Nhóm vật liệu
                    { path: 'mw-group', component: MWGroupListComponent, data: { permission: 'Pages.Administration.MWGroup' } },
                    { path: 'mw-group-add', component: MWGroupEditComponent, data: { permission: 'Pages.Administration.MWGroup.Create', editPageState: EditPageState.add } },
                    { path: 'mw-group-edit', component: MWGroupEditComponent, data: { permission: 'Pages.Administration.MWGroup.Edit', editPageState: EditPageState.edit } },
                    { path: 'mw-group-view', component: MWGroupEditComponent, data: { permission: 'Pages.Administration.MWGroup.View', editPageState: EditPageState.viewDetail } },
                    
                    // Loại vật liệu
                    { path: 'mw-type', component: MWTypeListComponent, data: { permission: 'Pages.Administration.MWType' } },
                    { path: 'mw-type-add', component: MWTypeEditComponent, data: { permission: 'Pages.Administration.MWType.Create', editPageState: EditPageState.add } },
                    { path: 'mw-type-edit', component: MWTypeEditComponent, data: { permission: 'Pages.Administration.MWType.Edit', editPageState: EditPageState.edit } },
                    { path: 'mw-type-view', component: MWTypeEditComponent, data: { permission: 'Pages.Administration.MWType.View', editPageState: EditPageState.viewDetail } },
                
                    // Import loại vật liệu
                    { path: 'mw-type-import', component: MWTypeImportComponent, data: { permission: 'Pages.Administration.MWTypeImport' } },  
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MaterialStoreRoutingModule {

    constructor(
        router: Router
    ) {
        router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                window.scroll(0, 0);
            }
        });
    }
}
