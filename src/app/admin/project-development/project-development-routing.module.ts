import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { PDEGroupProductListComponent } from './pde-group-product/pde-group-product-list.component';
import { PDEGroupProductEditComponent } from './pde-group-product/pde-group-product-edit.component';
import { PDEProductListComponent } from './pde-product/pde-product-list.component';
import { PDEProductEditComponent } from './pde-product/pde-product-edit.component';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { PDEReqPriceEditComponent } from './pde-req-price/pde-req-price-edit.component';
import { PDEReqPriceListComponent } from './pde-req-price/pde-req-price-list.component';
import { PDEProgressPriceListComponent } from './pde-progress-price/pde-progress-price-list.component';
import { PDEProgressPriceEditComponent } from './pde-progress-price/pde-progress-price-edit.component';
import { PDEReqTemplateListComponent } from './pde-req-template/pde-req-template-list.component';
import { PDEReqTemplateEditComponent } from './pde-req-template/pde-req-template-edit.component';
import { PDEProgressTemplateEditComponent } from './pde-progress-template/pde-progress-template-edit.component';
import { PDEProgressTemplateListComponent } from './pde-progress-template/pde-progress-template-list.component';
import { PDEReqTablehardwareListComponent } from './pde-req-tablehardware/pde-req-tablehardware-list.component';
import { PDEProgressTablehardwareListComponent } from './pde-progress-tablehardware/pde-progress-tablehardware-list.component';
import { PDEProgressTablehardwareEditComponent } from './pde-progress-tablehardware/pde-progress-tablehardware-edit.component';
import { PDEReqTablehardwareEditComponent } from './pde-req-tablehardware/pde-req-tablehardware-edit.component';
import { PDEReqTablecolorListComponent } from './pde-req-tablecolor/pde-req-tablecolor-list.component';
import { PDEReqTablecolorEditComponent } from './pde-req-tablecolor/pde-req-tablecolor-edit.component';
import { PDEProgressTablecolorListComponent } from './pde-progress-tablecolor/pde-progress-tablecolor-list.component';
import { PDEProgressTablecolorEditComponent } from './pde-progress-tablecolor/pde-progress-tablecolor-edit.component';
import { PDEDashboardComponent } from './pde-dashboard/pde-dashboard.component';
import { PDEReqHardwareListComponent } from './pde-req-hardware/pde-req-hardware-list.component';
import { PDEReqHardwareEditComponent } from './pde-req-hardware/pde-req-hardware-edit.component';
import { PDEProgressHardwareEditComponent } from './pde-progress-hardware/pde-progress-hardware-edit.component';
import { PDEProgressHardwareListComponent } from './pde-progress-hardware/pde-progress-hardware-list.component';
import { PDEProgressNormalEditComponent } from './pde-progress-normal/pde-progress-normal-edit.component';
import { PDEReqNormalEditComponent } from './pde-req-normal/pde-req-normal-edit.component';
import { PDEReqNormalListComponent } from './pde-req-normal/pde-req-normal-list.component';
import { PDEProgressNormalListComponent } from './pde-progress-normal/pde-progress-normal-list.component';
import { PDEReqNormalCreateListComponent } from './pde-req-normal-create/pde-req-normal-create-list.component';
import { PDEReqNormalCreateEditComponent } from './pde-req-normal-create/pde-req-normal-create-edit.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    // Dashboard
                    { path: 'pde-dashboard', component: PDEDashboardComponent, data: { permission: 'Pages.Administration.PDEDashboard' } },

                    // sản phẩm
                    { path: 'pde-product', component: PDEProductListComponent, data: { permission: 'Pages.Administration.PDEProduct' } },
                    { path: 'pde-product-add', component: PDEProductEditComponent, data: { permission: 'Pages.Administration.PDEProduct.Create', editPageState: EditPageState.add } },
                    { path: 'pde-product-edit', component: PDEProductEditComponent, data: { permission: 'Pages.Administration.PDEProduct.Edit', editPageState: EditPageState.edit } },
                    { path: 'pde-product-view', component: PDEProductEditComponent, data: { permission: 'Pages.Administration.PDEProduct.View', editPageState: EditPageState.viewDetail } },
                    
                    // hệ hàng
                    { path: 'pde-group-product', component: PDEGroupProductListComponent, data: { permission: 'Pages.Administration.PDEGroupProduct' } },
                    { path: 'pde-group-product-add', component: PDEGroupProductEditComponent, data: { permission: 'Pages.Administration.PDEGroupProduct.Create', editPageState: EditPageState.add } },
                    { path: 'pde-group-product-edit', component: PDEGroupProductEditComponent, data: { permission: 'Pages.Administration.PDEGroupProduct.Edit', editPageState: EditPageState.edit } },
                    { path: 'pde-group-product-view', component: PDEGroupProductEditComponent, data: { permission: 'Pages.Administration.PDEGroupProduct.View', editPageState: EditPageState.viewDetail } },

                    // PYC báo giá
                    { path: 'pde-req-price', component: PDEReqPriceListComponent, data: { permission: 'Pages.Administration.PDEReqPrice' } },
                    { path: 'pde-req-price-add', component: PDEReqPriceEditComponent, data: { permission: 'Pages.Administration.PDEReqPrice.Create', editPageState: EditPageState.add } },
                    { path: 'pde-req-price-edit', component: PDEReqPriceEditComponent, data: { permission: 'Pages.Administration.PDEReqPrice.Edit', editPageState: EditPageState.edit } },
                    { path: 'pde-req-price-view', component: PDEReqPriceEditComponent, data: { permission: 'Pages.Administration.PDEReqPrice.View', editPageState: EditPageState.viewDetail } },

                    // Tiến độ báo giá
                    { path: 'pde-progress-price', component: PDEProgressPriceListComponent, data: { permission: 'Pages.Administration.PDEProgressPrice' } },
                    { path: 'pde-progress-price-add', component: PDEProgressPriceEditComponent, data: { permission: 'Pages.Administration.PDEProgressPrice.Create', editPageState: EditPageState.add } },
                    { path: 'pde-progress-price-edit', component: PDEProgressPriceEditComponent, data: { permission: 'Pages.Administration.PDEProgressPrice.Edit', editPageState: EditPageState.edit } },
                    { path: 'pde-progress-price-view', component: PDEProgressPriceEditComponent, data: { permission: 'Pages.Administration.PDEProgressPrice.View', editPageState: EditPageState.viewDetail } },

                    // PYC làm mẫu
                    { path: 'pde-req-template', component: PDEReqTemplateListComponent, data: { permission: 'Pages.Administration.PDEReqTemplate' } },
                    { path: 'pde-req-template-add', component: PDEReqTemplateEditComponent, data: { permission: 'Pages.Administration.PDEReqTemplate.Create', editPageState: EditPageState.add } },
                    { path: 'pde-req-template-edit', component: PDEReqTemplateEditComponent, data: { permission: 'Pages.Administration.PDEReqTemplate.Edit', editPageState: EditPageState.edit } },
                    { path: 'pde-req-template-view', component: PDEReqTemplateEditComponent, data: { permission: 'Pages.Administration.PDEReqTemplate.View', editPageState: EditPageState.viewDetail } },

                    // Tiến độ làm mẫu
                    { path: 'pde-progress-template', component: PDEProgressTemplateListComponent, data: { permission: 'Pages.Administration.PDEProgressTemplate' } },
                    { path: 'pde-progress-template-add', component: PDEProgressTemplateEditComponent, data: { permission: 'Pages.Administration.PDEProgressTemplate.Create', editPageState: EditPageState.add } },
                    { path: 'pde-progress-template-edit', component: PDEProgressTemplateEditComponent, data: { permission: 'Pages.Administration.PDEProgressTemplate.Edit', editPageState: EditPageState.edit } },
                    { path: 'pde-progress-template-view', component: PDEProgressTemplateEditComponent, data: { permission: 'Pages.Administration.PDEProgressTemplate.View', editPageState: EditPageState.viewDetail } },
                    
                    // PYC bảng hardware
                    { path: 'pde-req-tablehardware', component: PDEReqTablehardwareListComponent, data: { permission: 'Pages.Administration.PDEReqTablehardware' } },
                    { path: 'pde-req-tablehardware-add', component: PDEReqTablehardwareEditComponent, data: { permission: 'Pages.Administration.PDEReqTablehardware.Create', editPageState: EditPageState.add } },
                    { path: 'pde-req-tablehardware-edit', component: PDEReqTablehardwareEditComponent, data: { permission: 'Pages.Administration.PDEReqTablehardware.Edit', editPageState: EditPageState.edit } },
                    { path: 'pde-req-tablehardware-view', component: PDEReqTablehardwareEditComponent, data: { permission: 'Pages.Administration.PDEReqTablehardware.View', editPageState: EditPageState.viewDetail } },

                    // Tiến độ bảng hardware
                    { path: 'pde-progress-tablehardware', component: PDEProgressTablehardwareListComponent, data: { permission: 'Pages.Administration.PDEProgressTablehardware' } },
                    { path: 'pde-progress-tablehardware-add', component: PDEProgressTablehardwareEditComponent, data: { permission: 'Pages.Administration.PDEProgressTablehardware.Create', editPageState: EditPageState.add } },
                    { path: 'pde-progress-tablehardware-edit', component: PDEProgressTablehardwareEditComponent, data: { permission: 'Pages.Administration.PDEProgressTablehardware.Edit', editPageState: EditPageState.edit } },
                    { path: 'pde-progress-tablehardware-view', component: PDEProgressTablehardwareEditComponent, data: { permission: 'Pages.Administration.PDEProgressTablehardware.View', editPageState: EditPageState.viewDetail } },

                    // PYC bảng màu
                    { path: 'pde-req-tablecolor', component: PDEReqTablecolorListComponent, data: { permission: 'Pages.Administration.PDEReqTablecolor' } },
                    { path: 'pde-req-tablecolor-add', component: PDEReqTablecolorEditComponent, data: { permission: 'Pages.Administration.PDEReqTablecolor.Create', editPageState: EditPageState.add } },
                    { path: 'pde-req-tablecolor-edit', component: PDEReqTablecolorEditComponent, data: { permission: 'Pages.Administration.PDEReqTablecolor.Edit', editPageState: EditPageState.edit } },
                    { path: 'pde-req-tablecolor-view', component: PDEReqTablecolorEditComponent, data: { permission: 'Pages.Administration.PDEReqTablecolor.View', editPageState: EditPageState.viewDetail } },

                    // Tiến độ bảng màu
                    { path: 'pde-progress-tablecolor', component: PDEProgressTablecolorListComponent, data: { permission: 'Pages.Administration.PDEProgressTablecolor' } },
                    { path: 'pde-progress-tablecolor-add', component: PDEProgressTablecolorEditComponent, data: { permission: 'Pages.Administration.PDEProgressTablecolor.Create', editPageState: EditPageState.add } },
                    { path: 'pde-progress-tablecolor-edit', component: PDEProgressTablecolorEditComponent, data: { permission: 'Pages.Administration.PDEProgressTablecolor.Edit', editPageState: EditPageState.edit } },
                    { path: 'pde-progress-tablecolor-view', component: PDEProgressTablecolorEditComponent, data: { permission: 'Pages.Administration.PDEProgressTablecolor.View', editPageState: EditPageState.viewDetail } },
                    
                    // PYC hardware
                    { path: 'pde-req-hardware', component: PDEReqHardwareListComponent, data: { permission: 'Pages.Administration.PDEReqHardware' } },
                    { path: 'pde-req-hardware-add', component: PDEReqHardwareEditComponent, data: { permission: 'Pages.Administration.PDEReqHardware.Create', editPageState: EditPageState.add } },
                    { path: 'pde-req-hardware-edit', component: PDEReqHardwareEditComponent, data: { permission: 'Pages.Administration.PDEReqHardware.Edit', editPageState: EditPageState.edit } },
                    { path: 'pde-req-hardware-view', component: PDEReqHardwareEditComponent, data: { permission: 'Pages.Administration.PDEReqHardware.View', editPageState: EditPageState.viewDetail } },

                    // Tiến độ hardware
                    { path: 'pde-progress-hardware', component: PDEProgressHardwareListComponent, data: { permission: 'Pages.Administration.PDEProgressHardware' } },
                    { path: 'pde-progress-hardware-add', component: PDEProgressHardwareEditComponent, data: { permission: 'Pages.Administration.PDEProgressHardware.Create', editPageState: EditPageState.add } },
                    { path: 'pde-progress-hardware-edit', component: PDEProgressHardwareEditComponent, data: { permission: 'Pages.Administration.PDEProgressHardware.Edit', editPageState: EditPageState.edit } },
                    { path: 'pde-progress-hardware-view', component: PDEProgressHardwareEditComponent, data: { permission: 'Pages.Administration.PDEProgressHardware.View', editPageState: EditPageState.viewDetail } },
                    
                    // Tạo PYC normal
                    { path: 'pde-req-normal-create', component: PDEReqNormalCreateListComponent, data: { permission: 'Pages.Administration.PDEReqNormalCreate' } },
                    { path: 'pde-req-normal-create-add', component: PDEReqNormalCreateEditComponent, data: { permission: 'Pages.Administration.PDEReqNormalCreate.Create', editPageState: EditPageState.add } },
                    { path: 'pde-req-normal-create-edit', component: PDEReqNormalCreateEditComponent, data: { permission: 'Pages.Administration.PDEReqNormalCreate.Edit', editPageState: EditPageState.edit } },
                    { path: 'pde-req-normal-create-view', component: PDEReqNormalCreateEditComponent, data: { permission: 'Pages.Administration.PDEReqNormalCreate.View', editPageState: EditPageState.viewDetail } },

                    // PYC normal
                    { path: 'pde-req-normal', component: PDEReqNormalListComponent, data: { permission: 'Pages.Administration.PDEReqNormal' } },
                    { path: 'pde-req-normal-add', component: PDEReqNormalEditComponent, data: { permission: 'Pages.Administration.PDEReqNormal.Create', editPageState: EditPageState.add } },
                    { path: 'pde-req-normal-edit', component: PDEReqNormalEditComponent, data: { permission: 'Pages.Administration.PDEReqNormal.Edit', editPageState: EditPageState.edit } },
                    { path: 'pde-req-normal-view', component: PDEReqNormalEditComponent, data: { permission: 'Pages.Administration.PDEReqNormal.View', editPageState: EditPageState.viewDetail } },

                    // Tiến độ normal
                    { path: 'pde-progress-normal', component: PDEProgressNormalListComponent, data: { permission: 'Pages.Administration.PDEProgressNormal' } },
                    { path: 'pde-progress-normal-add', component: PDEProgressNormalEditComponent, data: { permission: 'Pages.Administration.PDEProgressNormal.Create', editPageState: EditPageState.add } },
                    { path: 'pde-progress-normal-edit', component: PDEProgressNormalEditComponent, data: { permission: 'Pages.Administration.PDEProgressNormal.Edit', editPageState: EditPageState.edit } },
                    { path: 'pde-progress-normal-view', component: PDEProgressNormalEditComponent, data: { permission: 'Pages.Administration.PDEProgressNormal.View', editPageState: EditPageState.viewDetail } },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ProjectDevelopmentRoutingModule {

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
