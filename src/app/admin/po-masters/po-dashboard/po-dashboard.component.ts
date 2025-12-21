import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from "@angular/core";
import { CM_BRANCH_ENTITY, AsposeServiceProxy, ReportInfo, PoPurchaseServiceProxy, PO_PURCHASE_ENTITY, PO_PURCHASE_ORDERS_ENTITY, PO_PRODUCTED_PART_ENTITY, PoProductedPartDetailServiceProxy, PO_HISTORY_ENTITY, PO_GROUP_PRODUCT_ENTITY, PO_PRODUCT_ENTITY, PoGroupProductServiceProxy, BranchServiceProxy, } from "@shared/service-proxies/service-proxies";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import * as moment from 'moment';
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { POHistoryModalComponent } from "@app/admin/core/modal/module-po/po-history-modal/po-history-modal.component";

@Component({
    templateUrl: './po-dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class PoDashboardComponent extends ListComponentBase<PO_PURCHASE_ENTITY> implements IUiAction<PO_PURCHASE_ENTITY>, OnInit, AfterViewInit {
    filterInput: PO_PURCHASE_ENTITY = new PO_PURCHASE_ENTITY();
    branchName: string
    PoPurchaseParents: PO_PURCHASE_ENTITY[];
    branches: CM_BRANCH_ENTITY[];
    lstProducs: PO_PRODUCT_ENTITY[];

    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private poProductedPartDetailService: PoProductedPartDetailServiceProxy,
        private asposeService: AsposeServiceProxy,
        private branchService: BranchServiceProxy,
        private poGroupProductService: PoGroupProductServiceProxy,
        private poPurchaseService: PoPurchaseServiceProxy) {
        super(injector);

        this.initFilter();
        this.initCombobox();
        this.stopAutoUpdateView();
        this.setupValidationMessage();

        this.lstProducs = [];
    }
    

    // danh sách vật tư chưa đặt hàng
    @ViewChild('editTablePurchaseOrder') editTablePurchaseOrder: EditableTableComponent<PO_PURCHASE_ORDERS_ENTITY>;
    // danh sách công đoạn
    @ViewChild('editTableProductedPart') editTableProductedPart: EditableTableComponent<PO_PRODUCTED_PART_ENTITY>;
    // danh sách chi tiết tiến độ công đoạn
    @ViewChild('editTableProductedPartDetail') editTableProductedPartDetail: EditableTableComponent<PO_PRODUCTED_PART_ENTITY>;
    // lịch sử xử lý
    @ViewChild('po_history_modal') po_history_modal: POHistoryModalComponent;
    // danh sách hệ hàng
    @ViewChild('editTableGroupProduct') editTableGroupProduct: EditableTableComponent<PO_GROUP_PRODUCT_ENTITY>;
    // danh sách sản phẩm
    @ViewChild('editTableProduct') editTableProduct: EditableTableComponent<PO_PRODUCT_ENTITY>;

    _po_id: string = '';

    ngOnInit(): void {
        this.filterInput.frmdate = moment().startOf('week');
        this.filterInput.todate = moment().endOf('week').add(3, 'w');
        //this.onSearch();
        this.updateView();
    }

    ngAfterViewInit(): void {
        this.onSearch();
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
        // this.filterInput.n_PLATE = 'nasdsd';
        // this.updateView();
        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        this.setFilterInputSearch()
        let filterReport = { ...this.filterInputSearch }
        filterReport.maxResultCount = -1;

        reportInfo.parameters = this.GetParamsFromFilter(filterReport)

        reportInfo.pathName = "/PO_MASTER/rpt_po_master.xlsx";
        reportInfo.storeName = "PO_MASTER_Search";

        this.asposeService.getReport(reportInfo).subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }

    search(): void {

        // dùng để show hình loading, buộc user phải chờ, ngăn không cho user thao tác tiếp
        this.showTableLoading();

        // dùng để set sorting cho điều kiện tìm kiếm
        this.setSortingForFilterModel(this.filterInputSearch);
        
        this.setFilterInputSearch();

        this.poPurchaseService.pO_Purchase_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
    }

    onAdd(): void {
    }

    onUpdate(item: PO_PURCHASE_ENTITY): void {
    }

    onDelete(item: PO_PURCHASE_ENTITY): void {
        
    }

    onApprove(item: PO_PURCHASE_ENTITY): void {

    }

    onViewDetail(item: PO_PURCHASE_ENTITY): void {
    }

    onSave(): void {

    }



    onResetSearch(): void {
        this.filterInput = new PO_PURCHASE_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
    }


    po_selected: string = '';
    purchase_selected: string = '';
    getPoPurchase(id:any, po_id:any, purchase_name:any, po_name:any) {
        // lấy lịch sử xử lý
        this.filterInput.pO_ID = po_id;
        this.po_history_modal.id = po_id;
        this.po_history_modal.getReject();

        this.poPurchaseService.pO_Purchase_Dashboard_ById(id, po_id).subscribe(response => {
            this.po_selected = po_name;
            this.purchase_selected = purchase_name;

            // Danh sách vật tư thuộc đơn hàng
			if (response.pO_PURCHASE_ORDERs.length > 0) {
				this.editTablePurchaseOrder.setList(response.pO_PURCHASE_ORDERs);
                this.editTablePurchaseOrder.updateView();
            }
            else{
                this.editTablePurchaseOrder.setList([]);
                this.editTablePurchaseOrder.updateView();
            }

            // danh sách công đoạn
            if(response.pO_PRODUCTED_PARTs.length > 0){
                this.editTableProductedPart.setList(response.pO_PRODUCTED_PARTs);
                this.editTableProductedPart.updateView();
            }
            else{
                this.editTableProductedPart.setList([]);
                this.editTableProductedPart.updateView();
            }

            // Danh sách hệ hàng
            if(response.pO_GROUP_PRODUCTs.length > 0){
                this.editTableGroupProduct.setList(response.pO_GROUP_PRODUCTs);
                this.editTableGroupProduct.updateView();
            }
            else{
                this.editTableGroupProduct.setList([]);
                this.editTableGroupProduct.updateView();
            }

            // Danh sách sản phẩm
            if(response.pO_PRODUCTs.length > 0){
                this.editTableProduct.setList(response.pO_PRODUCTs);
                this.lstProducs = response.pO_PRODUCTs;
                this.editTableProduct.updateView();
            }
            else{
                this.editTableProduct.setList([]);
                this.editTableProduct.updateView();
            }

            this.updateView();
        });

    }

    producted_part_name: string = '';
    getPoProductedPartDetail(po_id:any, producted_part_code:any, producted_part_name: any) {
        this.poProductedPartDetailService.pO_Producted_Part_Detail_ById(po_id, producted_part_code)
        .subscribe(response => {
            this.producted_part_name = producted_part_name;
            // danh sách chi tiết công đoạn
            if(response.pO_PRODUCTED_PARTs_DETAIL.length > 0){
                this.editTableProductedPartDetail.setList(response.pO_PRODUCTED_PARTs_DETAIL);
                this.editTableProductedPartDetail.updateView();
            }
            else{
                this.editTableProductedPartDetail.setList([]);
                this.editTableProductedPartDetail.updateView();
            }

            this.updateView();
        });

    }

    onchangeFilterPO(){
        this.filterInput.frmdate = undefined;
        this.filterInput.todate = undefined;
        this.updateView();
    }

// hệ hàng và sản phẩm

    // Lấy danh sách sản phẩm của hệ hàng khi click 1 hệ hàng
    group_product__selected: string = '';
    getListProductOfGroupProduct(group_prodct_id:string, group_prodct_name){
        this.group_product__selected = group_prodct_name;
        this.editTableProduct.setList(this.lstProducs.filter((x) => x.grouP_PRODUCT_ID === group_prodct_id));
        this.editTableProduct.resetNoAndPage();
        this.editTableProduct.changePage(0);
        this.updateView();
    }

    getAllProduct(){
        this.editTableProduct.setList(this.editTableProduct.allData);
        this.editTableProduct.resetNoAndPage();
        this.editTableProduct.changePage(0);
        this.updateView();
    }
}

