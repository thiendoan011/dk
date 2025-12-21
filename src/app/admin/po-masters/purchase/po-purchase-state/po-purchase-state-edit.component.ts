import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { PO_PURCHASE_ENTITY, PoPurchaseServiceProxy, CM_DEPARTMENT_ENTITY, UltilityServiceProxy, PO_PURCHASE_ORDERS_ENTITY, ReportInfo, AsposeServiceProxy, ATTACH_FILE_ENTITY, AttachFileServiceProxy, PoAttachFileServiceProxy, R_ENTITY } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes } from '@app/ultilities/enum/all-codes';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { IUiActionRejectExt } from '@app/ultilities/ui-action-re';
import { NgForm } from '@angular/forms';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { POAttachFileComponent } from './po-attach-file.component';
import { PoPOModalComponent } from '@app/admin/core/modal/module-po/po-po-modal/po-po-modal.component';
import { ToolbarRejectExtComponent } from '@app/admin/core/controls/toolbar-reject-ext/toolbar-reject-ext.component';
import { RModalComponent } from '@app/admin/core/modal/module-po/r-modal/r-modal.component';
import * as moment from '@node_modules/moment/moment';
import { POHistoryModalComponent } from '@app/admin/core/modal/module-po/po-history-modal/po-history-modal.component';

@Component({
    templateUrl: './po-purchase-state-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PoPurchaseStateEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionRejectExt<PO_PURCHASE_ENTITY> {
    ngAfterViewInit(): void {
        this.updateView();
    }

    constructor(
        injector: Injector,
        private ultilityService: UltilityServiceProxy,
        private poPurchaseService: PoPurchaseServiceProxy,
		private asposeService: AsposeServiceProxy,
		private fileDownloadService: FileDownloadService,
        private attachFileServices: PoAttachFileServiceProxy
    ) {
        super(injector);

        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.purchasE_ID = this.getRouteParam('id');
        this.initFilter();
        this.initIsApproveFunct();
    }

    isApproveFunct: boolean;
    initIsApproveFunct(): void {
        this.ultilityService.isApproveFunct(this.getCurrentFunctionId()).subscribe((res) => {
			this.isApproveFunct = res;
		});
    }

    @ViewChild('editForm') editForm: NgForm;
    @ViewChild('poPOModal') poPOModal: PoPOModalComponent;
    @ViewChild('attachFile') attachFile: POAttachFileComponent;
    @ViewChild('editTablePurchaseState') editTablePurchaseState: EditableTableComponent<PO_PURCHASE_ORDERS_ENTITY>;
    // lịch sử xử lý
    @ViewChild('history_modal') history_modal: POHistoryModalComponent;

    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;

    inputModel: PO_PURCHASE_ENTITY = new PO_PURCHASE_ENTITY();
    filterInput: PO_PURCHASE_ENTITY;
    disableAssetInput: boolean;
    disablePoEdit: boolean;

    isInitPoType: boolean = false

    get disableInput(): boolean {
        return this.editPageState == EditPageState.viewDetail || this.inputModel.autH_STATUS == 'A';
    }

    departments: CM_DEPARTMENT_ENTITY[];

    isShowError = false;

    totalAmt: number = 0;
    processValue: number = 0;

    dataInTables: PO_PURCHASE_ENTITY[] = [];

    get apptoolbar(): ToolbarRejectExtComponent {
        return this.appToolbar as ToolbarRejectExtComponent;
    }

    ngOnInit(): void {

        switch (this.editPageState) {
            case EditPageState.add:
                this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
                this.appToolbar.setRole('PoPurchaseState', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.disablePoEdit = false;
                break;
            case EditPageState.edit:
                this.disablePoEdit = true;
                this.appToolbar.setRole('PoPurchaseState', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getPoPurchase();
                break;
            case EditPageState.viewDetail:
                this.disablePoEdit = true;
                this.appToolbar.setRole('PoPurchaseState', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getPoPurchase();
                break;
        }
        this.appToolbar.setUiAction(this);
        this.disableAssetInput = true;
    }

    getPoPurchase() {
        // try {
        this.poPurchaseService.pO_Purchase_ById(this.inputModel.purchasE_ID).subscribe(response => {
            if (!response) this.goBack()
            this.inputModel = response;
            // lịch sử xử lý
            this.history_modal.getReject();

            // Danh sách Danh sách đặt hàng
			if (this.inputModel.pO_PURCHASE_ORDERs.length > 0) {
				this.editTablePurchaseState.setList(this.inputModel.pO_PURCHASE_ORDERs);
            }

            if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
                this.appToolbar.setButtonApproveEnable(false);
                this.appToolbar.setButtonSaveEnable(true);
            }

            //CM_ATTACH_FILE
            this.getAttachFile();

            this.updateView();
        });

    }

    saveInput() {
        if (this.isApproveFunct == undefined) {
            this.showErrorMessage(this.l('PageLoadUndone'));
			this.updateView();
			return;
		}

        this.getEditTablesData();

        if(this.editPageState != EditPageState.viewDetail) {
            this.inputModel.makeR_ID = this.appSession.user.userName;
            this.inputModel.useR_LOGIN = this.appSession.user.userName;
			this.saving = true;
			this.isShowError = false;
            if(!this.inputModel.purchasE_ID) {
                this.onAdd();
            } else {
                this.onUpdate();
            }
        } 
    }

    getEditTablesData(): void {
        // Danh sách đặt hàng
        this.inputModel.pO_PURCHASE_ORDERs = this.editTablePurchaseState.allData;
    }

    goBack() {
        this.navigatePassParam('/app/admin/po-purchase-state', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    onAdd(): void {

    }

    onUpdate(): void {
        this.updateView();
        this.poPurchaseService
			.pO_Purchase_State_Upd(this.inputModel)
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

    onDelete(item: PO_PURCHASE_ENTITY): void {

    }

    onApprove(item: PO_PURCHASE_ENTITY): void {
        
    }
    
    onViewDetail(item: PO_PURCHASE_ENTITY): void {
    }

    onSave(): void {
        this.saveInput();
    }

    onSearch(): void {
    }

    onResetSearch(): void {
    }

    onReject(item: PO_PURCHASE_ENTITY): void {

    }

    onReturn(notes: string) {
    }
    select2Change($event) {
        var tmp = $event;
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

    onChangeAMT(event): void {
        event.quantitY_REMAIN = event.quantitY_ORDER - event.quantitY_PURCHASED;
        //this.totalUseBudgetAMT = this.editTableBudgetCost.allData.map((x) => (x.amT_EXE ? x.amT_EXE : 0)).reduce((a, b) => a + b, 0);
        this.updateView();
    }
}
