import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { PO_PURCHASE_ENTITY, PoPurchaseServiceProxy, ATTACH_FILE_ENTITY, PO_PURCHASE_ORDERS_ENTITY, AsposeServiceProxy, ReportInfo, PoAttachFileServiceProxy, PO_PRODUCTED_PART_VENEER_SPECIFICATION_ENTITY, PO_PRODUCT_ENTITY, CM_ATTACH_FILE_ENTITY, R_ENTITY } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { IUiActionRejectExt } from '@app/ultilities/ui-action-re';
import { NgForm } from '@angular/forms';
import * as moment from 'moment'
import { POAttachFileComponent } from '../po-purchase-state/po-attach-file.component';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { ReportTypeConsts } from '@app/admin/core/ultils/consts/ReportTypeConsts';
import { ToolbarRejectExtComponent } from '@app/admin/core/controls/toolbar-reject-ext/toolbar-reject-ext.component';
import { PoProductOfGroupProductModalComponent } from '@app/admin/core/modal/module-po/po-product-of-group-product-modal/po-product-of-group-product-modal.component';
import { POPurchaseRAttachFileComponent } from './edittable/po-purchase-r-attach-file.component';
import { POPurchaseRPurchaseAttachFileComponent } from './edittable/po-purchase-r-purchase-attach-file.component';
import { RModalComponent } from '@app/admin/core/modal/module-po/r-modal/r-modal.component';
import { POHistoryModalComponent } from '@app/admin/core/modal/module-po/po-history-modal/po-history-modal.component';

