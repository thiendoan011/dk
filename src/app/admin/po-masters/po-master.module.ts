import { NgModule } from '@angular/core';
import { commonDeclarationImports } from '../core/ultils/CommonDeclarationModule';
import { DocumentAttachFileComponent } from './document/document-attach-file.component';
import { DocumentEditComponent } from './document/document-edit.component';
import { DocumentListComponent } from './document/document-list.component';
import { PoGroupProductEditComponent } from './group-product/group-product-edit.component';
import { PoGroupProductListComponent } from './group-product/group-product-list.component';
import { PoCustomerEditComponent } from './po-customer/po-customer-edit.component';
import { PoCustomerListComponent } from './po-customer/po-customer-list.component';
import { PoDashboardComponent } from './po-dashboard/po-dashboard.component';
import { DragtableComponent } from './po-dragtable/dragtable.component';
import { POLayoutDTComponent } from './po-layout/po-layout-dt.component';
import { POLayoutEditComponent } from './po-layout/po-layout-edit.component';
import { POLayoutListComponent } from './po-layout/po-layout-list.component';
import { PoMasterRoutingModule } from './po-master-routing.module';
import { PoMasterServiceProxyModule } from './po-master-service-proxy.module';
import { PoEditComponent } from './po-master/po-master-edit.component';
import { PoListComponent } from './po-master/po-master-list.component';
import { PoProductEditComponent } from './product/po-product/po-product-edit.component';
import { PoProductListComponent } from './product/po-product/po-product-list.component';
import { PoProductedPart2EditComponent } from './producted-part/po-producted-part-2/po-producted-part-2-edit.component';
import { PoProductedPart2ListComponent } from './producted-part/po-producted-part-2/po-producted-part-2-list.component';
import { PoProductedPart3EditComponent } from './producted-part/po-producted-part-3/po-producted-part-3-edit.component';
import { PoProductedPart3ListComponent } from './producted-part/po-producted-part-3/po-producted-part-3-list.component';
import { PoProductedPart4EditComponent } from './producted-part/po-producted-part-4/po-producted-part-4-edit.component';
import { PoProductedPart4ListComponent } from './producted-part/po-producted-part-4/po-producted-part-4-list.component';
import { PoProductedPart5EditComponent } from './producted-part/po-producted-part-5/po-producted-part-5-edit.component';
import { PoProductedPart5ListComponent } from './producted-part/po-producted-part-5/po-producted-part-5-list.component';
import { PoProductedPart6EditComponent } from './producted-part/po-producted-part-6/po-producted-part-6-edit.component';
import { PoProductedPart6ListComponent } from './producted-part/po-producted-part-6/po-producted-part-6-list.component';
import { PoProductedPartEmbryoEditComponent } from './producted-part/po-producted-part-embryo/po-producted-part-embryo-edit.component';
import { PoProductedPartEmbryoListComponent } from './producted-part/po-producted-part-embryo/po-producted-part-embryo-list.component';
import { PoProductedPartEditComponent } from './producted-part/po-producted-part/po-producted-part-edit.component';
import { PoProductedPartListComponent } from './producted-part/po-producted-part/po-producted-part-list.component';
import { POAttachFileComponent } from './purchase/po-purchase-state/po-attach-file.component';
import { PoPurchaseStateEditComponent } from './purchase/po-purchase-state/po-purchase-state-edit.component';
import { PoPurchaseStateListComponent } from './purchase/po-purchase-state/po-purchase-state-list.component';
import { PoPurchaseEditComponent } from './purchase/po-purchase/po-purchase-edit.component';
import { PoPurchaseListComponent } from './purchase/po-purchase/po-purchase-list.component';
import { PoRComponent } from './po-r/po-r.component';
import { PoProductedPartVeneerListComponent } from './producted-part/po-producted-part-veneer/po-producted-part-veneer-list.component';
import { PoProductedPartVeneerEditComponent } from './producted-part/po-producted-part-veneer/po-producted-part-veneer-edit.component';
import { PoPurchaseVeneerListComponent } from './purchase/po-purchase-veneer/po-purchase-veneer-list.component';
import { PoPurchaseVeneerEditComponent } from './purchase/po-purchase-veneer/po-purchase-veneer-edit.component';
import { PoPurchaseStateVeneerEditComponent } from './purchase/po-purchase-state-veneer/po-purchase-state-veneer-edit.component';
import { PoPurchaseStateVeneerListComponent } from './purchase/po-purchase-state-veneer/po-purchase-state-veneer-list.component';
import { PoHardwareVTEditComponent } from './product/po-hardwareVT/po-hardwareVT-edit.component';
import { PoHardwareVTListComponent } from './product/po-hardwareVT/po-hardwareVT-list.component';
import { AddRowFromButtonEdittableComponent } from './po-dragtable/add-row-from-button-edittable.component';
import { PoHardwareDGEditComponent } from './product/po-hardwareDG/po-hardwareDG-edit.component';
import { PoHardwareDGListComponent } from './product/po-hardwareDG/po-hardwareDG-list.component';
import { PPPEGroupProductEditTableComponent } from './producted-part/po-producted-part-embryo/pppe-group-product-edittable.component';
import { PPPEPartDetailEditTableComponent } from './producted-part/po-producted-part-embryo/pppe-part-detail-edittable.component';
import { POCoststatementListComponent } from './coststatement/po-coststatement/po-coststatement-list.component';
import { POCoststatementEditComponent } from './coststatement/po-coststatement/po-coststatement-edit.component';
import { POCoststatementDTComponent } from './coststatement/po-coststatement/po-coststatement-dt.component';
import { HistoryEdittableComponent } from './coststatement/po-coststatement/history-edittable.component';
import { POCoststatementProductionProductionEditComponent } from './coststatement/po-coststatement-production/po-coststatement-production-edit.component';
import { POCoststatementDTProductionComponent } from './coststatement/po-coststatement-production/po-coststatement-production-dt.component';
import { POCoststatementProductionListComponent } from './coststatement/po-coststatement-production/po-coststatement-production-list.component';
import { POCoststatementLatestDTComponent } from './coststatement/po-coststatement/po-coststatement-latest-dt.component';
import { POCoststatementProductionLatestDTComponent } from './coststatement/po-coststatement-production/po-coststatement-production-latest-dt.component';
import { PoCostStatementHistoryListComponent } from './coststatement/po-coststatement-history/po-coststatement-history-list.component';
import { PoCostStatementHistoryEditComponent } from './coststatement/po-coststatement-history/po-coststatement-history-edit.component';
import { PoCostStatementProductionHistoryEditComponent } from './coststatement/po-coststatement-production-history/po-coststatement-production-history-edit.component';
import { PoCostStatementProductionHistoryListComponent } from './coststatement/po-coststatement-production-history/po-coststatement-production-history-list.component';
import { PCPHistoryEdittableComponent } from './coststatement/po-coststatement-production-history/pcp-history-edittable.component';
import { POCostStatementHistoryTransferListComponent } from './coststatement/po-coststatement-history-transfer/po-coststatement-history-transfer-list.component';
import { POPurchaseReportListComponent } from './purchase/po-purchase-report/po-purchase-report-list.component';
import { PoImportComponent } from './po-import/po-import.component';
import { RReqportPurchaseComponent } from './r/report/r-report-purchase.component';
import { ProductProductedPartEditTableComponent } from './producted-part/edittable/product-producted-part-edittable.component';
import { PPPoductOfPOEditTableComponent } from './producted-part/edittable/pp-product-of-po-edittable.component';
import { PlanEmbryoComponent } from './report/plan-embryo/plan-embryo.component';
import { PORPPMaterialListComponent } from './report/plan-production/material/material-list.component';
import { PORPPMaterialEditComponent } from './report/plan-production/material/material-edit.component';
import { PORPPTechnicalEditComponent } from './report/plan-production/technical/technical-edit.component';
import { PORPPTechnicalListComponent } from './report/plan-production/technical/technical-list.component';
import { PORPPProjectDevelopmentListComponent } from './report/plan-production/project-development/project-development-list.component';
import { PORPPProjectDevelopmentEditComponent } from './report/plan-production/project-development/project-development-edit.component';
import { DocumentConfirmListComponent } from './document/confirm/document-confirm-list.component';
import { DocumentConfirmEditComponent } from './document/confirm/document-confirm-edit.component';
import { DocDcUserConfirmEditTableComponent } from './document/confirm/edittable/doc-dc-user-confirm-edittable.component';
import { PlanProductionWeekComponent } from './report/plan-production-week/plan-production-week.component';
import { RImportComponent } from './r/r-import/r-import.component';
import { RListComponent } from './r/crud/r-list.component';
import { REditComponent } from './r/crud/r-edit.component';
import { RManageDateEdittableComponent } from './r/crud/r-manage-date-edittable.component';
import { RRequestDTEdittableComponent } from './r/crud/edittable/r-request-dt-edittable.component';
import { RGroupProductEdittableComponent } from './r/crud/edittable/r-group-product-edittable.component';
import { DashboardPlanEmbryoTbl1EdittableComponent } from './report/plan-embryo/edittable/dashboard-plan-embryo-tbl1-edittable.component';
import { DashboardPlanTbl2EdittableComponent } from './report/plan-embryo/edittable/dashboard-plan-tbl2-edittable.component';
import { ReportPlanProductChangeComponent } from './report/po-product-change/report-plan-product-change.component';
import { PoRptWeeklyComponent } from './po-rpt-weekly/po-rpt-weekly.component';
import { PartEmbryoWeeklyComponent } from './po-rpt-weekly/page-1/part-embryo.component';
import { Part2WeeklyComponent } from './po-rpt-weekly/page-1/part-2.component';
import { Part3WeeklyComponent } from './po-rpt-weekly/page-1/part-3.component';
import { Part4WeeklyComponent } from './po-rpt-weekly/page-1/part-4.component';
import { Part5WeeklyComponent } from './po-rpt-weekly/page-1/part-5.component';
import { Part6WeeklyComponent } from './po-rpt-weekly/page-1/part-6.component';
import { GroupProductWeeklyComponent } from './po-rpt-weekly/page-1/group-product.component';
import { Purchase1WeeklyComponent } from './po-rpt-weekly/page-1/purchase-1.component';
import { Purchase2WeeklyComponent } from './po-rpt-weekly/page-1/purchase-2.component';
import { AllPurchaseWeeklyComponent } from './po-rpt-weekly/page-1/all-purchase.component';
import { POReportWeeklyPage2Component } from './po-rpt-weekly/page-2/po-rpt-weekly-page-2.component';
import { PlanProductionYearEdittableComponent } from './report/plan-production-week/plan-production-year-edittable.component';
import { POReportMaterialComponent1Component } from './report/plan-production/material/component/po-report-material-component-1.component';
import { RDashboardPlanEdittableComponent } from './report/plan-production/material/component/r-dashboard-plan-edittable.component';
import { POGroupProductPOEdittableComponent } from './group-product/edittable/po-group-product-po-edittable.component';
import { POLoadContListComponent } from './po-load-cont/load-cont/po-load-cont-list.component';
import { POLoadContEditComponent } from './po-load-cont/load-cont/po-load-cont-edit.component';
import { POLoadContProductEdittableComponent } from './po-load-cont/load-cont/edittable/po-load-cont-product-edittable.component';
import { POLoadContGroupProductEdittableComponent } from './po-load-cont/load-cont/edittable/po-load-cont-group-product-edittable.component';
import { POBookingListComponent } from './po-booking/po-booking-list.component';
import { POBookingEditComponent } from './po-booking/po-booking-edit.component';
import { POBookingPOEdittableComponent } from './po-booking/edittable/po-booking-po-edittable.component';
import { POReportPOFailedRptComponent } from './report/po-failed/po-report-po-failed-rpt.component';
import { POModifiedEditComponent } from './po-modified/po-modified-edit.component';
import { POModifiedListComponent } from './po-modified/po-modified-list.component';
import { POModifiedPOSpeedUpEdittableComponent } from './po-modified/edittable/po-modified-po-speed-up-edittable.component';
import { POModifiedPODelayEdittableComponent } from './po-modified/edittable/po-modified-po-delay-edittable.component';
import { PlanProductionYearModifiedEdittableComponent } from './report/plan-production-week/plan-production-year-modified-edittable.component';
import { GroupRListComponent } from './group-r/group-r-list.component';
import { GroupREditComponent } from './group-r/group-r-edit.component';
import { GroupRGroupProductEdittableComponent } from './group-r/edittable/group-r-group-product-edittable.component';
import { POMasterAttachFileComponent } from './po-master/edittable/po-master-attach-file.component';
import { POInforHistoryComponent } from './report/po-infor-history/po-infor-history.component';
import { GroupRLSXEdittableComponent } from './group-r/edittable/group-r-lsx-edittable.component';
import { PlanProductionYearBookingEdittableComponent } from './report/plan-production-week/plan-production-year-booking-edittable.component';
import { POPurchaseImportComponent } from './purchase/po-purchase-import/po-purchase-import.component';
import { PlanProductionYearProductedPart1EdittableComponent } from './report/plan-production-week/plan-production-year-producted-part-1-edittable.component';
import { PlanProductionYearProductedPart2EdittableComponent } from './report/plan-production-week/plan-production-year-producted-part-2-edittable.component';
import { PlanProductionYearProductedPart345EdittableComponent } from './report/plan-production-week/plan-production-year-producted-part-345-edittable.component';
import { PlanProductionYearProductedPart6EdittableComponent } from './report/plan-production-week/plan-production-year-producted-part-6-edittable.component';
import { PoProductedPart25EditComponent } from './producted-part/po-producted-part-25/po-producted-part-25-edit.component';
import { PoProductedPart25ListComponent } from './producted-part/po-producted-part-25/po-producted-part-25-list.component';
import { PlanProductionYearProductedPart25EdittableComponent } from './report/plan-production-week/plan-production-year-producted-part-25-edittable.component';
import { PODailyKPIListComponent } from './po-dailykpi/po-dailykpi-list.component';
import { PODailyKPIEditComponent } from './po-dailykpi/po-dailykpi-edit.component';
import { PODailyKPIProductedPartEdittableComponent } from './po-dailykpi/edittable/po-dailykpi-producted-part-edittable.component';
import { RptPODailyKPIEdittableComponent } from './report/plan-production-week/rpt-po-dailykpi-edittable.component';
import { PageDailyKPIComponent } from './po-rpt-weekly/page-dailykpi/page-dailykpi.component';
import { PODelayDTEdittableComponent } from './po-delay/edittable/po-delay-dt-edittable.component';
import { PODelayListComponent } from './po-delay/po-delay-list.component';
import { PODelayEditComponent } from './po-delay/po-delay-edit.component';
import { RptPODelayEdittableComponent } from './report/plan-production-week/rpt-po-delay-edittable.component';
import { ReportPOComponent } from './report/report-po/report-po.component';
import { ReportPOExportWeekEdittableComponent } from './report/report-po/report-po-week/report-po-export-week-edittable.component';
import { ReportPOExportMonthEdittableComponent } from './report/report-po/report-po-month/report-po-export-month-edittable.component';
import { ReportPOBookingMonthEdittableComponent } from './report/report-po/report-po-month/report-po-booking-month-edittable.component';
import { ReportPOBookingWeekEdittableComponent } from './report/report-po/report-po-week/report-po-booking-week-edittable.component';
import { ReportPOUnprocessEdittableComponent } from './report/report-po/report-po-unprocess/report-po-unprocess-edittable.component';
import { ReportPOModifiedExportdateWeekEdittableComponent } from './report/report-po/report-po-week/report-po-modified-exportdate-week-edittable.component';
import { ReportPOModifiedExportdateMonthEdittableComponent } from './report/report-po/report-po-month/report-po-modified-exportdate-month-edittable.component';
import { POReportDataExtractionProductedPartComponent } from './report/data-extraction/producted-part/po-report-data-extraction-producted-part.component';
import { POReportDataExtractionComponent } from './report/data-extraction/po-report-data-extraction.component';
import { POReportDataExtractionCustomerComponent } from './report/data-extraction/customer/po-report-data-extraction-customer.component';
import { POReportDataExtractionGroupProductComponent } from './report/data-extraction/group-product/po-report-data-extraction-group-product.component';
import { POReportDataExtractionBookingComponent } from './report/data-extraction/booking/po-report-data-extraction-booking.component';
import { POReportDataExtractionPOGroupproductProductComponent } from './report/data-extraction/po/po-report-data-extraction-po-groupproduct-product.component';
import { POReportDataExtractionPOModifiedExportDateComponent } from './report/data-extraction/po/po-report-data-extraction-po-modified-export-date.component';
import { POProductedPartImportComponent } from './producted-part-import/producted-part-import.component';
import { ProductedPartImportProductDetailComponent } from './producted-part-import/producted-part-import-product-detail/producted-part-import-product-detail.component';
import { POReportDataExtractionProductedPart2Component } from './report/data-extraction/producted-part/po-report-data-extraction-producted-part-2.component';
import { POReportDataExtractionPOUnprocessLoadedcontComponent } from './report/data-extraction/po/po-report-data-extraction-po-unprocess-loadedcont.component';
import { POReportDataExtractionProductedPartLongUnprocessComponent } from './report/data-extraction/producted-part/po-report-data-extraction-producted-part-long-unprocess.component';
import { POMasterBookingEdittableComponent } from './po-master/edittable/po-master-booking-edittable.component';
import { POReportDataExtractionProductedPartFactoryComponent } from './report/data-extraction/producted-part/po-report-data-extraction-producted-part-factory.component';
import { ROrderEdittableComponent } from './r/crud/edittable/r-order-edittable.component';
import { RAttachFileComponent } from './r/crud/edittable/r-attach-file.component';
import { RPurchaseAttachFileComponent } from './r/crud/edittable/r-purchase-attach-file.component';
import { POPurchaseRAttachFileComponent } from './purchase/po-purchase/edittable/po-purchase-r-attach-file.component';
import { POPurchaseRPurchaseAttachFileComponent } from './purchase/po-purchase/edittable/po-purchase-r-purchase-attach-file.component';
import { PoPurchaseOutsourcedEditComponent } from './purchase/po-purchase-outsourced/po-purchase-outsourced-edit.component';
import { PoPurchaseOutsourcedListComponent } from './purchase/po-purchase-outsourced/po-purchase-outsourced-list.component';
import { POPurchaseOutsourcedAttachFileComponent } from './purchase/po-purchase-outsourced/edittable/po-purchase-outsourced-attach-file.component';
import { POPurchaseOutsourcedProductEditableComponent } from './purchase/po-purchase-outsourced/edittable/po-purchase-outsourced-product-editable.component';
import { POPurchaseOutsourcedProductReceiptEditableComponent } from './purchase/po-purchase-outsourced/edittable/po-purchase-outsourced-product-receipt-editable.component';
import { POReportDataExtractionRPurchaseComponent } from './report/data-extraction/r/po-report-data-extraction-r-purchase.component';
import { PagePOComponent } from './po-rpt-weekly/page-po/page-po.component';
import { RPOEdittableComponent } from './r/crud/edittable/r-po-edittable.component';
import { POPOProductDetailEdittableComponent } from './producted-part/po-po-product-details/po-po-product-detail-edittable.component';

