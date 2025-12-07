import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { FREFreightEditComponent } from './fre-freight/fre-freight-edit.component';
import { FREFreightListComponent } from './fre-freight/fre-freight-list.component';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { FRELocationListComponent } from './fre-location/fre-location-list.component';
import { FRELocationEditComponent } from './fre-location/fre-location-edit.component';
import { FREGoodsEditComponent } from './fre-goods/fre-goods-edit.component';
import { FREGoodsListComponent } from './fre-goods/fre-goods-list.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    // Phiếu vận chuyển hàng hóa
                    { path: 'fre-freight', component: FREFreightListComponent, data: { permission: 'Pages.Administration.FREFreight' } },
                    { path: 'fre-freight-add', component: FREFreightEditComponent, data: { permission: 'Pages.Administration.FREFreight.Create', editPageState: EditPageState.add } },
                    { path: 'fre-freight-edit', component: FREFreightEditComponent, data: { permission: 'Pages.Administration.FREFreight.Edit', editPageState: EditPageState.edit } },
                    { path: 'fre-freight-view', component: FREFreightEditComponent, data: { permission: 'Pages.Administration.FREFreight.View', editPageState: EditPageState.viewDetail } },
                    // Địa điểm
                    { path: 'fre-location', component: FRELocationListComponent, data: { permission: 'Pages.Administration.FRELocation' } },
                    { path: 'fre-location-add', component: FRELocationEditComponent, data: { permission: 'Pages.Administration.FRELocation.Create', editPageState: EditPageState.add } },
                    { path: 'fre-location-edit', component: FRELocationEditComponent, data: { permission: 'Pages.Administration.FRELocation.Edit', editPageState: EditPageState.edit } },
                    { path: 'fre-location-view', component: FRELocationEditComponent, data: { permission: 'Pages.Administration.FRELocation.View', editPageState: EditPageState.viewDetail } },
                    // Hàng hóa
                    { path: 'fre-goods', component: FREGoodsListComponent, data: { permission: 'Pages.Administration.FREGoods' } },
                    { path: 'fre-goods-add', component: FREGoodsEditComponent, data: { permission: 'Pages.Administration.FREGoods.Create', editPageState: EditPageState.add } },
                    { path: 'fre-goods-edit', component: FREGoodsEditComponent, data: { permission: 'Pages.Administration.FREGoods.Edit', editPageState: EditPageState.edit } },
                    { path: 'fre-goods-view', component: FREGoodsEditComponent, data: { permission: 'Pages.Administration.FREGoods.View', editPageState: EditPageState.viewDetail } },
                    
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})

export class FreightRoutingModule {

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
