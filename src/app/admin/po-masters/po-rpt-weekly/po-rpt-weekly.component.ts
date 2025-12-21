import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from "@angular/core";
import { CM_BRANCH_ENTITY, AsposeServiceProxy, ReportInfo, PoPurchaseServiceProxy, PO_PURCHASE_ENTITY, PO_PURCHASE_ORDERS_ENTITY, PO_PRODUCTED_PART_ENTITY, PoReportServiceProxy, PO_REPORT_ENTITY, PoProductedPartDetailServiceProxy, PoMasterServiceProxy, BranchServiceProxy, } from "@shared/service-proxies/service-proxies";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import * as moment from 'moment';
import { DateFormatPipe } from "@app/admin/core/pipes/date-format.pipe";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { PartEmbryoWeeklyComponent } from "./page-1/part-embryo.component";
import { Part2WeeklyComponent } from "./page-1/part-2.component";
import { Part3WeeklyComponent } from "./page-1/part-3.component";
import { Part4WeeklyComponent } from "./page-1/part-4.component";
import { Part5WeeklyComponent } from "./page-1/part-5.component";
import { Purchase1WeeklyComponent } from "./page-1/purchase-1.component";
import { Part6WeeklyComponent } from "./page-1/part-6.component";
import { GroupProductWeeklyComponent } from "./page-1/group-product.component";
import { Purchase2WeeklyComponent } from "./page-1/purchase-2.component";
import { AllPurchaseWeeklyComponent } from "./page-1/all-purchase.component";

