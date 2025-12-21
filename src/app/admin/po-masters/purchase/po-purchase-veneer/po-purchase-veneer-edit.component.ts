import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { PO_ENTITY, PoMasterServiceProxy, PO_PRODUCT_ENTITY, PO_GROUP_PRODUCT_ENTITY, PoProductedPartVeneerServiceProxy, ReportInfo, AsposeServiceProxy, PO_PRODUCTED_PART_VENEER_ENTITY, PO_PRODUCTED_PART_VENEER_SPECIFICATION_ENTITY } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { IUiActionRejectExt } from '@app/ultilities/ui-action-re';
import { NgForm } from '@angular/forms';
import { ReportTypeConsts } from '@app/admin/core/ultils/consts/ReportTypeConsts';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { HistoryModalComponent } from '@app/admin/core/modal/history-modal/history-modal.component';
import { CMRejectModalComponent } from '@app/admin/core/controls/common/cm-reject-modal/cm-reject-modal.component';
import { PoProductOfGroupProductModalComponent } from '@app/admin/core/modal/module-po/po-product-of-group-product-modal/po-product-of-group-product-modal.component';
import { PoGroupProductOfPOModalComponent } from '@app/admin/core/modal/module-po/po-group-product-of-po-modal/po-group-product-of-po-modal.component';
import { ToolbarRejectExtComponent } from '@app/admin/core/controls/toolbar-reject-ext/toolbar-reject-ext.component';

