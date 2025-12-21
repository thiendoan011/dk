import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { DocumentEditComponent } from './document/document-edit.component';
import { DocumentListComponent } from './document/document-list.component';
import { PoGroupProductEditComponent } from './group-product/group-product-edit.component';
import { PoGroupProductListComponent } from './group-product/group-product-list.component';
import { PoCustomerEditComponent } from './po-customer/po-customer-edit.component';
import { PoCustomerListComponent } from './po-customer/po-customer-list.component';
import { PoDashboardComponent } from './po-dashboard/po-dashboard.component';
import { DragtableComponent } from './po-dragtable/dragtable.component';
import { POLayoutEditComponent } from './po-layout/po-layout-edit.component';
import { POLayoutListComponent } from './po-layout/po-layout-list.component';
import { PoEditComponent } from './po-master/po-master-edit.component';
import { PoListComponent } from './po-master/po-master-list.component';
import { PoProductEditComponent } from './product/po-product/po-product-edit.component';
import { PoProductListComponent } from './product/po-product/po-product-list.component';
import { PoPurchaseStateEditComponent } from './purchase/po-purchase-state/po-purchase-state-edit.component';
import { PoPurchaseStateListComponent } from './purchase/po-purchase-state/po-purchase-state-list.component';
import { PoPurchaseEditComponent } from './purchase/po-purchase/po-purchase-edit.component';
import { PoPurchaseListComponent } from './purchase/po-purchase/po-purchase-list.component';
import { PoRComponent } from './po-r/po-r.component';
import { PoRptWeeklyComponent } from './po-rpt-weekly/po-rpt-weekly.component';
import { PoPurchaseVeneerListComponent } from './purchase/po-purchase-veneer/po-purchase-veneer-list.component';
import { PoPurchaseVeneerEditComponent } from './purchase/po-purchase-veneer/po-purchase-veneer-edit.component';
import { PoPurchaseStateVeneerListComponent } from './purchase/po-purchase-state-veneer/po-purchase-state-veneer-list.component';
import { PoPurchaseStateVeneerEditComponent } from './purchase/po-purchase-state-veneer/po-purchase-state-veneer-edit.component';
import { PoHardwareVTEditComponent } from './product/po-hardwareVT/po-hardwareVT-edit.component';
import { PoHardwareVTListComponent } from './product/po-hardwareVT/po-hardwareVT-list.component';
import { PoHardwareDGEditComponent } from './product/po-hardwareDG/po-hardwareDG-edit.component';
import { PoHardwareDGListComponent } from './product/po-hardwareDG/po-hardwareDG-list.component';
import { PoProductedPartListComponent } from './producted-part/po-producted-part/po-producted-part-list.component';
import { PoProductedPartEditComponent } from './producted-part/po-producted-part/po-producted-part-edit.component';
import { PoProductedPartEmbryoEditComponent } from './producted-part/po-producted-part-embryo/po-producted-part-embryo-edit.component';
import { PoProductedPartEmbryoListComponent } from './producted-part/po-producted-part-embryo/po-producted-part-embryo-list.component';
import { PoProductedPart2EditComponent } from './producted-part/po-producted-part-2/po-producted-part-2-edit.component';
import { PoProductedPart2ListComponent } from './producted-part/po-producted-part-2/po-producted-part-2-list.component';
import { PoProductedPart3EditComponent } from './producted-part/po-producted-part-3/po-producted-part-3-edit.component';
import { PoProductedPart3ListComponent } from './producted-part/po-producted-part-3/po-producted-part-3-list.component';
import { PoProductedPart4ListComponent } from './producted-part/po-producted-part-4/po-producted-part-4-list.component';
import { PoProductedPart4EditComponent } from './producted-part/po-producted-part-4/po-producted-part-4-edit.component';
import { PoProductedPart5ListComponent } from './producted-part/po-producted-part-5/po-producted-part-5-list.component';
import { PoProductedPart5EditComponent } from './producted-part/po-producted-part-5/po-producted-part-5-edit.component';
import { PoProductedPart6EditComponent } from './producted-part/po-producted-part-6/po-producted-part-6-edit.component';
import { PoProductedPart6ListComponent } from './producted-part/po-producted-part-6/po-producted-part-6-list.component';
import { PoProductedPartVeneerListComponent } from './producted-part/po-producted-part-veneer/po-producted-part-veneer-list.component';
import { PoProductedPartVeneerEditComponent } from './producted-part/po-producted-part-veneer/po-producted-part-veneer-edit.component';
import { POCoststatementListComponent } from './coststatement/po-coststatement/po-coststatement-list.component';
import { POCoststatementEditComponent } from './coststatement/po-coststatement/po-coststatement-edit.component';
import { POCoststatementProductionListComponent } from './coststatement/po-coststatement-production/po-coststatement-production-list.component';
import { POCoststatementProductionProductionEditComponent } from './coststatement/po-coststatement-production/po-coststatement-production-edit.component';
import { PoCostStatementHistoryListComponent } from './coststatement/po-coststatement-history/po-coststatement-history-list.component';
import { PoCostStatementHistoryEditComponent } from './coststatement/po-coststatement-history/po-coststatement-history-edit.component';
import { PoCostStatementProductionHistoryListComponent } from './coststatement/po-coststatement-production-history/po-coststatement-production-history-list.component';
import { PoCostStatementProductionHistoryEditComponent } from './coststatement/po-coststatement-production-history/po-coststatement-production-history-edit.component';
import { POCostStatementHistoryTransferListComponent } from './coststatement/po-coststatement-history-transfer/po-coststatement-history-transfer-list.component';
import { POPurchaseReportListComponent } from './purchase/po-purchase-report/po-purchase-report-list.component';
import { PoImportComponent } from './po-import/po-import.component';
import { RReqportPurchaseComponent } from './r/report/r-report-purchase.component';
import { PlanEmbryoComponent } from './report/plan-embryo/plan-embryo.component';
import { PORPPMaterialListComponent } from './report/plan-production/material/material-list.component';
import { PORPPMaterialEditComponent } from './report/plan-production/material/material-edit.component';
import { PORPPProjectDevelopmentEditComponent } from './report/plan-production/project-development/project-development-edit.component';
import { PORPPTechnicalEditComponent } from './report/plan-production/technical/technical-edit.component';
import { PORPPTechnicalListComponent } from './report/plan-production/technical/technical-list.component';
import { PORPPProjectDevelopmentListComponent } from './report/plan-production/project-development/project-development-list.component';
import { DocumentConfirmEditComponent } from './document/confirm/document-confirm-edit.component';
import { DocumentConfirmListComponent } from './document/confirm/document-confirm-list.component';
import { PlanProductionWeekComponent } from './report/plan-production-week/plan-production-week.component';
import { RImportComponent } from './r/r-import/r-import.component';
import { RListComponent } from './r/crud/r-list.component';
import { REditComponent } from './r/crud/r-edit.component';
import { POLoadContListComponent } from './po-load-cont/load-cont/po-load-cont-list.component';
import { POLoadContEditComponent } from './po-load-cont/load-cont/po-load-cont-edit.component';
import { POBookingEditComponent } from './po-booking/po-booking-edit.component';
import { POBookingListComponent } from './po-booking/po-booking-list.component';
import { POReportPOFailedRptComponent } from './report/po-failed/po-report-po-failed-rpt.component';
import { POModifiedEditComponent } from './po-modified/po-modified-edit.component';
import { POModifiedListComponent } from './po-modified/po-modified-list.component';
import { GroupRListComponent } from './group-r/group-r-list.component';
import { GroupREditComponent } from './group-r/group-r-edit.component';
import { ReportPlanProductChangeComponent } from './report/po-product-change/report-plan-product-change.component';
import { POInforHistoryComponent } from './report/po-infor-history/po-infor-history.component';
import { POPurchaseImportComponent } from './purchase/po-purchase-import/po-purchase-import.component';
import { PoProductedPart25ListComponent } from './producted-part/po-producted-part-25/po-producted-part-25-list.component';
import { PoProductedPart25EditComponent } from './producted-part/po-producted-part-25/po-producted-part-25-edit.component';
import { PODailyKPIEditComponent } from './po-dailykpi/po-dailykpi-edit.component';
import { PODailyKPIListComponent } from './po-dailykpi/po-dailykpi-list.component';
import { PODelayEditComponent } from './po-delay/po-delay-edit.component';
import { PODelayListComponent } from './po-delay/po-delay-list.component';
import { ReportPOComponent } from './report/report-po/report-po.component';
import { POReportDataExtractionComponent } from './report/data-extraction/po-report-data-extraction.component';
import { POProductedPartImportComponent } from './producted-part-import/producted-part-import.component';
import { PoPurchaseOutsourcedListComponent } from './purchase/po-purchase-outsourced/po-purchase-outsourced-list.component';
import { PoPurchaseOutsourcedEditComponent } from './purchase/po-purchase-outsourced/po-purchase-outsourced-edit.component';
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    // PO
                    { path: 'po-master', component: PoListComponent, data: { permission: 'Pages.Administration.PoMaster' } },
                    { path: 'po-master-add', component: PoEditComponent, data: { permission: 'Pages.Administration.PoMaster.Create', editPageState: EditPageState.add } },
                    { path: 'po-master-edit', component: PoEditComponent, data: { permission: 'Pages.Administration.PoMaster.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-master-view', component: PoEditComponent, data: { permission: 'Pages.Administration.PoMaster.View', editPageState: EditPageState.viewDetail } },

                    // hệ hàng
                    { path: 'po-group-product', component: PoGroupProductListComponent, data: { permission: 'Pages.Administration.PoGroupProduct' } },
                    { path: 'po-group-product-add', component: PoGroupProductEditComponent, data: { permission: 'Pages.Administration.PoGroupProduct.Create', editPageState: EditPageState.add } },
                    { path: 'po-group-product-edit', component: PoGroupProductEditComponent, data: { permission: 'Pages.Administration.PoGroupProduct.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-group-product-view', component: PoGroupProductEditComponent, data: { permission: 'Pages.Administration.PoGroupProduct.View', editPageState: EditPageState.viewDetail } },


                    // khách hàng
                    { path: 'po-customer', component: PoCustomerListComponent, data: { permission: 'Pages.Administration.PoCustomer' } },
                    { path: 'po-customer-add', component: PoCustomerEditComponent, data: { permission: 'Pages.Administration.PoCustomer.Create', editPageState: EditPageState.add } },
                    { path: 'po-customer-edit', component: PoCustomerEditComponent, data: { permission: 'Pages.Administration.PoCustomer.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-customer-view', component: PoCustomerEditComponent, data: { permission: 'Pages.Administration.PoCustomer.View', editPageState: EditPageState.viewDetail } },


                    // sản phẩm
                    { path: 'po-product', component: PoProductListComponent, data: { permission: 'Pages.Administration.PoProduct' } },
                    { path: 'po-product-add', component: PoProductEditComponent, data: { permission: 'Pages.Administration.PoProduct.Create', editPageState: EditPageState.add } },
                    { path: 'po-product-edit', component: PoProductEditComponent, data: { permission: 'Pages.Administration.PoProduct.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-product-view', component: PoProductEditComponent, data: { permission: 'Pages.Administration.PoProduct.View', editPageState: EditPageState.viewDetail } },


                    // đơn hàng
                    { path: 'po-purchase', component: PoPurchaseListComponent, data: { permission: 'Pages.Administration.PoPurchase' } },
                    { path: 'po-purchase-add', component: PoPurchaseEditComponent, data: { permission: 'Pages.Administration.PoPurchase.Create', editPageState: EditPageState.add } },
                    { path: 'po-purchase-edit', component: PoPurchaseEditComponent, data: { permission: 'Pages.Administration.PoPurchase.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-purchase-view', component: PoPurchaseEditComponent, data: { permission: 'Pages.Administration.PoPurchase.View', editPageState: EditPageState.viewDetail } },

                    // đơn hàng gia công
                    { path: 'po-purchase-outsourced', component: PoPurchaseOutsourcedListComponent, data: { permission: 'Pages.Administration.PoPurchaseOutsourced' } },
                    { path: 'po-purchase-outsourced-add', component: PoPurchaseOutsourcedEditComponent, data: { permission: 'Pages.Administration.PoPurchaseOutsourced.Create', editPageState: EditPageState.add } },
                    { path: 'po-purchase-outsourced-edit', component: PoPurchaseOutsourcedEditComponent, data: { permission: 'Pages.Administration.PoPurchaseOutsourced.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-purchase-outsourced-view', component: PoPurchaseOutsourcedEditComponent, data: { permission: 'Pages.Administration.PoPurchaseOutsourced.View', editPageState: EditPageState.viewDetail } },

                    // phiếu nhập
                    { path: 'po-purchase-state', component: PoPurchaseStateListComponent, data: { permission: 'Pages.Administration.PoPurchaseState' } },
                    { path: 'po-purchase-state-add', component: PoPurchaseStateEditComponent, data: { permission: 'Pages.Administration.PoPurchaseState.Create', editPageState: EditPageState.add } },
                    { path: 'po-purchase-state-edit', component: PoPurchaseStateEditComponent, data: { permission: 'Pages.Administration.PoPurchaseState.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-purchase-state-view', component: PoPurchaseStateEditComponent, data: { permission: 'Pages.Administration.PoPurchaseState.View', editPageState: EditPageState.viewDetail } },

                    // dashboard
                    { path: 'po-dashboard', component: PoDashboardComponent, data: { permission: 'Pages.Administration.PoDashboard' } },
                    // dashboard
                    { path: 'po-dragtable', component: DragtableComponent, data: { permission: 'Pages.Administration.Dragtable' } },
                    
                    // Cập nhật tiến độ sản xuất
                    { path: 'po-producted-part', component: PoProductedPartListComponent, data: { permission: 'Pages.Administration.PoProductedPart' } },
                    { path: 'po-producted-part-add', component: PoProductedPartEditComponent, data: { permission: 'Pages.Administration.PoProductedPart.Create', editPageState: EditPageState.add } },
                    { path: 'po-producted-part-edit', component: PoProductedPartEditComponent, data: { permission: 'Pages.Administration.PoProductedPart.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-producted-part-view', component: PoProductedPartEditComponent, data: { permission: 'Pages.Administration.PoProductedPart.View', editPageState: EditPageState.viewDetail } },
                    
                    // báo cáo tuần
                    { path: 'po-rpt-weekly', component: PoRptWeeklyComponent, data: { permission: 'Pages.Administration.PoRptWeekly' } },

                    // chi tiết công đoạn phôi
                    { path: 'po-producted-part-embryo', component: PoProductedPartEmbryoListComponent, data: { permission: 'Pages.Administration.PoProductedPartDetail' } },
                    { path: 'po-producted-part-embryo-add', component: PoProductedPartEmbryoEditComponent, data: { permission: 'Pages.Administration.PoProductedPartDetail.Create', editPageState: EditPageState.add } },
                    { path: 'po-producted-part-embryo-edit', component: PoProductedPartEmbryoEditComponent, data: { permission: 'Pages.Administration.PoProductedPartDetail.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-producted-part-embryo-view', component: PoProductedPartEmbryoEditComponent, data: { permission: 'Pages.Administration.PoProductedPartDetail.View', editPageState: EditPageState.viewDetail } },

                    // chi tiết công đoạn định hình
                    { path: 'po-producted-part-2', component: PoProductedPart2ListComponent, data: { permission: 'Pages.Administration.PoProductedPart2' } },
                    { path: 'po-producted-part-2-add', component: PoProductedPart2EditComponent, data: { permission: 'Pages.Administration.PoProductedPart2.Create', editPageState: EditPageState.add } },
                    { path: 'po-producted-part-2-edit', component: PoProductedPart2EditComponent, data: { permission: 'Pages.Administration.PoProductedPart2.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-producted-part-2-view', component: PoProductedPart2EditComponent, data: { permission: 'Pages.Administration.PoProductedPart2.View', editPageState: EditPageState.viewDetail } },
                    
                    // chi tiết công đoạn lắp ráp
                    { path: 'po-producted-part-25', component: PoProductedPart25ListComponent, data: { permission: 'Pages.Administration.PoProductedPart25' } },
                    { path: 'po-producted-part-25-add', component: PoProductedPart25EditComponent, data: { permission: 'Pages.Administration.PoProductedPart25.Create', editPageState: EditPageState.add } },
                    { path: 'po-producted-part-25-edit', component: PoProductedPart25EditComponent, data: { permission: 'Pages.Administration.PoProductedPart25.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-producted-part-25-view', component: PoProductedPart25EditComponent, data: { permission: 'Pages.Administration.PoProductedPart25.View', editPageState: EditPageState.viewDetail } },

                    // chi tiết công đoạn Sơn 1
                    { path: 'po-producted-part-3', component: PoProductedPart3ListComponent, data: { permission: 'Pages.Administration.PoProductedPart3' } },
                    { path: 'po-producted-part-3-add', component: PoProductedPart3EditComponent, data: { permission: 'Pages.Administration.PoProductedPart3.Create', editPageState: EditPageState.add } },
                    { path: 'po-producted-part-3-edit', component: PoProductedPart3EditComponent, data: { permission: 'Pages.Administration.PoProductedPart3.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-producted-part-3-view', component: PoProductedPart3EditComponent, data: { permission: 'Pages.Administration.PoProductedPart3.View', editPageState: EditPageState.viewDetail } },

                    // chi tiết công đoạn Sơn 2
                    { path: 'po-producted-part-4', component: PoProductedPart4ListComponent, data: { permission: 'Pages.Administration.PoProductedPart4' } },
                    { path: 'po-producted-part-4-add', component: PoProductedPart4EditComponent, data: { permission: 'Pages.Administration.PoProductedPart4.Create', editPageState: EditPageState.add } },
                    { path: 'po-producted-part-4-edit', component: PoProductedPart4EditComponent, data: { permission: 'Pages.Administration.PoProductedPart4.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-producted-part-4-view', component: PoProductedPart4EditComponent, data: { permission: 'Pages.Administration.PoProductedPart4.View', editPageState: EditPageState.viewDetail } },

                    // chi tiết công đoạn Sơn 3
                    { path: 'po-producted-part-5', component: PoProductedPart5ListComponent, data: { permission: 'Pages.Administration.PoProductedPart5' } },
                    { path: 'po-producted-part-5-add', component: PoProductedPart5EditComponent, data: { permission: 'Pages.Administration.PoProductedPart5.Create', editPageState: EditPageState.add } },
                    { path: 'po-producted-part-5-edit', component: PoProductedPart5EditComponent, data: { permission: 'Pages.Administration.PoProductedPart5.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-producted-part-5-view', component: PoProductedPart5EditComponent, data: { permission: 'Pages.Administration.PoProductedPart5.View', editPageState: EditPageState.viewDetail } },

                    // chi tiết công đoạn Đóng gói
                    { path: 'po-producted-part-6', component: PoProductedPart6ListComponent, data: { permission: 'Pages.Administration.PoProductedPart6' } },
                    { path: 'po-producted-part-6-add', component: PoProductedPart6EditComponent, data: { permission: 'Pages.Administration.PoProductedPart6.Create', editPageState: EditPageState.add } },
                    { path: 'po-producted-part-6-edit', component: PoProductedPart6EditComponent, data: { permission: 'Pages.Administration.PoProductedPart6.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-producted-part-6-view', component: PoProductedPart6EditComponent, data: { permission: 'Pages.Administration.PoProductedPart6.View', editPageState: EditPageState.viewDetail } },
                    
                    // Import tiến độ công đoạn sản xuất
                    { path: 'producted-part-import', component: POProductedPartImportComponent, data: { permission: 'Pages.Administration.POProductedPartImport' } },

                    // văn bản
                    { path: 'document', component: DocumentListComponent, data: { permission: 'Pages.Administration.Document' } },
                    { path: 'document-add', component: DocumentEditComponent, data: { permission: 'Pages.Administration.Document.Create', editPageState: EditPageState.add } },
                    { path: 'document-edit', component: DocumentEditComponent, data: { permission: 'Pages.Administration.Document.Edit', editPageState: EditPageState.edit } },
                    { path: 'document-view', component: DocumentEditComponent, data: { permission: 'Pages.Administration.Document.View', editPageState: EditPageState.viewDetail } },
                    // Xác nhận văn bản
                    { path: 'document-confirm', component: DocumentConfirmListComponent, data: { permission: 'Pages.Administration.DocumentConfirm' } },
                    { path: 'document-confirm-add', component: DocumentConfirmEditComponent, data: { permission: 'Pages.Administration.DocumentConfirm.Create', editPageState: EditPageState.add } },
                    { path: 'document-confirm-edit', component: DocumentConfirmEditComponent, data: { permission: 'Pages.Administration.DocumentConfirm.Edit', editPageState: EditPageState.edit } },
                    { path: 'document-confirm-view', component: DocumentConfirmEditComponent, data: { permission: 'Pages.Administration.DocumentConfirm.View', editPageState: EditPageState.viewDetail } },

                    // layout
                    { path: 'po-layout', component: POLayoutListComponent, data: { permission: 'Pages.Administration.POLayout' } },
                    { path: 'po-layout-add', component: POLayoutEditComponent, data: { permission: 'Pages.Administration.POLayout.Create', editPageState: EditPageState.add } },
                    { path: 'po-layout-edit', component: POLayoutEditComponent, data: { permission: 'Pages.Administration.POLayout.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-layout-view', component: POLayoutEditComponent, data: { permission: 'Pages.Administration.POLayout.View', editPageState: EditPageState.viewDetail } },

                    // Thông tin R
                    { path: 'po-r', component: PoRComponent, data: { permission: 'Pages.Administration.PoR' } },

                    // tiến độ veneer
                    { path: 'po-producted-part-veneer', component: PoProductedPartVeneerListComponent, data: { permission: 'Pages.Administration.PoProductedPartVeneer' } },
                    { path: 'po-producted-part-veneer-add', component: PoProductedPartVeneerEditComponent, data: { permission: 'Pages.Administration.PoProductedPartVeneer.Create', editPageState: EditPageState.add } },
                    { path: 'po-producted-part-veneer-edit', component: PoProductedPartVeneerEditComponent, data: { permission: 'Pages.Administration.PoProductedPartVeneer.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-producted-part-veneer-view', component: PoProductedPartVeneerEditComponent, data: { permission: 'Pages.Administration.PoProductedPartVeneer.View', editPageState: EditPageState.viewDetail } },

                    // đơn hàng veneer
                    { path: 'po-purchase-veneer', component: PoPurchaseVeneerListComponent, data: { permission: 'Pages.Administration.PoPurchaseVeneer' } },
                    { path: 'po-purchase-veneer-add', component: PoPurchaseVeneerEditComponent, data: { permission: 'Pages.Administration.PoPurchaseVeneer.Create', editPageState: EditPageState.add } },
                    { path: 'po-purchase-veneer-edit', component: PoPurchaseVeneerEditComponent, data: { permission: 'Pages.Administration.PoPurchaseVeneer.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-purchase-veneer-view', component: PoPurchaseVeneerEditComponent, data: { permission: 'Pages.Administration.PoPurchaseVeneer.View', editPageState: EditPageState.viewDetail } },
                        
                    // phiếu nhập veneer
                    { path: 'po-purchase-state-veneer', component: PoPurchaseStateVeneerListComponent, data: { permission: 'Pages.Administration.PoPurchaseStateVeneer' } },
                    { path: 'po-purchase-state-veneer-add', component: PoPurchaseStateVeneerEditComponent, data: { permission: 'Pages.Administration.PoPurchaseStateVeneer.Create', editPageState: EditPageState.add } },
                    { path: 'po-purchase-state-veneer-edit', component: PoPurchaseStateVeneerEditComponent, data: { permission: 'Pages.Administration.PoPurchaseStateVeneer.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-purchase-state-veneer-view', component: PoPurchaseStateVeneerEditComponent, data: { permission: 'Pages.Administration.PoPurchaseStateVeneer.View', editPageState: EditPageState.viewDetail } },
                    
                    // Vật tư hardware
                    { path: 'po-hardwareVT', component: PoHardwareVTListComponent, data: { permission: 'Pages.Administration.PoHardwareVT' } },
                    { path: 'po-hardwareVT-add', component: PoHardwareVTEditComponent, data: { permission: 'Pages.Administration.PoHardwareVT.Create', editPageState: EditPageState.add } },
                    { path: 'po-hardwareVT-edit', component: PoHardwareVTEditComponent, data: { permission: 'Pages.Administration.PoHardwareVT.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-hardwareVT-view', component: PoHardwareVTEditComponent, data: { permission: 'Pages.Administration.PoHardwareVT.View', editPageState: EditPageState.viewDetail } },

                    // Vật tư đóng gói
                    { path: 'po-hardwareDG', component: PoHardwareDGListComponent, data: { permission: 'Pages.Administration.PoHardwareDG' } },
                    { path: 'po-hardwareDG-add', component: PoHardwareDGEditComponent, data: { permission: 'Pages.Administration.PoHardwareDG.Create', editPageState: EditPageState.add } },
                    { path: 'po-hardwareDG-edit', component: PoHardwareDGEditComponent, data: { permission: 'Pages.Administration.PoHardwareDG.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-hardwareDG-view', component: PoHardwareDGEditComponent, data: { permission: 'Pages.Administration.PoHardwareDG.View', editPageState: EditPageState.viewDetail } },

                    // Bảng chiết tính
                    { path: 'po-coststatement', component: POCoststatementListComponent, data: { permission: 'Pages.Administration.POCoststatement' } },
                    { path: 'po-coststatement-add', component: POCoststatementEditComponent, data: { permission: 'Pages.Administration.POCoststatement.Create', editPageState: EditPageState.add } },
                    { path: 'po-coststatement-edit', component: POCoststatementEditComponent, data: { permission: 'Pages.Administration.POCoststatement.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-coststatement-view', component: POCoststatementEditComponent, data: { permission: 'Pages.Administration.POCoststatement.View', editPageState: EditPageState.viewDetail } },

                    // Bảng chiết tính sản xuất
                    { path: 'po-coststatement-production', component: POCoststatementProductionListComponent, data: { permission: 'Pages.Administration.POCoststatementProduction' } },
                    { path: 'po-coststatement-production-add', component: POCoststatementProductionProductionEditComponent, data: { permission: 'Pages.Administration.POCoststatementProduction.Create', editPageState: EditPageState.add } },
                    { path: 'po-coststatement-production-edit', component: POCoststatementProductionProductionEditComponent, data: { permission: 'Pages.Administration.POCoststatementProduction.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-coststatement-production-view', component: POCoststatementProductionProductionEditComponent, data: { permission: 'Pages.Administration.POCoststatementProduction.View', editPageState: EditPageState.viewDetail } },
                    
                    // Yêu cầu xử lý
                    { path: 'po-coststatement-history', component: PoCostStatementHistoryListComponent, data: { permission: 'Pages.Administration.PoCostStatementHistory' } },
                    { path: 'po-coststatement-history-add', component: PoCostStatementHistoryEditComponent, data: { permission: 'Pages.Administration.PoCostStatementHistory.Create', editPageState: EditPageState.add } },
                    { path: 'po-coststatement-history-edit', component: PoCostStatementHistoryEditComponent, data: { permission: 'Pages.Administration.PoCostStatementHistory.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-coststatement-history-view', component: PoCostStatementHistoryEditComponent, data: { permission: 'Pages.Administration.PoCostStatementHistory.View', editPageState: EditPageState.viewDetail } },

                    // Yêu cầu xử lý sản xuất
                    { path: 'po-coststatement-production-history', component: PoCostStatementProductionHistoryListComponent, data: { permission: 'Pages.Administration.PoCostStatementProductionHistory' } },
                    { path: 'po-coststatement-production-history-add', component: PoCostStatementProductionHistoryEditComponent, data: { permission: 'Pages.Administration.PoCostStatementProductionHistory.Create', editPageState: EditPageState.add } },
                    { path: 'po-coststatement-production-history-edit', component: PoCostStatementProductionHistoryEditComponent, data: { permission: 'Pages.Administration.PoCostStatementProductionHistory.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-coststatement-production-history-view', component: PoCostStatementProductionHistoryEditComponent, data: { permission: 'Pages.Administration.PoCostStatementProductionHistory.View', editPageState: EditPageState.viewDetail } },

                    // Điều phối yêu cầu xử lý
                    { path: 'po-coststatement-historytransfer', component: POCostStatementHistoryTransferListComponent, data: { permission: 'Pages.Administration.POCostStatementHistoryTransfer' } },
                  
                    // R
                    { path: 'r', component: RListComponent, data: { permission: 'Pages.Administration.R' } },
                    { path: 'r-add', component: REditComponent, data: { permission: 'Pages.Administration.R.Create', editPageState: EditPageState.add } },
                    { path: 'r-edit', component: REditComponent, data: { permission: 'Pages.Administration.R.Edit', editPageState: EditPageState.edit } },
                    { path: 'r-view', component: REditComponent, data: { permission: 'Pages.Administration.R.View', editPageState: EditPageState.viewDetail } },
                    
                    // R Import
                    { path: 'r-import', component: RImportComponent, data: { permission: 'Pages.Administration.RImport' } },  

                    // Báo cáo đơn hàng
                    { path: 'po-purchase-report', component: POPurchaseReportListComponent, data: { permission: 'Pages.Administration.POPurchaseReport' } },
                    
                    // Import đơn hàng
                    { path: 'po-purchase-import', component: POPurchaseImportComponent, data: { permission: 'Pages.Administration.POPurchaseImport' } },
                    
                    // PO Import
                    { path: 'po-import', component: PoImportComponent, data: { permission: 'Pages.Administration.PoImport' } },  
// Begin Báo cáo
                    // báo cáo tổng hợp đơn hàng
                    { path: 'r-report-purchase', component: RReqportPurchaseComponent, data: { permission: 'Pages.Administration.RReqportPurchase' } },    
                    
                    // Báo cáo kế hoạch phôi
                    { path: 'plan-embryo', component: PlanEmbryoComponent, data: { permission: 'Pages.Administration.PlanEmbryo' } },
                    
                    // Báo cáo kế hoạch sản xuất phòng vật tư
                    { path: 'porpp-material', component: PORPPMaterialListComponent, data: { permission: 'Pages.Administration.PORPPMaterial' } },
                    { path: 'porpp-material-add', component: PORPPMaterialEditComponent, data: { permission: 'Pages.Administration.PORPPMaterial.Create', editPageState: EditPageState.add } },
                    { path: 'porpp-material-edit', component: PORPPMaterialEditComponent, data: { permission: 'Pages.Administration.PORPPMaterial.Edit', editPageState: EditPageState.edit } },
                    { path: 'porpp-material-view', component: PORPPMaterialEditComponent, data: { permission: 'Pages.Administration.PORPPMaterial.View', editPageState: EditPageState.viewDetail } },
                    // Báo cáo kế hoạch sản xuất phòng Kỹ thuật
                    { path: 'porpp-technical', component: PORPPTechnicalListComponent, data: { permission: 'Pages.Administration.PORPPTechnical' } },
                    { path: 'porpp-technical-add', component: PORPPTechnicalEditComponent, data: { permission: 'Pages.Administration.PORPPTechnical.Create', editPageState: EditPageState.add } },
                    { path: 'porpp-technical-edit', component: PORPPTechnicalEditComponent, data: { permission: 'Pages.Administration.PORPPTechnical.Edit', editPageState: EditPageState.edit } },
                    { path: 'porpp-technical-view', component: PORPPTechnicalEditComponent, data: { permission: 'Pages.Administration.PORPPTechnical.View', editPageState: EditPageState.viewDetail } },
                    // Báo cáo kế hoạch sản xuất phòng Dự án phát triển
                    { path: 'porpp-project-development', component: PORPPProjectDevelopmentListComponent, data: { permission: 'Pages.Administration.PORPPProjectDevelopment' } },
                    { path: 'porpp-project-development-add', component: PORPPProjectDevelopmentEditComponent, data: { permission: 'Pages.Administration.PORPPProjectDevelopment.Create', editPageState: EditPageState.add } },
                    { path: 'porpp-project-development-edit', component: PORPPProjectDevelopmentEditComponent, data: { permission: 'Pages.Administration.PORPPProjectDevelopment.Edit', editPageState: EditPageState.edit } },
                    { path: 'porpp-project-development-view', component: PORPPProjectDevelopmentEditComponent, data: { permission: 'Pages.Administration.PORPPProjectDevelopment.View', editPageState: EditPageState.viewDetail } },
             
                    // Báo cáo kế hoạch tuần
                    { path: 'plan-production-week', component: PlanProductionWeekComponent, data: { permission: 'Pages.Administration.PlanProductionWeek' } },
    //Begin Báo cáo - Báo cáo PO
                    // Báo cáo PO
                    { path: 'report-po', component: ReportPOComponent, data: { permission: 'Pages.Administration.ReportPO' } },

                    // Rút trích dữ liệu
                    { path: 'po-report-data-extraction', component: POReportDataExtractionComponent, data: { permission: 'Pages.Administration.POReportDataExtraction' } },

    //End Báo cáo - Báo cáo PO   
// End Báo cáo                            
                    //Load cont
                    { path: 'po-load-cont', component: POLoadContListComponent, data: { permission: 'Pages.Administration.POLoadCont' } },
                    { path: 'po-load-cont-add', component: POLoadContEditComponent, data: { permission: 'Pages.Administration.POLoadCont.Create', editPageState: EditPageState.add } },
                    { path: 'po-load-cont-edit', component: POLoadContEditComponent, data: { permission: 'Pages.Administration.POLoadCont.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-load-cont-view', component: POLoadContEditComponent, data: { permission: 'Pages.Administration.POLoadCont.View', editPageState: EditPageState.viewDetail } },
             
                    //Booking
                    { path: 'po-booking', component: POBookingListComponent, data: { permission: 'Pages.Administration.POBooking' } },
                    { path: 'po-booking-add', component: POBookingEditComponent, data: { permission: 'Pages.Administration.POBooking.Create', editPageState: EditPageState.add } },
                    { path: 'po-booking-edit', component: POBookingEditComponent, data: { permission: 'Pages.Administration.POBooking.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-booking-view', component: POBookingEditComponent, data: { permission: 'Pages.Administration.POBooking.View', editPageState: EditPageState.viewDetail } },
                    
                    // PO rớt
                    { path: 'po-report-po-failed-rpt', component: POReportPOFailedRptComponent, data: { permission: 'Pages.Administration.POReportPOFailedRpt' } },
                    
                    // Sản phẩm thuộc PO thay đổi số lượng
                    { path: 'report-plan-product-change', component: ReportPlanProductChangeComponent, data: { permission: 'Pages.Administration.ReportPlanProductChange' } },
                     
                    // Thông tin phát sinh của PO
                    { path: 'po-infor-history', component: POInforHistoryComponent, data: { permission: 'Pages.Administration.POInforHistory' } },
                     
                    // Điều chỉnh PO(Đôn tiến độ/ chậm tiến độ)
                    { path: 'po-modified', component: POModifiedListComponent, data: { permission: 'Pages.Administration.POModified' } },
                    { path: 'po-modified-add', component: POModifiedEditComponent, data: { permission: 'Pages.Administration.POModified.Create', editPageState: EditPageState.add } },
                    { path: 'po-modified-edit', component: POModifiedEditComponent, data: { permission: 'Pages.Administration.POModified.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-modified-view', component: POModifiedEditComponent, data: { permission: 'Pages.Administration.POModified.View', editPageState: EditPageState.viewDetail } },
                       
                    //R
                    { path: 'group-r', component: GroupRListComponent, data: { permission: 'Pages.Administration.GroupR' } },
                    { path: 'group-r-add', component: GroupREditComponent, data: { permission: 'Pages.Administration.GroupR.Create', editPageState: EditPageState.add } },
                    { path: 'group-r-edit', component: GroupREditComponent, data: { permission: 'Pages.Administration.GroupR.Edit', editPageState: EditPageState.edit } },
                    { path: 'group-r-view', component: GroupREditComponent, data: { permission: 'Pages.Administration.GroupR.View', editPageState: EditPageState.viewDetail } },
                    
                    //Năng suất ngày
                    { path: 'po-dailykpi', component: PODailyKPIListComponent, data: { permission: 'Pages.Administration.PODailyKPI' } },
                    { path: 'po-dailykpi-add', component: PODailyKPIEditComponent, data: { permission: 'Pages.Administration.PODailyKPI.Create', editPageState: EditPageState.add } },
                    { path: 'po-dailykpi-edit', component: PODailyKPIEditComponent, data: { permission: 'Pages.Administration.PODailyKPI.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-dailykpi-view', component: PODailyKPIEditComponent, data: { permission: 'Pages.Administration.PODailyKPI.View', editPageState: EditPageState.viewDetail } },
                    
                    //PO chậm sản xuất
                    { path: 'po-delay', component: PODelayListComponent, data: { permission: 'Pages.Administration.PODelay' } },
                    { path: 'po-delay-add', component: PODelayEditComponent, data: { permission: 'Pages.Administration.PODelay.Create', editPageState: EditPageState.add } },
                    { path: 'po-delay-edit', component: PODelayEditComponent, data: { permission: 'Pages.Administration.PODelay.Edit', editPageState: EditPageState.edit } },
                    { path: 'po-delay-view', component: PODelayEditComponent, data: { permission: 'Pages.Administration.PODelay.View', editPageState: EditPageState.viewDetail } },
    
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class PoMasterRoutingModule {

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