@Component({
    templateUrl: './po-rpt-weekly.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class PoRptWeeklyComponent extends ListComponentBase<PO_REPORT_ENTITY> implements IUiAction<PO_REPORT_ENTITY>, OnInit, AfterViewInit {

//#region constructor    
    filterInput: PO_REPORT_ENTITY = new PO_REPORT_ENTITY();
    branchName: string
    PoPurchaseParents: PO_REPORT_ENTITY[];
    branches: CM_BRANCH_ENTITY[];

    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private poMasterService: PoMasterServiceProxy,
        private branchService: BranchServiceProxy,
        private poProductedPartDetailService: PoProductedPartDetailServiceProxy,
        private poPurchaseService: PoPurchaseServiceProxy,
        private poReportService: PoReportServiceProxy) {
        super(injector);

        this.initFilter();
        this.initCombobox();
        this.stopAutoUpdateView()
        this.setupValidationMessage()
    }
//#endregion constructor

//#region body
    // danh sách vật tư chưa đặt hàng
    @ViewChild('editTablePurchaseOrder') editTablePurchaseOrder: EditableTableComponent<PO_PURCHASE_ORDERS_ENTITY>;
    // danh sách công đoạn
    @ViewChild('editTableProductedPart') editTableProductedPart: EditableTableComponent<PO_PRODUCTED_PART_ENTITY>;
    @ViewChild('part_embryo') part_embryo: PartEmbryoWeeklyComponent;
    @ViewChild('part_2') part_2: Part2WeeklyComponent;
    @ViewChild('part_3') part_3: Part3WeeklyComponent;
    @ViewChild('part_4') part_4: Part4WeeklyComponent;
    @ViewChild('part_5') part_5: Part5WeeklyComponent;
    @ViewChild('part_6') part_6: Part6WeeklyComponent;
    @ViewChild('group_product') group_product: GroupProductWeeklyComponent;
    @ViewChild('purchase1') purchase1: Purchase1WeeklyComponent;
    @ViewChild('purchase2') purchase2: Purchase2WeeklyComponent;
    @ViewChild('allpurchase') allpurchase: AllPurchaseWeeklyComponent;

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiAction(this);
        // set role toolbar
        this.appToolbar.setRole('PoRptWeekly', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();

        this.filterInput.frmdate = moment().startOf('week');
        this.filterInput.todate = moment().endOf('week').add(3, 'w');
        //this.onSearch();
        this.updateView();
    }

    ngAfterViewInit(): void {
        this.updateView()
    }

    initDefaultFilter() {
        this.filterInput.brancH_ID = this.appSession.user.subbrId;
        this.filterInput.brancH_LOGIN = this.appSession.user.subbrId;
        this.filterInput.frmdate = moment().startOf('week');
        this.filterInput.todate = moment().startOf('week').add(3, 'w');
    }

    initCombobox(): void {
        let filterCombobox = this.getFillterForCombobox();
        this.branchService.cM_BRANCH_Search(filterCombobox).subscribe(response => {
            this.branches = response.items;
            this.updateView()
        });
    }

    setSearchFinterInput() {

    }

    setFilterInputSearch() {

    }

    exportToExcel() {
        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        this.setFilterInputSearch()
        let filterReport = { ...this.filterInputSearch }
        filterReport.maxResultCount = -1;

        //reportInfo.parameters = this.GetParamsFromFilter(filterReport);
        reportInfo.parameters = this.GetParamsFromFilter({
            FRMDATE: this.filterInput.frmdate,
            TODATE: this.filterInput.todate,
            PO_CODE: this.filterInput.pO_CODE,
            PO_NAME: this.filterInput.pO_NAME,
            BRANCH_ID: this.filterInput.brancH_ID,
            BRANCH_LOGIN: this.filterInput.brancH_LOGIN,
            EXPORT_WEEK: this.filterInput.exporT_WEEK
        });

        reportInfo.values = this.GetParamsFromFilter({
            A6: 'Từ ngày ' + (new DateFormatPipe()).transform(this.filterInput.frmdate) + ' Đến ngày ' +  (new DateFormatPipe()).transform(this.filterInput.todate)
        });

        reportInfo.pathName = "/PO_MASTER/rpt_PO_Weekly.xlsx";
        reportInfo.storeName = "RPT_PO_WEEKLY";

        this.asposeService.getReport(reportInfo).subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }


    onResetSearch(): void {
        this.filterInput = new PO_REPORT_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
    }

    search(): void {
        this.showTableLoading();

        this.setSortingForFilterModel(this.filterInputSearch);
        this.setFilterInputSearch();

        this.poReportService.pO_REPORT_WEEKLY_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
    }
    
    onchangeFilterPO(){
        this.filterInput.frmdate = undefined;
        this.filterInput.todate = undefined;
        this.updateView();
    }

    onAdd(): void {}; onUpdate(item: PO_REPORT_ENTITY): void {}; onDelete(item: PO_REPORT_ENTITY): void {} onApprove(item: PO_REPORT_ENTITY): void {}; onViewDetail(item: PO_REPORT_ENTITY): void {}; onSave(): void {};
//#endregion body

//#region View Edittable
    isHiddenPartEmbryo: boolean = true;isHiddenPart2: boolean = true;isHiddenPart3: boolean = true;
    isHiddenPart4: boolean = true;isHiddenPart5: boolean = true;isHiddenPart6: boolean = true;
    isHiddenGroupProduct: boolean = true; isHiddenPurchase1: boolean = true; isHiddenPurchase2: boolean = true;
    isHiddenAllPurchase: boolean = true;
    onViewDetailGroupProduct(result: PO_REPORT_ENTITY): void {
        //window.open("/app/admin/po-group-product-view;id="+result.grouP_PRODUCT_ID);
        this.poMasterService.pO_ById(result.pO_ID).subscribe(response => {
            // Danh sách sản phẩm
			if (response.pO_PRODUCTs.length > 0) {
				this.group_product.editTableProduct.setList(response.pO_PRODUCTs.filter((x) => x.grouP_PRODUCT_ID === result.grouP_PRODUCT_ID));
            }
            this.group_product.po_name = result.pO_NAME;
            this.group_product.group_product_name = result.grouP_PRODUCT_NAME;
        });
        this.isShowGroupProduct();
    }
    onViewDetailProcessinG1(result: PO_REPORT_ENTITY): void {
        //window.open("/app/admin/po-producted-part-embryo-view;po_id="+result.pO_ID + ";producted_part_code=CD1");
        this.poProductedPartDetailService.pO_Producted_Part_Detail_ById(result.pO_ID, 'CD1').subscribe(response => {
            this.part_embryo.editTableProductedPartDetail.setList(response.pO_PRODUCTED_PARTs_DETAIL);
        });
        this.part_embryo.po_name = result.pO_NAME;
        this.part_embryo.group_product_name = result.grouP_PRODUCT_NAME;
        this.isShowPartEmbryo();
    }
    onViewDetailProcessinG2(result: PO_REPORT_ENTITY): void {
        //window.open("/app/admin/po-producted-part-2-view;po_id="+result.pO_ID + ";producted_part_code=CD2");
        this.poProductedPartDetailService.pO_Producted_Part_Detail_ById(result.pO_ID, 'CD2').subscribe(response => {
            this.part_2.editTableProductedPartDetail.setList(response.pO_PRODUCTED_PARTs_DETAIL);
        });
        this.part_2.po_name = result.pO_NAME;
        this.part_2.group_product_name = result.grouP_PRODUCT_NAME;
        this.isShowPart2();
    }
    onViewDetailProcessinG3(result: PO_REPORT_ENTITY): void {
        //window.open("/app/admin/po-producted-part-3-view;po_id="+result.pO_ID + ";producted_part_code=CD3");
        this.poProductedPartDetailService.pO_Producted_Part_Detail_ById(result.pO_ID, 'CD3').subscribe(response => {
            this.part_3.editTableProductedPartDetail.setList(response.pO_PRODUCTED_PARTs_DETAIL);
        });
        this.part_3.po_name = result.pO_NAME;
        this.part_3.group_product_name = result.grouP_PRODUCT_NAME;
        this.isShowPart3();
    }
    onViewDetailProcessinG4(result: PO_REPORT_ENTITY): void {
        //window.open("/app/admin/po-producted-part-4-view;po_id="+result.pO_ID + ";producted_part_code=CD4");
        this.poProductedPartDetailService.pO_Producted_Part_Detail_ById(result.pO_ID, 'CD4').subscribe(response => {
            this.part_4.editTableProductedPartDetail.setList(response.pO_PRODUCTED_PARTs_DETAIL);
        });
        this.part_4.po_name = result.pO_NAME;
        this.part_4.group_product_name = result.grouP_PRODUCT_NAME;
        this.isShowPart4();
    }
    onViewDetailProcessinG5(result: PO_REPORT_ENTITY): void {
        //window.open("/app/admin/po-producted-part-5-view;po_id="+result.pO_ID + ";producted_part_code=CD5");
        this.poProductedPartDetailService.pO_Producted_Part_Detail_ById(result.pO_ID, 'CD5').subscribe(response => {
            this.part_5.editTableProductedPartDetail.setList(response.pO_PRODUCTED_PARTs_DETAIL);
        });
        this.part_5.po_name = result.pO_NAME;
        this.part_5.group_product_name = result.grouP_PRODUCT_NAME;
        this.isShowPart5();
    }
    onViewDetailProcessinG6(result: PO_REPORT_ENTITY): void {
        //window.open("/app/admin/po-producted-part-6-view;po_id="+result.pO_ID + ";producted_part_code=CD6");
        this.poProductedPartDetailService.pO_Producted_Part_Detail_ById(result.pO_ID, 'CD6').subscribe(response => {
            this.part_6.editTableProductedPartDetail.setList(response.pO_PRODUCTED_PARTs_DETAIL);
        });
        this.part_6.po_name = result.pO_NAME;
        this.part_6.group_product_name = result.grouP_PRODUCT_NAME;
        this.isShowPart6();
    }

    onViewDetailPurchase11(result: PO_REPORT_ENTITY){
        this.poPurchaseService.pO_Purchase_Dashboard_ById(result.purchasE_ID_1, result.pO_ID).subscribe(response => {
            //this.po_selected = po_name;
            //this.purchase_selected = purchase_name;

            // Danh sách Danh sách đặt hàng
			if (response.pO_PURCHASE_ORDERs.length > 0) {
				this.purchase1.editTablePurchaseOrder.setList(response.pO_PURCHASE_ORDERs);
            }
            else{
                this.purchase1.editTablePurchaseOrder.setList([]);
            }
            this.purchase1.po_name = result.pO_NAME;
            this.purchase1.group_product_name = result.grouP_PRODUCT_NAME;

            this.updateView();
        });
        this.isShowPurchase1();
    }
    onViewDetailPurchase12(result: PO_REPORT_ENTITY){
        this.poPurchaseService.pO_Purchase_Dashboard_ById(result.purchasE_ID_1, result.pO_ID).subscribe(response => {
            //this.po_selected = po_name;
            //this.purchase_selected = purchase_name;

            // Danh sách Danh sách đặt hàng
			if (response.pO_PURCHASE_ORDERs.length > 0) {
				this.purchase1.editTablePurchaseOrder.setList(response.pO_PURCHASE_ORDERs);
            }
            else{
                this.purchase1.editTablePurchaseOrder.setList([]);
            }
            this.purchase1.po_name = result.pO_NAME;
            this.purchase1.group_product_name = result.grouP_PRODUCT_NAME;

            this.updateView();
        });
        this.isShowPurchase1();
    }
    onViewDetailPurchase21(result: PO_REPORT_ENTITY){
        this.poPurchaseService.pO_Purchase_Dashboard_ById(result.purchasE_ID_2, result.pO_ID).subscribe(response => {
            //this.po_selected = po_name;
            //this.purchase_selected = purchase_name;

            // Danh sách Danh sách đặt hàng
			if (response.pO_PURCHASE_ORDERs.length > 0) {
				this.purchase2.editTablePurchaseOrder.setList(response.pO_PURCHASE_ORDERs);
            }
            else{
                this.purchase2.editTablePurchaseOrder.setList([]);
            }
            this.purchase2.po_name = result.pO_NAME;
            this.purchase2.group_product_name = result.grouP_PRODUCT_NAME;

            this.updateView();
        });
        this.isShowPurchase2();
    }
    onViewDetailPurchase22(result: PO_REPORT_ENTITY){
        this.poPurchaseService.pO_Purchase_Dashboard_ById(result.purchasE_ID_2, result.pO_ID).subscribe(response => {
            //this.po_selected = po_name;
            //this.purchase_selected = purchase_name;

            // Danh sách Danh sách đặt hàng
			if (response.pO_PURCHASE_ORDERs.length > 0) {
				this.purchase2.editTablePurchaseOrder.setList(response.pO_PURCHASE_ORDERs);
            }
            else{
                this.purchase2.editTablePurchaseOrder.setList([]);
            }
            this.purchase2.po_name = result.pO_NAME;
            this.purchase2.group_product_name = result.grouP_PRODUCT_NAME;

            this.updateView();
        });
        this.isShowPurchase2();
    }

    onShowAllPurchase(result: PO_REPORT_ENTITY){
        let filter = new PO_PURCHASE_ENTITY();
        filter.pO_CODE = result.pO_CODE;
        filter.pO_ID = result.pO_ID;

        this.poPurchaseService.pO_Purchase_Search(filter)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(res => {
                this.allpurchase.editTablePurchase.setList(res.items);

                this.allpurchase.po_name = result.pO_NAME;
                this.updateView()
            });
        this.isShowAllPurchase();
    }

    isShowPartEmbryo(){
        this.isHiddenPartEmbryo = false;
        this.isHiddenPart2 = true;
        this.isHiddenPart3 = true;
        this.isHiddenPart4 = true;
        this.isHiddenPart5 = true;
        this.isHiddenPart6 = true;
        this.isHiddenGroupProduct = true;
        this.isHiddenPurchase1 = true;
        this.isHiddenPurchase2 = true;
        this.isHiddenAllPurchase = true;
    }
    isShowPart2(){
        this.isHiddenPartEmbryo = true;
        this.isHiddenPart2 = false;
        this.isHiddenPart3 = true;
        this.isHiddenPart4 = true;
        this.isHiddenPart5 = true;
        this.isHiddenPart6 = true;
        this.isHiddenGroupProduct = true;
        this.isHiddenPurchase1 = true;
        this.isHiddenPurchase2 = true;
        this.isHiddenAllPurchase = true;
    }
    isShowPart3(){
        this.isHiddenPartEmbryo = true;
        this.isHiddenPart2 = true;
        this.isHiddenPart3 = false;
        this.isHiddenPart4 = true;
        this.isHiddenPart5 = true;
        this.isHiddenPart6 = true;
        this.isHiddenGroupProduct = true;
        this.isHiddenPurchase1 = true;
        this.isHiddenPurchase2 = true;
        this.isHiddenAllPurchase = true;
    }
    isShowPart4(){
        this.isHiddenPartEmbryo = true;
        this.isHiddenPart2 = true;
        this.isHiddenPart3 = true;
        this.isHiddenPart4 = false;
        this.isHiddenPart5 = true;
        this.isHiddenPart6 = true;
        this.isHiddenGroupProduct = true;
        this.isHiddenPurchase1 = true;
        this.isHiddenPurchase2 = true;
        this.isHiddenAllPurchase = true;
    }
    isShowPart5(){
        this.isHiddenPartEmbryo = true;
        this.isHiddenPart2 = true;
        this.isHiddenPart3 = true;
        this.isHiddenPart4 = true;
        this.isHiddenPart5 = false;
        this.isHiddenPart6 = true;
        this.isHiddenGroupProduct = true;
        this.isHiddenPurchase1 = true;
        this.isHiddenPurchase2 = true;
        this.isHiddenAllPurchase = true;
    }
    isShowPart6(){
        this.isHiddenPartEmbryo = true;
        this.isHiddenPart2 = true;
        this.isHiddenPart3 = true;
        this.isHiddenPart4 = true;
        this.isHiddenPart5 = true;
        this.isHiddenPart6 = false;
        this.isHiddenGroupProduct = true;
        this.isHiddenPurchase1 = true;
        this.isHiddenPurchase2 = true;
        this.isHiddenAllPurchase = true;
    }
    isShowGroupProduct(){
        this.isHiddenPartEmbryo = true;
        this.isHiddenPart2 = true;
        this.isHiddenPart3 = true;
        this.isHiddenPart4 = true;
        this.isHiddenPart5 = true;
        this.isHiddenPart6 = true;
        this.isHiddenGroupProduct = false;
        this.isHiddenPurchase1 = true;
        this.isHiddenPurchase2 = true;
        this.isHiddenAllPurchase = true;
    }
    isShowPurchase1(){
        this.isHiddenPartEmbryo = true;
        this.isHiddenPart2 = true;
        this.isHiddenPart3 = true;
        this.isHiddenPart4 = true;
        this.isHiddenPart5 = true;
        this.isHiddenPart6 = true;
        this.isHiddenGroupProduct = true;
        this.isHiddenPurchase1 = false;
        this.isHiddenPurchase2 = true;
        this.isHiddenAllPurchase = true;
    }
    isShowPurchase2(){
        this.isHiddenPartEmbryo = true;
        this.isHiddenPart2 = true;
        this.isHiddenPart3 = true;
        this.isHiddenPart4 = true;
        this.isHiddenPart5 = true;
        this.isHiddenPart6 = true;
        this.isHiddenGroupProduct = true;
        this.isHiddenPurchase1 = true;
        this.isHiddenPurchase2 = false;
        this.isHiddenAllPurchase = true;
    }
    isShowAllPurchase(){
        this.isHiddenPartEmbryo = true;
        this.isHiddenPart2 = true;
        this.isHiddenPart3 = true;
        this.isHiddenPart4 = true;
        this.isHiddenPart5 = true;
        this.isHiddenPart6 = true;
        this.isHiddenGroupProduct = true;
        this.isHiddenPurchase1 = true;
        this.isHiddenPurchase2 = true;
        this.isHiddenAllPurchase = false;
    }
//#endregion View Edittable

//#region page 2

//#endregion page 2

}

