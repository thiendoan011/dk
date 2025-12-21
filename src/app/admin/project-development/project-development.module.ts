import { NgModule } from '@angular/core';
import { commonDeclarationImports } from '../core/ultils/CommonDeclarationModule';
import { ProjectDevelopmentRoutingModule } from './project-development-routing.module';
import { ProjectDevelopmentServiceProxyModule } from './project-development-service-proxy.module';
import { PDEGroupProductListComponent } from './pde-group-product/pde-group-product-list.component';
import { PDEGroupProductEditComponent } from './pde-group-product/pde-group-product-edit.component';
import { PDEProductListComponent } from './pde-product/pde-product-list.component';
import { PDEProductHardwareEdittableComponent } from './pde-product/pde-hardwarevt-edittable.component';
import { PDEProductEditComponent } from './pde-product/pde-product-edit.component';
import { PDEProductHardwareDGEdittableComponent } from './pde-product/pde-hardwaredg-edittable.component';
import { PDERequestCustomerAttachFileComponent } from './pde-product/pde-request-customer-attach-file.component';
import { PDETechDrawFromCusAttachFileComponent } from './pde-product/pde-tech-draw-from-cus-attach-file.component';
import { PDETechDrawAttachFileComponent } from './pde-product/pde-tech-draw-attach-file.component';
import { PDETechRequestCusAttachFileComponent } from './pde-group-product/pde-tech-request-cus-attach-file.component';
import { PDETechAttachFileComponent } from './pde-group-product/pde-tech-attach-file.component';
import { PDEPriceCusAttachFileComponent } from './pde-group-product/pde-price-cus-attach-file.component';
import { PDEReqPriceListComponent } from './pde-req-price/pde-req-price-list.component';
import { PDEReqPriceEditComponent } from './pde-req-price/pde-req-price-edit.component';
import { PDEReqPriceAttachFileComponent } from './pde-req-price/pde-req-price-attach-file.component';
import { PDEProgressPriceListComponent } from './pde-progress-price/pde-progress-price-list.component';
import { PDEProgressPriceEditComponent } from './pde-progress-price/pde-progress-price-edit.component';
import { PDEProgressPriceAttachFileComponent } from './pde-progress-price/pde-progress-price-attach-file.component';
import { PDEReqTemplateListComponent } from './pde-req-template/pde-req-template-list.component';
import { PDEReqTemplateEditComponent } from './pde-req-template/pde-req-template-edit.component';
import { PDEReqTemplateAttachFileComponent } from './pde-req-template/pde-req-template-attach-file.component';
import { PDEProgressTemplateAttachFileComponent } from './pde-progress-template/pde-progress-template-attach-file.component';
import { PDEProgressTemplateListComponent } from './pde-progress-template/pde-progress-template-list.component';
import { PDEProgressTemplateEditComponent } from './pde-progress-template/pde-progress-template-edit.component';
import { PDEProgressTemplatePartEdittableComponent } from './pde-progress-template/pde-progress-template-part-edittable.component';
import { PDEProgressTablehardwareListComponent } from './pde-progress-tablehardware/pde-progress-tablehardware-list.component';
import { PDEReqTablehardwareListComponent } from './pde-req-tablehardware/pde-req-tablehardware-list.component';
import { PDEProgressTablehardwareEditComponent } from './pde-progress-tablehardware/pde-progress-tablehardware-edit.component';
import { PDEProgressTablehardwareAttachFileComponent } from './pde-progress-tablehardware/pde-progress-tablehardware-attach-file.component';
import { PDEReqTablehardwareEditComponent } from './pde-req-tablehardware/pde-req-tablehardware-edit.component';
import { PDEProgressTablecolorAttachFileComponent } from './pde-progress-tablecolor/pde-progress-tablecolor-attach-file.component';
import { PDEReqTablecolorListComponent } from './pde-req-tablecolor/pde-req-tablecolor-list.component';
import { PDEProgressTablecolorListComponent } from './pde-progress-tablecolor/pde-progress-tablecolor-list.component';
import { PDEProgressTablecolorEditComponent } from './pde-progress-tablecolor/pde-progress-tablecolor-edit.component';
import { PDEReqTablecolorEditComponent } from './pde-req-tablecolor/pde-req-tablecolor-edit.component';
import { PDEProductEditTableComponent } from './pde-group-product/pde-product-edittable.component';
import { PDEProductTemplateEditTableComponent } from './pde-group-product/pde-product-template-edittable.component';
import { PDEDashboardComponent } from './pde-dashboard/pde-dashboard.component';
import { PDERequestDashboardComponent } from './pde-dashboard/pde-request-dashboard.component';
import { ChartsModule } from 'ng2-charts';
import { PDEProgressDashboardComponent } from './pde-dashboard/pde-progress-dashboard.component';
import { PDEReqTemplateProductTemplateEditTableComponent } from './pde-progress-template/pde-req-template-product-template-edittable.component';
import { PDEReqHardwareEditComponent } from './pde-req-hardware/pde-req-hardware-edit.component';
import { PDEReqHardwareListComponent } from './pde-req-hardware/pde-req-hardware-list.component';
import { PDEProgressHardwareListComponent } from './pde-progress-hardware/pde-progress-hardware-list.component';
import { PDEProgressHardwareEditComponent } from './pde-progress-hardware/pde-progress-hardware-edit.component';
import { PDEProgressHardwareAttachFileComponent } from './pde-progress-hardware/pde-progress-hardware-attach-file.component';
import { PDEHardwareEditTableComponent } from './pde-req-hardware/pde-hardware-edittable.component';
import { PDEInforRequestCusAttachFileComponent } from './pde-group-product/pde-infor-request-cus-attach-file.component';
import { PDETablehardwareEditTableComponent } from './pde-req-tablehardware/pde-tablehardware-edittable.component';
import { PDEReqTableColorProductEditTableComponent } from './pde-req-tablecolor/pde-req-tablecolor-product-edittable.component';
import { PDEProgressNormalAttachFileComponent } from './pde-progress-normal/pde-progress-normal-attach-file.component';
import { PDEReqNormalListComponent } from './pde-req-normal/pde-req-normal-list.component';
import { PDEReqNormalEditComponent } from './pde-req-normal/pde-req-normal-edit.component';
import { PDEReqNormalProductEditTableComponent } from './pde-req-normal/pde-req-normal-product-edittable.component';
import { PDEProgressNormalListComponent } from './pde-progress-normal/pde-progress-normal-list.component';
import { PDEProgressNormalEditComponent } from './pde-progress-normal/pde-progress-normal-edit.component';
import { PDEReqNormalCreateEditComponent } from './pde-req-normal-create/pde-req-normal-create-edit.component';
import { PDEReqNormalCreateListComponent } from './pde-req-normal-create/pde-req-normal-create-list.component';
import { PDEDashboardGroupProductEditTableComponent } from './pde-dashboard/pde-dashboard-group-product-edittable.component';
import { PDEChooseRequestEdittableComponent } from './pde-group-product/pde-choose-request-edittable.component';