@NgModule({
    imports: [
        ...commonDeclarationImports,
        PoMasterRoutingModule, PoMasterServiceProxyModule
    ],
    declarations: [
        PoListComponent, PoEditComponent, POMasterAttachFileComponent, POMasterBookingEdittableComponent,
        PoCustomerListComponent, PoCustomerEditComponent,
        PoImportComponent,

        // Hệ hàng
        PoGroupProductListComponent, PoGroupProductEditComponent,
        POGroupProductPOEdittableComponent,

        // Sản phẩm
        PoProductListComponent, PoProductEditComponent,

        PoPurchaseListComponent, PoPurchaseEditComponent, 
        PoPurchaseStateListComponent,PoPurchaseStateEditComponent,
        POAttachFileComponent, PoDashboardComponent,
        // Cập nhật tiến độ sản xuất
        PoProductedPartListComponent, PoProductedPartEditComponent,
        PoRptWeeklyComponent,

        // Văn bản
        DocumentListComponent, DocumentEditComponent, DocumentAttachFileComponent,
        DocumentConfirmListComponent, DocumentConfirmEditComponent, DocDcUserConfirmEditTableComponent,

        // Chi tiết công đoạn
        PoProductedPartEmbryoListComponent, PoProductedPartEmbryoEditComponent,
        PoProductedPart2ListComponent,PoProductedPart2EditComponent,
        PoProductedPart25ListComponent, PoProductedPart25EditComponent,
        PoProductedPart3ListComponent,PoProductedPart3EditComponent,
        PoProductedPart4ListComponent,PoProductedPart4EditComponent,
        PoProductedPart5ListComponent,PoProductedPart5EditComponent,
        PoProductedPart6ListComponent,PoProductedPart6EditComponent,
        DragtableComponent,
        POLayoutListComponent, POLayoutEditComponent, POLayoutDTComponent,
        PPPEGroupProductEditTableComponent, PPPEPartDetailEditTableComponent,
        ProductProductedPartEditTableComponent,PPPoductOfPOEditTableComponent,
        POPOProductDetailEdittableComponent,

        //Import chi tiết công đoạn
        POProductedPartImportComponent, ProductedPartImportProductDetailComponent,

        // Báo cáo tuần
            //Page 1
        PartEmbryoWeeklyComponent, Part2WeeklyComponent, Part3WeeklyComponent,
        Part4WeeklyComponent, Part5WeeklyComponent, Part6WeeklyComponent,
        GroupProductWeeklyComponent, Purchase1WeeklyComponent, Purchase2WeeklyComponent,
        AllPurchaseWeeklyComponent, PlanProductionYearEdittableComponent,
            //Page 2
        POReportWeeklyPage2Component, PageDailyKPIComponent, PagePOComponent,

        PoRComponent,

        // Veneer
        PoProductedPartVeneerListComponent, PoProductedPartVeneerEditComponent,
        PoPurchaseVeneerListComponent, PoPurchaseVeneerEditComponent,
        PoPurchaseStateVeneerListComponent,PoPurchaseStateVeneerEditComponent,

        //Vật tư hardware
        PoHardwareVTListComponent, PoHardwareVTEditComponent,

        //simple
        AddRowFromButtonEdittableComponent,
        // Vật tư đóng gói
        PoHardwareDGListComponent, PoHardwareDGEditComponent, 

        //Bảng chiết tính
        POCoststatementListComponent, POCoststatementEditComponent, POCoststatementDTComponent,
        HistoryEdittableComponent, POCoststatementLatestDTComponent,
        PoCostStatementHistoryListComponent, PoCostStatementHistoryEditComponent,
        //Bảng chiết tính sản xuất
        POCoststatementProductionListComponent, POCoststatementProductionProductionEditComponent, 
        POCoststatementDTProductionComponent, 
        POCoststatementProductionLatestDTComponent,
        PoCostStatementProductionHistoryListComponent, PoCostStatementProductionHistoryEditComponent,
        PCPHistoryEdittableComponent, POCostStatementHistoryTransferListComponent,
        // R
        RListComponent, REditComponent, RReqportPurchaseComponent, RManageDateEdittableComponent,
        RRequestDTEdittableComponent, RImportComponent, RGroupProductEdittableComponent,
        ROrderEdittableComponent, GroupRLSXEdittableComponent, RAttachFileComponent, RPurchaseAttachFileComponent,
        RPOEdittableComponent,
        // đơn hàng
        POPurchaseReportListComponent, POPurchaseImportComponent, POPurchaseRAttachFileComponent,
        POPurchaseRPurchaseAttachFileComponent,
        // đơn hàng gia công
        PoPurchaseOutsourcedListComponent, PoPurchaseOutsourcedEditComponent, POPurchaseOutsourcedAttachFileComponent,
        POPurchaseOutsourcedProductEditableComponent, POPurchaseOutsourcedProductReceiptEditableComponent,
        // Report
        PlanEmbryoComponent, DashboardPlanEmbryoTbl1EdittableComponent, DashboardPlanTbl2EdittableComponent,
        ReportPlanProductChangeComponent,
        PORPPMaterialListComponent, PORPPMaterialEditComponent, 
        PORPPTechnicalListComponent, PORPPTechnicalEditComponent, PORPPProjectDevelopmentListComponent, 
        PORPPProjectDevelopmentEditComponent, PlanProductionWeekComponent, POReportMaterialComponent1Component,
        RDashboardPlanEdittableComponent, PlanProductionYearModifiedEdittableComponent, 
        PlanProductionYearBookingEdittableComponent, PlanProductionYearProductedPart1EdittableComponent,
        PlanProductionYearProductedPart2EdittableComponent, PlanProductionYearProductedPart345EdittableComponent,
        PlanProductionYearProductedPart6EdittableComponent, PlanProductionYearProductedPart25EdittableComponent,
        RptPODailyKPIEdittableComponent, RptPODelayEdittableComponent,
            //Data extraction
            POReportDataExtractionComponent, POReportDataExtractionProductedPartComponent,
            POReportDataExtractionCustomerComponent, POReportDataExtractionGroupProductComponent,
            POReportDataExtractionBookingComponent, POReportDataExtractionPOGroupproductProductComponent,
            POReportDataExtractionPOModifiedExportDateComponent, POReportDataExtractionProductedPart2Component, 
            POReportDataExtractionProductedPartFactoryComponent,
            POReportDataExtractionPOUnprocessLoadedcontComponent, POReportDataExtractionProductedPartLongUnprocessComponent,
            POReportDataExtractionRPurchaseComponent,
            //Report PO
            ReportPOComponent, ReportPOExportWeekEdittableComponent, ReportPOExportMonthEdittableComponent,
            ReportPOBookingWeekEdittableComponent, ReportPOBookingMonthEdittableComponent, ReportPOUnprocessEdittableComponent,
            ReportPOModifiedExportdateMonthEdittableComponent, ReportPOModifiedExportdateWeekEdittableComponent,

        //Load cont
        POLoadContListComponent, POLoadContEditComponent, POLoadContProductEdittableComponent, 
        POLoadContGroupProductEdittableComponent,
        //Booking
        POBookingListComponent, POBookingEditComponent, POBookingPOEdittableComponent,
        // PO rớt
        POReportPOFailedRptComponent,
        // PO điều chỉnh
        POModifiedListComponent, POModifiedEditComponent, POModifiedPODelayEdittableComponent,
        POModifiedPOSpeedUpEdittableComponent,
        //Group R
        GroupRListComponent, GroupREditComponent, GroupRGroupProductEdittableComponent,
        // Thông tin phát sinh của PO
        POInforHistoryComponent,
        // Năng suất ngày
        PODailyKPIListComponent, PODailyKPIEditComponent, PODailyKPIProductedPartEdittableComponent,
        // PO chậm sản xuất
        PODelayListComponent, PODelayEditComponent, PODelayDTEdittableComponent
    ],
    exports: [

    ],
    providers: [

    ]
})
export class PoMasterModule { }
