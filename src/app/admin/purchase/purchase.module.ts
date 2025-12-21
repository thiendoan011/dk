import { NgModule } from '@angular/core';
import { commonDeclarationImports } from '../core/ultils/CommonDeclarationModule';
import { PurchaseRoutingModule } from './purchase-routing.module';
import { PurchaseServiceProxyModule } from './purchase-service-proxy.module';
import { PURRequisitionREdittableComponent } from './pur-requisition/edittable/pur-requisition-r-edittable.component';
import { PURRequisitionListComponent } from './pur-requisition/pur-requisition-list.component';
import { PURRequisitionEditComponent } from './pur-requisition/pur-requisition-edit.component';
import { PURRequisitionMaterialEdittableComponent } from './pur-requisition/edittable/pur-requisition-material-edittable.component';
import { PURRequisitionProcessListComponent } from './pur-requisition-process/pur-requisition-process-list.component';
import { PURRequisitionProcessEditComponent } from './pur-requisition-process/pur-requisition-process-edit.component';
import { PURRequisitionMaterialSummaryEdittableComponent } from './pur-requisition-process/edittable/pur-requisition-material-summary-edittable.component';
import { PURBatchListComponent } from './pur-batch/pur-batch-list.component';
import { PURBatchEditComponent } from './pur-batch/pur-batch-edit.component';
import { PURBatchDetailEdittableComponent } from './pur-batch/edittable/pur-batch-detail-edittable.component';
import { PURBatchOrderEdittableComponent } from './pur-batch/edittable/pur-batch-order-edittable.component';
import { PUROrderListComponent } from './pur-order/pur-order-list.component';
import { PUROrderEditComponent } from './pur-order/pur-order-edit.component';
import { PUROrderDetailEdittableComponent } from './pur-order/edittable/pur-order-detail-edittable.component';
import { PURReceiptEdittableComponent } from './pur-order/edittable/pur-receipt-edittable.component';
import { PURRequisitionMaterialSummaryNotPurchaseEdittableComponent } from './pur-requisition-process/edittable/pur-requisition-material-summary-not-purchase-edittable.component';
import { PURRequisitionMaterialSummaryPurchasingEdittableComponent } from './pur-requisition-process/edittable/pur-requisition-material-summary-purchasing-edittable.component';
import { PURRequisitionMaterialSummaryPurchasedEdittableComponent } from './pur-requisition-process/edittable/pur-requisition-material-summary-purchased-edittable.component';
import { PURReceiptMultiEdittableComponent } from './pur-order/edittable/pur-receipt-multi-edittable.component';
import { PURInventoryReceiptMultiEdittableComponent } from './pur-requisition-process/edittable/pur-inventory-receipt-multi-edittable.component';
@NgModule({
    imports: [
        commonDeclarationImports,
        PurchaseRoutingModule,
        PurchaseServiceProxyModule
    ],
    declarations: [
        // Yêu cầu mua hàng
        PURRequisitionListComponent, PURRequisitionEditComponent, PURRequisitionREdittableComponent,
        PURRequisitionMaterialEdittableComponent,
        // Xử lý yêu cầu mua hàng
        PURRequisitionProcessListComponent, PURRequisitionProcessEditComponent, PURRequisitionMaterialSummaryEdittableComponent,
        PURRequisitionMaterialSummaryNotPurchaseEdittableComponent, PURRequisitionMaterialSummaryPurchasingEdittableComponent,
        PURRequisitionMaterialSummaryPurchasedEdittableComponent,
        // Đợt mua hàng
        PURBatchListComponent, PURBatchEditComponent, PURBatchDetailEdittableComponent, PURBatchOrderEdittableComponent,
        // Đơn hàng
        PUROrderListComponent, PUROrderEditComponent, PUROrderDetailEdittableComponent, PURReceiptEdittableComponent,
        PURReceiptMultiEdittableComponent, PURInventoryReceiptMultiEdittableComponent,
    ],
    exports: [

    ],
    providers: [

    ]
})
export class PurchaseModule { }