@NgModule({
    imports: [
        ChartsModule,
        ProjectDevelopmentRoutingModule,
        ProjectDevelopmentServiceProxyModule,
        ...commonDeclarationImports,
    ],
    declarations: [
        // Dashboard
        PDEDashboardComponent, PDERequestDashboardComponent, PDEProgressDashboardComponent, PDEDashboardGroupProductEditTableComponent,
        // Sản phẩm
        PDEProductListComponent, PDEProductEditComponent, 
        PDEProductHardwareEdittableComponent, PDEProductHardwareDGEdittableComponent,
        PDERequestCustomerAttachFileComponent, PDETechDrawFromCusAttachFileComponent,
        PDETechDrawAttachFileComponent,
        // Hệ hàng
        PDEGroupProductListComponent, PDEGroupProductEditComponent, 
        PDETechRequestCusAttachFileComponent, PDETechAttachFileComponent, PDEPriceCusAttachFileComponent,
        PDEProductEditTableComponent, PDEProductTemplateEditTableComponent, PDEInforRequestCusAttachFileComponent,
        PDEChooseRequestEdittableComponent,
        //PYC báo giá
        PDEReqPriceListComponent, PDEReqPriceEditComponent, PDEReqPriceAttachFileComponent,
        //Tiến độ báo giá
        PDEProgressPriceListComponent, PDEProgressPriceEditComponent, PDEProgressPriceAttachFileComponent,
        //PYC làm mẫu
        PDEReqTemplateListComponent, PDEReqTemplateEditComponent, PDEReqTemplateAttachFileComponent, PDEReqTemplateProductTemplateEditTableComponent,
        //Tiến độ làm mẫu
        PDEProgressTemplateListComponent, PDEProgressTemplateEditComponent, PDEProgressTemplateAttachFileComponent,
        PDEProgressTemplatePartEdittableComponent,
        //PYC bảng hardware
        PDEReqTablehardwareListComponent, PDEReqTablehardwareEditComponent, PDETablehardwareEditTableComponent,
        //Tiến độ bảng hardware
        PDEProgressTablehardwareListComponent, PDEProgressTablehardwareEditComponent, PDEProgressTablehardwareAttachFileComponent,
        //PYC bảng màu
        PDEReqTablecolorListComponent, PDEReqTablecolorEditComponent, PDEReqTableColorProductEditTableComponent,
        //Tiến độ bảng màu
        PDEProgressTablecolorListComponent, PDEProgressTablecolorEditComponent, PDEProgressTablecolorAttachFileComponent,
        //PYC hardware
        PDEReqHardwareListComponent, PDEReqHardwareEditComponent, PDEHardwareEditTableComponent,
        // Tiến độ hardware
        PDEProgressHardwareListComponent, PDEProgressHardwareEditComponent, PDEProgressHardwareAttachFileComponent,
        // Tạo phiếu yêu cầu chung
        PDEReqNormalCreateEditComponent, PDEReqNormalCreateListComponent,
        // Phiếu yêu cầu chung
        PDEReqNormalListComponent, PDEReqNormalEditComponent, PDEReqNormalProductEditTableComponent,
        // Tiến độ chung
        PDEProgressNormalListComponent, PDEProgressNormalEditComponent, PDEProgressNormalAttachFileComponent
    ],
    exports: [

    ],
    providers: [

    ]
})
export class ProjectDevelopmentModule { }