@Component({
    templateUrl: './po-purchase-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PoPurchaseEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionRejectExt<PO_PURCHASE_ENTITY> {
//#region constructor
    constructor(
        injector: Injector,
        private poPurchaseService: PoPurchaseServiceProxy,
        private attachFileServices: PoAttachFileServiceProxy,
		private asposeService: AsposeServiceProxy,
		private fileDownloadService: FileDownloadService,
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.purchasE_ID = this.getRouteParam('id');
        this.initFilter();
    }

    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: PO_PURCHASE_ENTITY = new PO_PURCHASE_ENTITY();
    filterInput: PO_PURCHASE_ENTITY;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
                this.inputModel.purchasE_TYPE = "I";
                this.appToolbar.setRole('PoPurchase', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('PoPurchase', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getPoPurchase();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('PoPurchase', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getPoPurchase();
                break;
        }
        this.appToolbar.setUiAction(this);
    }
    
    ngAfterViewInit(): void {
        this.updateView();
    }
//#endregion constructor
    
//#region CRUD
    getPoPurchase() {
        this.poPurchaseService.pO_Purchase_ById(this.inputModel.purchasE_ID).subscribe(response => {
            if (!response) this.goBack()
            this.inputModel = response;
            // lịch sử xử lý
            this.history_modal.getReject();

            if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
                this.appToolbar.setButtonApproveEnable(false);
                this.appToolbar.setButtonSaveEnable(true);
            }

            this.setDataEditTables();
            //CM_ATTACH_FILE
            this.getAttachFile();

            this.updateView();
        });

    }

    onSave(): void {
        this.saveInput();
    }

    saveInput() {
        this.getEditTablesData();
        if(this.editPageState != EditPageState.viewDetail) {
            this.inputModel.makeR_ID = this.appSession.user.userName;
			this.saving = true;
            if(!this.inputModel.purchasE_ID) {
                this.onAdd();
            } else {
                this.onUpdate();
            }
        }
    }

    goBack() {
        this.navigatePassParam('/app/admin/po-purchase', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    onAdd(): void {
        this.poPurchaseService
        .pO_Purchase_Ins(this.inputModel)
        .pipe(
            finalize(() => {
                this.saving = false
            })
        )
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc'])
            } else {
                this.inputModel.purchasE_ID = res['PURCHASE_ID'];
                // CM_ATTACH_FILE
                this.addAttachFile();
                this.showSuccessMessage(res['ErrorDesc']);
            }
            this.updateView();
        })
    }

    onUpdate(): void {
        this.updateView();
        this.poPurchaseService
			.pO_Purchase_Upd(this.inputModel)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe((res) => {
				if (res['Result'] != '0') {
					this.showErrorMessage(res['ErrorDesc']);
                    this.inputModel.autH_STATUS = AuthStatusConsts.NotApprove;
				} else {
					this.updateSuccess();
					// CM_ATTACH_FILE
                    this.addAttachFile();
                    this.getPoPurchase();
                    this.updateView();
				}
			});
    }

    onDelete(item: PO_PURCHASE_ENTITY): void {}
    onApprove(item: PO_PURCHASE_ENTITY): void {}
    onViewDetail(item: PO_PURCHASE_ENTITY): void {}
    onSearch(): void {}
    onResetSearch(): void {}
    onReject(item: PO_PURCHASE_ENTITY): void {}
//#endregion CRUD

//#region Status Page

    get disableInput(): boolean {
        return this.editPageState == EditPageState.viewDetail || this.inputModel.autH_STATUS == 'A';
    }

    get apptoolbar(): ToolbarRejectExtComponent {
        return this.appToolbar as ToolbarRejectExtComponent;
    }
//#endregion Status Page

//#region "EditTable"

    getEditTablesData(): void {
        // Danh sách đặt hàng
        this.inputModel.pO_PURCHASE_ORDERs = this.editTablePurchaseState.allData;
        
        // Tránh lỗi The error description is 'XML document must have a top level element.'.
        this.inputModel.pO_PURCHSE_ATTACH_FILEs = [];
        this.inputModel.pO_PRODUCT_OUTSOURCEDs = [];
    }

    setDataEditTables(){
        // Danh sách Danh sách đặt hàng
        if (this.inputModel.pO_PURCHASE_ORDERs.length > 0) {
            this.editTablePurchaseState.setList(this.inputModel.pO_PURCHASE_ORDERs);
        }
        // Danh sách File đính kèm LSX
        if (this.inputModel.pO_PURCHSE_R_ATTACH_FILEs.length > 0) {
            this.poPurchaseRAttachFile.editTable.setList(this.inputModel.pO_PURCHSE_R_ATTACH_FILEs);
            this.poPurchaseRAttachFile.refreshTable();
        }
        // // Danh sách file đính kèm đơn hàng LSX
        if (this.inputModel.pO_PURCHSE_R_PURCHASE_ATTACH_FILEs.length > 0) {
            this.poPurchaseRPurchaseAttachFile.editTable.setList(this.inputModel.pO_PURCHSE_R_PURCHASE_ATTACH_FILEs);
            this.poPurchaseRPurchaseAttachFile.refreshTable();
        }
    }

    @ViewChild('editForm') editForm: NgForm;
    @ViewChild('attachFile') attachFile: POAttachFileComponent;
    @ViewChild('poPurchaseRAttachFile') poPurchaseRAttachFile: POPurchaseRAttachFileComponent;
    @ViewChild('poPurchaseRPurchaseAttachFile') poPurchaseRPurchaseAttachFile: POPurchaseRPurchaseAttachFileComponent;
    @ViewChild('editTablePurchaseState') editTablePurchaseState: EditableTableComponent<PO_PURCHASE_ORDERS_ENTITY>;
    // lịch sử xử lý
    @ViewChild('history_modal') history_modal: POHistoryModalComponent;

    private addAttachFile(): void {
        let attachInput = new ATTACH_FILE_ENTITY();
        attachInput.reF_ID = this.inputModel.purchasE_ID;
        attachInput.type = 'PO_PURCHASE';
        attachInput.attacH_FILEs = [];
        attachInput.attacH_FILEs = this.attachFile.editTableAttachFile.allData;
        for(let i = 0; i < this.attachFile.editTableAttachFile.allData.length; i++) {
            attachInput.attacH_FILEs[i].emP_ID = this.appSession.user.userName;
            attachInput.attacH_FILEs[i].attacH_DT = moment();
            attachInput.attacH_FILEs[i].type = 'PO_PURCHASE';
            attachInput.attacH_FILEs[i].reF_ID = this.inputModel.purchasE_ID;
            attachInput.attacH_FILEs[i].notes = this.attachFile.editTableAttachFile.allData[i].notes;
            attachInput.attacH_FILEs[i].filE_NAME_OLD = this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT']['filE_NAME_OLD'];
            attachInput.attacH_FILEs[i].filE_NAME_NEW = this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT']['filE_NAME_NEW'];
            attachInput.attacH_FILEs[i].patH_NEW = this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT']['patH_NEW'];
            attachInput.attacH_FILEs[i].filE_SIZE = this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT']['filE_SIZE'];
            attachInput.attacH_FILEs[i].filE_TYPE = this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT']['filE_TYPE'];
        }
        this.attachFileServices.cM_ATTACH_FILE_Upd_Xml_v2(JSON.parse(JSON.stringify(attachInput)) ).subscribe(res => {
            if(res['Result'] != 0) {
                this.showErrorMessage(res['ErrorDesc'])
            }
            this.updateView();
        })
    }

    getAttachFile(): void {
        let attachInput = new ATTACH_FILE_ENTITY();
        attachInput.type = 'PO_PURCHASE';
        attachInput.typE_REQ = 'PO_PURCHASE';
        attachInput.reF_ID = this.inputModel.purchasE_ID;
        attachInput.attacH_FILEs = this.attachFile.editTableAttachFile.allData.map(x => x['filE_ATTACHMENT']);
        this.attachFileServices
        .cM_ATTACH_FILE_REQ_Byid(attachInput)
        .subscribe((res) => {
            this.attachFile.editTableAttachFile.setList(res);
            for(let i = 0; i < res.length; i++) {
                this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT'] = 
                {   
                    ...res[i]
                };
            }
            this.updateView();
            this.attachFile.updateView();
        })
    }
//#endregion "EditTable"

//#region Control
    @ViewChild('poProductOfGroupProductModal') poProductOfGroupProductModal: PoProductOfGroupProductModalComponent;
    onShowPoProductOfGroupProductModal(item: PO_PRODUCTED_PART_VENEER_SPECIFICATION_ENTITY){
        this.poProductOfGroupProductModal.po_id = this.inputModel.pO_ID;
        this.poProductOfGroupProductModal.show();
        this.poProductOfGroupProductModal.search();
    }

    onSelectProductOfGroupProduct(event: PO_PRODUCT_ENTITY){
        let currentItem = this.editTablePurchaseState.currentItem;
		let dataCurrentItem = this.editTablePurchaseState.allData[this.editTablePurchaseState.allData.indexOf(currentItem)];

        dataCurrentItem.producT_ID = event.producT_ID;
        dataCurrentItem.producT_CODE = event.producT_CODE;
        dataCurrentItem.producT_NAME = event.producT_NAME;
        this.updateView();
    }
    
    //R
    @ViewChild('rRModal') rRModal : RModalComponent;
    rModal(): void {
        this.rRModal.show();
    }
    onSelectR(event: R_ENTITY): void {
        if (event) {
            this.inputModel.r_ID   = event.r_ID;
            this.inputModel.r_CODE = event.r_CODE;
            this.inputModel.r_NAME = event.r_NAME;
            this.updateView();
        }
    }
    
//#endregion Control

//#region Excel

    exportExcelTemplate() {
		let reportInfo = new ReportInfo();
		reportInfo.typeExport = ReportTypeConsts.Excel;
        
        let reportFilter = { PURCHASE_ID: this.inputModel.purchasE_ID};
        reportInfo.parameters = this.GetParamsFromFilter(reportFilter)

		reportInfo.pathName = '/PO_MASTER/PURCHASE/PURCHASE/FileImport_Purchase_Order.xlsx';
		reportInfo.storeName = 'PO_PURCHASE_ORDERS_ById';

		this.asposeService.getReport(reportInfo).subscribe((res) => {
			this.fileDownloadService.downloadTempFile(res);
		});
	}

    importFilterInput: PO_PURCHASE_ENTITY = new PO_PURCHASE_ENTITY();
    xlsStructure = [
        'STT',
		'HARDWARE_NAME',
		'UNIT_NAME',
		'PRODUCTED_PART_CODE',
		'QUANTITY_NEEDED',
		'QUANTITY_ORDER',
		'QUANTITY_EXTRA',
        'QUANTITY_SHORTAGE',
        'QUANTITY_ADJUSTMENT_REASON',
        'PO_PURCHASE_ORDER_STATUS',
		'UNIT_PRICE',
        'PURCHASE_NUMBER',
        'NOTES',
        'PURCHASE_ORDER_ID'
	];
    
    onImportExcel(rows: any) {
		var bakValidation = [ ...this.editTablePurchaseState.validations ];
		this.editTablePurchaseState.validations = [];

		let excelArr = this.xlsRowsToArrCheckVal<PO_PURCHASE_ORDERS_ENTITY>(
			this.editTablePurchaseState,rows,this.xlsStructure,
			function(obj: PO_PURCHASE_ORDERS_ENTITY) {return obj;},undefined,false);

		if (!excelArr) {
			abp.ui.clearBusy();
			return;
		}
		this.importFilterInput.pO_PURCHASE_ORDERs = excelArr.map(this.excelMapping);

		if (excelArr && excelArr.length) {
			this.poPurchaseService
				.pO_PURCHASE_ORDER_Import(this.importFilterInput)
				.pipe(finalize(() => {abp.ui.clearBusy();}))
				.subscribe((res) => {
					if (res.length > 0) {
                        this.editTablePurchaseState.allData = [];
						res.forEach((x) => {
                            var item = new PO_PURCHASE_ORDERS_ENTITY();
                            //from excel
                            item.hardwarE_NAME = x.hardwarE_NAME;
                            item.uniT_NAME = x.uniT_NAME;
                            item.producteD_PART_CODE = x.producteD_PART_CODE;
                            item.quantitY_NEEDED = x.quantitY_NEEDED;
                            item.quantitY_ORDER = x.quantitY_ORDER;
                            item.quantitY_EXTRA = x.quantitY_EXTRA;
                            item.quantitY_SHORTAGE = x.quantitY_SHORTAGE;
                            item.quantitY_ADJUSTMENT_REASON = x.quantitY_ADJUSTMENT_REASON;
                            item.pO_PURCHASE_ORDER_STATUS = x.pO_PURCHASE_ORDER_STATUS;
                            item.uniT_PRICE = x.uniT_PRICE;
                            item.purchasE_NUMBER = x.purchasE_NUMBER;
                            item.notes = x.notes;

                            //from database
                            item.purchasE_ID = this.inputModel.purchasE_ID;
                            item.purchasE_ORDER_ID = x.purchasE_ORDER_ID;
                            item.quantitY_PURCHASED = x.quantitY_PURCHASED;
                            item.quantitY_REMAIN = x.quantitY_REMAIN;
                            item.totaL_PRICE = x.totaL_PRICE;

                            this.editTablePurchaseState.allData.push(item);
						});

						this.editTablePurchaseState.resetNoAndPage();
						this.editTablePurchaseState.changePage(0);
						this.showSuccessMessage(this.l('ImportSuccessfully'));
						this.updateView();
					} else {
						this.showErrorMessage(this.l('Immport file excel thất bại'));
						this.updateView();
					}
				});
		}
		this.editTablePurchaseState.validations = [ ...bakValidation ];
		abp.ui.clearBusy();
		this.updateView();
	}

    exportExcelListPurchase(){
        let reportInfo = new ReportInfo();
		reportInfo.typeExport = ReportTypeConsts.Excel;

        let reportFilter = { PURCHASE_ID: this.inputModel.purchasE_ID};
        reportInfo.parameters = this.GetParamsFromFilter(reportFilter)

		reportInfo.pathName = '/PO_MASTER/PURCHASE/PURCHASE/LIST_PURCHASE_ORDER.xlsx';
		reportInfo.storeName = 'PO_PURCHASE_ORDERS_ById';

		this.asposeService.getReport(reportInfo).subscribe((res) => {
			this.fileDownloadService.downloadTempFile(res);
		});
    }
//#endregion Excel

//#region ChangePage
    onChangeQuantity(event): void {
        if(event.quantitY_NEEDED && event.quantitY_ORDER){
            if(event.quantitY_NEEDED > event.quantitY_ORDER){
                event.quantitY_SHORTAGE = event.quantitY_NEEDED - event.quantitY_ORDER;
                event.quantitY_EXTRA = 0;
                this.updateView();
            }
            else if(event.quantitY_NEEDED < event.quantitY_ORDER){
                event.quantitY_EXTRA = event.quantitY_ORDER - event.quantitY_NEEDED;
                event.quantitY_SHORTAGE = 0;
                this.updateView();
            }
            else{
                event.quantitY_SHORTAGE = event.quantitY_NEEDED - event.quantitY_ORDER;
                event.quantitY_EXTRA = event.quantitY_ORDER - event.quantitY_NEEDED;
                this.updateView();
            }
        }
        else{
            event.quantitY_SHORTAGE = 0;
            event.quantitY_EXTRA = 0;
            this.updateView();
        }
    }

//#endregion ChangePage

}
