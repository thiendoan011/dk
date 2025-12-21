import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { PURRequisitionEditComponent } from './pur-requisition/pur-requisition-edit.component';
import { PURRequisitionListComponent } from './pur-requisition/pur-requisition-list.component';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { PURRequisitionProcessEditComponent } from './pur-requisition-process/pur-requisition-process-edit.component';
import { PURRequisitionProcessListComponent } from './pur-requisition-process/pur-requisition-process-list.component';
import { PURBatchListComponent } from './pur-batch/pur-batch-list.component';
import { PURBatchEditComponent } from './pur-batch/pur-batch-edit.component';
import { PUROrderEditComponent } from './pur-order/pur-order-edit.component';
import { PUROrderListComponent } from './pur-order/pur-order-list.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    // Yêu cầu mua hàng
                    { path: 'pur-requisition', component: PURRequisitionListComponent, data: { permission: 'Pages.Administration.PURRequisition' } },
                    { path: 'pur-requisition-add', component: PURRequisitionEditComponent, data: { permission: 'Pages.Administration.PURRequisition.Create', editPageState: EditPageState.add } },
                    { path: 'pur-requisition-edit', component: PURRequisitionEditComponent, data: { permission: 'Pages.Administration.PURRequisition.Edit', editPageState: EditPageState.edit } },
                    { path: 'pur-requisition-view', component: PURRequisitionEditComponent, data: { permission: 'Pages.Administration.PURRequisition.View', editPageState: EditPageState.viewDetail } },
                    
                    // Xử lý yêu cầu mua hàng
                    { path: 'pur-requisition-process', component: PURRequisitionProcessListComponent, data: { permission: 'Pages.Administration.PURRequisitionProcess' } },
                    { path: 'pur-requisition-process-add', component: PURRequisitionProcessEditComponent, data: { permission: 'Pages.Administration.PURRequisitionProcess.Create', editPageState: EditPageState.add } },
                    { path: 'pur-requisition-process-edit', component: PURRequisitionProcessEditComponent, data: { permission: 'Pages.Administration.PURRequisitionProcess.Edit', editPageState: EditPageState.edit } },
                    { path: 'pur-requisition-process-view', component: PURRequisitionProcessEditComponent, data: { permission: 'Pages.Administration.PURRequisitionProcess.View', editPageState: EditPageState.viewDetail } },
                    
                    // Đợt mua hàng
                    { path: 'pur-batch', component: PURBatchListComponent, data: { permission: 'Pages.Administration.PURBatch' } },
                    { path: 'pur-batch-add', component: PURBatchEditComponent, data: { permission: 'Pages.Administration.PURBatch.Create', editPageState: EditPageState.add } },
                    { path: 'pur-batch-edit', component: PURBatchEditComponent, data: { permission: 'Pages.Administration.PURBatch.Edit', editPageState: EditPageState.edit } },
                    { path: 'pur-batch-view', component: PURBatchEditComponent, data: { permission: 'Pages.Administration.PURBatch.View', editPageState: EditPageState.viewDetail } },
                    
                    // Đơn hàng
                    { path: 'pur-order', component: PUROrderListComponent, data: { permission: 'Pages.Administration.PUROrder' } },
                    { path: 'pur-order-add', component: PUROrderEditComponent, data: { permission: 'Pages.Administration.PUROrder.Create', editPageState: EditPageState.add } },
                    { path: 'pur-order-edit', component: PUROrderEditComponent, data: { permission: 'Pages.Administration.PUROrder.Edit', editPageState: EditPageState.edit } },
                    { path: 'pur-order-view', component: PUROrderEditComponent, data: { permission: 'Pages.Administration.PUROrder.View', editPageState: EditPageState.viewDetail } },
                    
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})

export class PurchaseRoutingModule {

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