@Component({
    templateUrl: './po-purchase-veneer-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PoPurchaseVeneerEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionRejectExt<PO_ENTITY> {
   
    constructor(
        injector: Injector,
        private poProductedPartVeneerService: PoProductedPartVeneerServiceProxy,
		private asposeService: AsposeServiceProxy,
		private fileDownloadService: FileDownloadService,
        private poMasterService: PoMasterServiceProxy,
    ) {
        super(injector);

        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.pO_PRODUCTED_PART_VENEER_ID = this.getRouteParam('id');
        this.initFilter();
    }

    @ViewChild('editForm') editForm: NgForm;

    // Thông tin quy cách dán VENEER
    @ViewChild('editTableProductedPartVeneerSpecification') editTableProductedPartVeneerSpecification: EditableTableComponent<PO_PRODUCTED_PART_VENEER_SPECIFICATION_ENTITY>;
    
    @ViewChild('poProductOfGroupProductModal') poProductOfGroupProductModal: PoProductOfGroupProductModalComponent;
    @ViewChild('poGroupProductOfPOModal') poGroupProductOfPOModal: PoGroupProductOfPOModalComponent;
    // lịch sử xử lý
    @ViewChild('history_modal') history_modal: HistoryModalComponent;
    // Không tiếp nhận
    @ViewChild('cmRejectModal') cmRejectModal: CMRejectModalComponent;

    EditPageState = EditPageState;
    editPageState: EditPageState;

    inputModel: PO_PRODUCTED_PART_VENEER_ENTITY = new PO_PRODUCTED_PART_VENEER_ENTITY();
    filterInput: PO_PRODUCTED_PART_VENEER_ENTITY;

    get disableInput(): boolean {
        if((this.editPageState == EditPageState.edit && this.inputModel.purchasE_AUTH_STATUS == 'NOT_PURCHASE')
        || (this.editPageState == EditPageState.edit && this.inputModel.purchasE_AUTH_STATUS == 'PURCHASING')
        ){
            return false
        }
        else{
            return true;
        }
    }

    get disableInputProductedPartRequest(): boolean {
        if((this.inputModel.autH_STATUS == 'SENT')
        ){
            return true
        }
        else{
            return false;
        }
    }

    get disableInputPurchaseNotAppr(): boolean {
        if((this.inputModel.purchasE_AUTH_STATUS == 'PURCHASING')
        ){
            return true
        }
        else{
            return false;
        }
    }

    get disableInputPurchaseAppr(): boolean {
        if((this.inputModel.purchasE_AUTH_STATUS == 'PURCHASED')
        ){
            return true
        }
        else{
            return false;
        }
    }

    get disableInputExportPurchaseDT(): boolean {
        if((this.inputModel.purchasE_AUTH_STATUS == 'PURCHASING')
        || (this.inputModel.purchasE_AUTH_STATUS == 'PURCHASED')
        ){
            return true
        }
        else{
            return false;
        }
    }

    get disableInputRejectAfterAccept(): boolean {
        if((this.inputModel.autH_STATUS == 'ACCEPT')
        ){
            return true
        }
        else{
            return false;
        }
    }

    get apptoolbar(): ToolbarRejectExtComponent {
        return this.appToolbar as ToolbarRejectExtComponent;
    }

    listProduct: PO_PRODUCT_ENTITY[];
    listProductOfGroupProduct: PO_PRODUCT_ENTITY[];
    listGroupProduct: PO_GROUP_PRODUCT_ENTITY[];

    checkApproveOfCurrentUser() {
        this.poMasterService
            .cM_CHECK_ROLE_Edit(this.inputModel.pO_PRODUCTED_PART_VENEER_ID, 'PO_PURCHASE_VENEER', this.appSession.user.userName)
            .subscribe(res => {
                if (res['Result'] !== '0') {
                    this.appToolbar.setButtonSaveEnable(false);
                    this.updateView();

                }
                else {
                    this.appToolbar.setButtonSaveEnable(true);
                    this.updateView();
                }
            }
        )
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
                this.appToolbar.setRole('PoPurchaseVeneer', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('PoPurchaseVeneer', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getPoProductedPartVeneer();
                var tmp = "";
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('PoPurchaseVeneer', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getPoProductedPartVeneer();
                break;
        }
        this.appToolbar.setUiAction(this);
        this.initData();
    }

    initData(){
    }

    getPoProductedPartVeneer() {
        this.poProductedPartVeneerService.pO_PRODUCTED_PART_VENEER_ById(this.inputModel.pO_PRODUCTED_PART_VENEER_ID).subscribe(response => {
            if (!response) this.goBack()
            this.inputModel = response;

            // Danh sách công đoạn
			if (this.inputModel.pO_PRODUCTED_PART_VENEER_SPECIFICATIONs && this.inputModel.pO_PRODUCTED_PART_VENEER_SPECIFICATIONs.length > 0) {
				this.editTableProductedPartVeneerSpecification.setList(this.inputModel.pO_PRODUCTED_PART_VENEER_SPECIFICATIONs);
            }

            this.checkApproveOfCurrentUser();
            this.history_modal.getDetail();
            this.updateParentView();
            this.updateView();
        });

    }

    saveInput() {
        this.getEditTablesData();

        if(this.editPageState != EditPageState.viewDetail) {
            this.inputModel.makeR_ID = this.appSession.user.userName;
			this.saving = true;
            if(!this.inputModel.pO_PRODUCTED_PART_VENEER_ID) {
                this.onAdd();
            } else {
                this.onUpdate();
            }
        } 
    }

    getEditTablesData(): void {

        // Thông tin quy cách dán VENEER
        this.inputModel.pO_PRODUCTED_PART_VENEER_SPECIFICATIONs = this.editTableProductedPartVeneerSpecification.allData;

        this.updateView();
    }

    goBack() {
        this.navigatePassParam('/app/admin/po-purchase-veneer', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    onAdd(): void {
    }

    onUpdate(): void {
        this.updateView();
        this.poProductedPartVeneerService
			.pO_PURCHASE_VENEER_Upd(this.inputModel)
			.pipe( finalize(() => { this.saving = false; }) )
			.subscribe((res) => {
				if (res['Result'] != '0') {
					this.showErrorMessage(res['ErrorDesc']);
                    this.updateView();
				} else {
					this.updateSuccess();
                    this.getPoProductedPartVeneer();
                    this.updateView();
				}
			});
    }

    onAccept(){
        this.poProductedPartVeneerService
			.pO_PRODUCTED_PART_VENEER_ACCEPT(this.inputModel.pO_PRODUCTED_PART_VENEER_ID, this.appSession.user.userName)
			.pipe( finalize(() => { this.saving = false; }) )
			.subscribe((res) => {
				if (res['Result'] != '0') {
					this.showErrorMessage(res['ErrorDesc']);
                    this.updateView();
				} else {
					this.showSuccessMessage(res['ErrorDesc']);
                    this.getPoProductedPartVeneer();
                    this.updateView();
				}
			});
    }

    onShowNotAccept(){
        this.cmRejectModal.rejectLogInput.trN_TYPE = 'PO_PRODUCTED_PART_VENEER';
        this.cmRejectModal.rejectLogInput.stage = 'PURCHASE';
        this.cmRejectModal.rejectLogInput.trN_ID = this.inputModel.pO_PRODUCTED_PART_VENEER_ID;
        this.cmRejectModal.show();
    }

    onRejectToMakerProductedPart(){
        this.cmRejectModal.rejectLogInput.trN_TYPE = 'PO_PRODUCTED_PART_VENEER';
        this.cmRejectModal.rejectLogInput.stage = 'PURCHASE_REJECT_AFTER_ACCEPT';
        this.cmRejectModal.rejectLogInput.trN_ID = this.inputModel.pO_PRODUCTED_PART_VENEER_ID;
        this.cmRejectModal.show();
    }

    onSelectNotAccept(){
        this.getPoProductedPartVeneer();
        this.updateView();
    }

    getRecommendReject(){
        this.getPoProductedPartVeneer();
        this.updateView();
    }

    onPoPurchaseAppr(){
        this.updateView();
        this.poProductedPartVeneerService
			.pO_PURCHASE_VENEER_Upd(this.inputModel)
			.pipe( finalize(() => { this.saving = false; }) )
			.subscribe((res) => {
				if (res['Result'] != '0') {
					this.showErrorMessage(res['ErrorDesc']);
                    this.updateView();
				} else {
                    this.poProductedPartVeneerService
                        .pO_PURCHASE_VENEER_Appr(this.inputModel.pO_PRODUCTED_PART_VENEER_ID, this.appSession.user.userName)
                        .pipe( finalize(() => { this.saving = false; }) )
                        .subscribe((res) => {
                            if (res['Result'] != '0') {
                                this.showErrorMessage(res['ErrorDesc']);
                                this.updateView();
                            } else {
                                this.showSuccessMessage(res['ErrorDesc']);
                                this.getPoProductedPartVeneer();
                                this.updateView();
                            }
                        });
				}
			});
    }

    onEditPurchase(){
        this.message.confirm(
            this.l(`Chỉnh sửa đơn hàng sau khi đã xác nhận đặt hàng` ),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.poProductedPartVeneerService
                        .pO_PURCHASE_VENEER_Edit(this.inputModel.pO_PRODUCTED_PART_VENEER_ID, this.appSession.user.userName)
                        .pipe( finalize(() => { this.saving = false; }) )
                        .subscribe((res) => {
                            if (res['Result'] != '0') {
                                this.showErrorMessage(res['ErrorDesc']);
                                this.updateView();
                            } else {
                                this.showSuccessMessage(res['ErrorDesc']);
                                this.getPoProductedPartVeneer();
                                this.updateView();
                            }
                        });
                }
            }
        );
    }

    onDelete(item: PO_ENTITY): void {

    }

    onApprove(item: PO_ENTITY): void {
        
    }
    
    onViewDetail(item: PO_ENTITY): void {
    }

    onSave(): void {
        this.saveInput();
    }

    onSearch(): void {
    }

    onResetSearch(): void {
    }

    onReject(item: PO_ENTITY): void {

    }

    onReturn(notes: string) {
    }
    select2Change($event) {
        var tmp = $event;
    }

    onTemp(){

    }

    importFilterInput: PO_PRODUCTED_PART_VENEER_ENTITY = new PO_PRODUCTED_PART_VENEER_ENTITY();
    xlsStructure = [
        'producT_CODE',
        'producT_NAME',
        'notes',
    ];
    onImportExcel(rows: any) {
        let excelArr = this.xlsRowsToArr(rows, this.xlsStructure, function (obj: PO_PRODUCT_ENTITY) {
            return obj;
        })
        if (!excelArr) {
            abp.ui.clearBusy();
            return;
        }
        // phần gán data gửi về BE
        this.importFilterInput.pO_PRODUCTED_PART_VENEER_SPECIFICATIONs = excelArr.map(this.excelMapping);
        this.importFilterInput.makeR_ID = this.appSession.user.userName;

        if (excelArr && excelArr.length) {
            this.poProductedPartVeneerService
                .pO_PRODUCTED_PART_VENEER_SPECIFICATION_Import(this.importFilterInput)
                .pipe( finalize(() => { abp.ui.clearBusy();}))
                .subscribe((res) => {
                    if(res['Result'] == '-1'){
                        this.showErrorMessage(res['ErrorDesc']);
                    }
                    else{
                        this.showSuccessMessage(this.l('ImportSuccessfully'));
                    }
                    this.updateView();
                });
        }
        this.updateView();
    }



    exportExcelTemplate() {
        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;
        reportInfo.pathName = '/PO_MASTER/FileImport_Product.xlsx';
        reportInfo.storeName = 'PO_Gen_R';
        this.asposeService.getReportFromTable(reportInfo).subscribe((res) => {
            this.fileDownloadService.downloadTempFile(res);
        });
    }

    onAddProductedPartVeneerSpecification(){
        let datas = this.editTableProductedPartVeneerSpecification.allData;
		let data = new PO_PRODUCTED_PART_VENEER_SPECIFICATION_ENTITY();
		datas.push(data);
		this.editTableProductedPartVeneerSpecification.setList(datas);
		this.updateView();
    }
    onRemoveProductedPartVeneerSpecification(){
        this.editTableProductedPartVeneerSpecification.removeAllCheckedItem();
        this.updateView();
    }

    onShowPoGroupProductOfPOModal(item: PO_PRODUCTED_PART_VENEER_SPECIFICATION_ENTITY){
        this.poGroupProductOfPOModal.filterInput.pO_ID = this.inputModel.pO_ID;
        this.poGroupProductOfPOModal.show();
        this.poGroupProductOfPOModal.search();
    }

    onSelectGroupProductOfPO(event: PO_GROUP_PRODUCT_ENTITY){
        let currentItem = this.editTableProductedPartVeneerSpecification.currentItem;
		let dataCurrentItem = this.editTableProductedPartVeneerSpecification.allData[this.editTableProductedPartVeneerSpecification.allData.indexOf(currentItem)];

        if(dataCurrentItem.grouP_PRODUCT_ID != event.grouP_PRODUCT_ID){
            
            dataCurrentItem.grouP_PRODUCT_ID = event.grouP_PRODUCT_ID;
            dataCurrentItem.grouP_PRODUCT_CODE = event.grouP_PRODUCT_CODE;
            dataCurrentItem.grouP_PRODUCT_NAME = event.grouP_PRODUCT_NAME;

            dataCurrentItem.producT_ID = '';
            dataCurrentItem.producT_CODE = '';
            dataCurrentItem.producT_NAME = '';

            this.poProductOfGroupProductModal.currentItem = undefined;
			this.poProductOfGroupProductModal.dataTable.records = [];
			this.poProductOfGroupProductModal.dataTable.totalRecordsCount = undefined;
            this.updateView();
        }
        else{
            dataCurrentItem.grouP_PRODUCT_ID = event.grouP_PRODUCT_ID;
            dataCurrentItem.grouP_PRODUCT_CODE = event.grouP_PRODUCT_CODE;
            dataCurrentItem.grouP_PRODUCT_NAME = event.grouP_PRODUCT_NAME;

            this.poProductOfGroupProductModal.currentItem = undefined;
			this.poProductOfGroupProductModal.dataTable.records = [];
			this.poProductOfGroupProductModal.dataTable.totalRecordsCount = undefined;
            this.updateView();
        }
    }
    
    onShowPoProductOfGroupProductModal(item: PO_PRODUCTED_PART_VENEER_SPECIFICATION_ENTITY){
        this.poProductOfGroupProductModal.po_id = this.inputModel.pO_ID;
        this.poProductOfGroupProductModal.group_product_id = item.grouP_PRODUCT_ID;
        this.poProductOfGroupProductModal.show();
        this.poProductOfGroupProductModal.search();
    }

    onSelectProductOfGroupProduct(event: PO_PRODUCT_ENTITY){
        let currentItem = this.editTableProductedPartVeneerSpecification.currentItem;
		let dataCurrentItem = this.editTableProductedPartVeneerSpecification.allData[this.editTableProductedPartVeneerSpecification.allData.indexOf(currentItem)];

        dataCurrentItem.producT_ID = event.producT_ID;
        dataCurrentItem.producT_CODE = event.producT_CODE;
        dataCurrentItem.producT_NAME = event.producT_NAME;
        this.updateView();
    }

    exportExcelPurchaseDT():void {
        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        let filterReport = { ...this.inputModel };
        filterReport.pO_PRODUCTED_PART_VENEER_ID = this.inputModel.pO_PRODUCTED_PART_VENEER_ID;
        filterReport.checkeR_ID = this.inputModel.checkeR_ID;

        filterReport.maxResultCount = -1;
        filterReport.totalCount = this.isNull(filterReport.totalCount) ? 0 : filterReport.totalCount;
        filterReport.skipCount = 0;

        reportInfo.parameters = this.GetParamsFromFilter(filterReport);

        reportInfo.pathName = '/PO_MASTER/rpt_PO_PURCHASE_VENEER_DT.xlsx';
        reportInfo.storeName = 'rpt_PO_PURCHASE_VENEER_DT_Byid';
        reportInfo.values = this.GetParamsFromFilter({
        });
        this.asposeService.getReport(reportInfo).subscribe((res) => {
            this.fileDownloadService.downloadTempFile(res);
        });
    }

    onCalc(item: PO_PRODUCTED_PART_VENEER_SPECIFICATION_ENTITY){
        item.m2 = item.planK_CUT_WIDTH * item.planK_CUT_LENGTH / 1000000;
        item.totaL_AMT = (item.unitpricE_PLANK_MAIN_1 + item.unitpricE_PLANK_MAIN_2 + 
                        item.unitpricE_PLANK_SUB_1 + item.unitpricE_PLANK_SUB_2)* (item.planK_CUT_WIDTH * item.planK_CUT_LENGTH / 1000000);
    }


}
