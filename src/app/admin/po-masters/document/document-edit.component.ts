import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { DOCUMENT_ENTITY, CM_DEPARTMENT_ENTITY, UltilityServiceProxy, PO_PURCHASE_ORDERS_ENTITY, ATTACH_FILE_ENTITY, DocumentServiceProxy, CM_BRANCH_ENTITY, TL_ROLE_ENTITY, TL_USER_ENTITY } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes } from '@app/ultilities/enum/all-codes';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { IUiActionRejectExt } from '@app/ultilities/ui-action-re';
import { NgForm } from '@angular/forms';
import * as moment from 'moment'
import { DocumentAttachFileComponent } from './document-attach-file.component';
import { EditableTableComponent } from '@app/admin/core/controls/common/editable-table/editable-table.component';
import { BranchModalComponent } from '@app/admin/core/controls/common/branch-modal/branch-modal.component';
import { DepartmentModalComponent } from '@app/admin/core/controls/common/dep-modal/department-modal.component';
import { TLRoleModalComponent } from '@app/admin/core/controls/common/tl-role-modal/tl-role-modal.component';
import { UserModalComponent } from '@app/admin/core/controls/common/users-modal/user-modal.component';
import { ToolbarRejectExtComponent } from '@app/admin/core/controls/toolbar-reject-ext/toolbar-reject-ext.component';
import { PoPOModalComponent } from '@app/admin/core/modal/module-po/po-po-modal/po-po-modal.component';
import { POHistoryModalComponent } from '@app/admin/core/modal/module-po/po-history-modal/po-history-modal.component';

@Component({
    templateUrl: './document-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class DocumentEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionRejectExt<DOCUMENT_ENTITY> {

    ngAfterViewInit(): void {
        this.updateView();
    }

    constructor(
        injector: Injector,
        private ultilityService: UltilityServiceProxy,
        private documentService: DocumentServiceProxy,
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.documenT_TYPE_ID = this.getRouteParam('id');
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
    @ViewChild('attachFile') attachFile: DocumentAttachFileComponent;
    @ViewChild('editTablePurchaseState') editTablePurchaseState: EditableTableComponent<PO_PURCHASE_ORDERS_ENTITY>;
    // lịch sử xử lý
    @ViewChild('document_history_modal') document_history_modal: POHistoryModalComponent;
    @ViewChild('branchModal') branchModal: BranchModalComponent;
    @ViewChild('depModal') depModal: DepartmentModalComponent;
    @ViewChild('roleModal') roleModal: TLRoleModalComponent;
    @ViewChild('userModal') userModal: UserModalComponent;

    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;

    inputModel: DOCUMENT_ENTITY = new DOCUMENT_ENTITY();
    filterInput: DOCUMENT_ENTITY;
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

    dataInTables: DOCUMENT_ENTITY[] = [];

    get apptoolbar(): ToolbarRejectExtComponent {
        return this.appToolbar as ToolbarRejectExtComponent;
    }

    ngOnInit(): void {

        switch (this.editPageState) {
            case EditPageState.add:
                this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
                this.appToolbar.setRole('Document', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.disablePoEdit = false;
                break;
            case EditPageState.edit:
                this.disablePoEdit = true;
                this.appToolbar.setRole('Document', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDetailByid();
                var tmp = "";
                break;
            case EditPageState.viewDetail:
                this.disablePoEdit = true;
                this.appToolbar.setRole('Document', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getDetailByid();
                break;
        }
        this.appToolbar.setUiAction(this);
        this.disableAssetInput = true;
    }

    getDetailByid() {
        // try {
        this.documentService.dOC_DOCTYPE_ById(this.inputModel.documenT_TYPE_ID).subscribe(response => {
            if (!response) this.goBack()
            this.inputModel = response;

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
			this.saving = true;
			this.isShowError = false;
            if(!this.inputModel.documenT_TYPE_ID) {
                this.onAdd();
            } else {
                this.onUpdate();
            }
        } 
    }

    getEditTablesData(): void {
    }

    goBack() {
        this.navigatePassParam('/app/admin/document', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    onAdd(): void {
        this.documentService
			.dOC_DOCTYPE_Ins(this.inputModel)
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
					this.addNewSuccess();
                    this.inputModel.documenT_TYPE_ID = res['ID'];
                    // CM_ATTACH_FILE
                    this.addAttachFile();
                    this.updateView();
				}
			});
    }

    onUpdate(): void {
        this.documentService
			.dOC_DOCTYPE_Upd(this.inputModel)
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
                    this.updateView();
				}
			});
    }

    onDelete(item: DOCUMENT_ENTITY): void {

    }

    onApprove(item: DOCUMENT_ENTITY): void {
        
    }
    
    onViewDetail(item: DOCUMENT_ENTITY): void {
    }

    onSave(): void {
        this.saveInput();
    }

    onSearch(): void {
    }

    onResetSearch(): void {
    }

    onReject(item: DOCUMENT_ENTITY): void {

    }

    onReturn(notes: string) {
    }
    select2Change($event) {
        var tmp = $event;
    }

    private addAttachFile(): void {
        let attachInput = new ATTACH_FILE_ENTITY();
        attachInput.reF_ID = this.inputModel.documenT_TYPE_ID;
        attachInput.type = 'DOCUMENT';
        attachInput.attacH_FILEs = [];
        attachInput.attacH_FILEs = this.attachFile.editTableAttachFile.allData; 
        for(let i = 0; i < this.attachFile.editTableAttachFile.allData.length; i++) {
            attachInput.attacH_FILEs[i].emP_ID = this.appSession.user.userName;
            attachInput.attacH_FILEs[i].attacH_DT = moment();
            attachInput.attacH_FILEs[i].type = 'DOCUMENT';
            attachInput.attacH_FILEs[i].reF_ID = this.inputModel.documenT_TYPE_ID;
            attachInput.attacH_FILEs[i].notes = this.attachFile.editTableAttachFile.allData[i].notes;
            attachInput.attacH_FILEs[i].index = i.toString();
            attachInput.attacH_FILEs[i].documenT_CODE = this.attachFile.editTableAttachFile.allData[i]['documenT_CODE'];
            attachInput.attacH_FILEs[i].documenT_NAME = this.attachFile.editTableAttachFile.allData[i]['documenT_NAME'];
            attachInput.attacH_FILEs[i].documenT_DESC = this.attachFile.editTableAttachFile.allData[i]['documenT_DESC'];
            attachInput.attacH_FILEs[i].documenT_DT = this.attachFile.editTableAttachFile.allData[i].documenT_DT;
            attachInput.attacH_FILEs[i].deP_DOCUMENT_ID = this.attachFile.editTableAttachFile.allData[i]['deP_DOCUMENT_ID'];
            attachInput.attacH_FILEs[i].deP_DOCUMENT_NAME = this.attachFile.editTableAttachFile.allData[i]['deP_DOCUMENT_NAME'];
            attachInput.attacH_FILEs[i].makeR_DOCUMENT_ID = this.attachFile.editTableAttachFile.allData[i]['makeR_DOCUMENT_ID'];
            attachInput.attacH_FILEs[i].brancH_ID = this.inputModel.brancH_ID;
            attachInput.attacH_FILEs[i].deP_ID = this.inputModel.deP_ID;
            attachInput.attacH_FILEs[i].rolE_ID = this.inputModel.rolE_ID;
            if(!this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT'] || !this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT']['filE_NAME_OLD']
            || this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT']['filE_NAME_NEW'] == undefined || this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT']['filE_NAME_NEW'] == null || this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT']['filE_NAME_NEW'] == ''
            || this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT']['filE_NAME_OLD'] == undefined || this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT']['filE_NAME_OLD'] == null || this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT']['filE_NAME_OLD'] == ''){
                this.showErrorMessage(` Dòng ${i}: Thêm mới văn bản thất bại! File đính kèm không được để trống`);
                return;
            }
            else{
                attachInput.attacH_FILEs[i].filE_NAME_OLD = this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT']['filE_NAME_OLD'];
                attachInput.attacH_FILEs[i].filE_NAME_NEW = this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT']['filE_NAME_NEW'];
                attachInput.attacH_FILEs[i].patH_NEW = this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT']['patH_NEW'];
                attachInput.attacH_FILEs[i].filE_SIZE = this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT']['filE_SIZE'];
                attachInput.attacH_FILEs[i].filE_TYPE = this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT']['filE_TYPE'];
            }
            
        }
        this.documentService.dOC_ATTACH_FILE_Ins(JSON.parse(JSON.stringify(attachInput)) ).subscribe(res => {
            if(res['Result'] != 0) {
                this.showErrorMessage(res['ErrorDesc'])
            }
            this.getDetailByid();
            this.updateView();
        })

        let attachTemplateInput = new ATTACH_FILE_ENTITY();
        attachTemplateInput.reF_ID = this.inputModel.documenT_TYPE_ID;
        attachTemplateInput.type = 'DOCUMENT';
        attachTemplateInput.attacH_TEMPALTE_FILEs = [];
        attachTemplateInput.attacH_TEMPALTE_FILEs = this.attachFile.editTableAttachFile.allData;
        for(let i = 0; i < this.attachFile.editTableAttachFile.allData.length; i++) {
            attachTemplateInput.attacH_TEMPALTE_FILEs[i].emP_ID = this.appSession.user.userName;
            attachTemplateInput.attacH_TEMPALTE_FILEs[i].attacH_DT = moment();
            attachTemplateInput.attacH_TEMPALTE_FILEs[i].type = 'DOCUMENT';
            attachTemplateInput.attacH_TEMPALTE_FILEs[i].reF_ID = this.inputModel.documenT_TYPE_ID;
            attachTemplateInput.attacH_TEMPALTE_FILEs[i].notes = this.attachFile.editTableAttachFile.allData[i].notes;
            attachTemplateInput.attacH_TEMPALTE_FILEs[i].documenT_CODE = this.attachFile.editTableAttachFile.allData[i]['documenT_CODE'];
            attachTemplateInput.attacH_TEMPALTE_FILEs[i].documenT_NAME = this.attachFile.editTableAttachFile.allData[i]['documenT_NAME'];
            attachTemplateInput.attacH_TEMPALTE_FILEs[i].documenT_DESC = this.attachFile.editTableAttachFile.allData[i]['documenT_DESC'];
            attachTemplateInput.attacH_TEMPALTE_FILEs[i].documenT_DT = this.attachFile.editTableAttachFile.allData[i].documenT_DT;
            attachTemplateInput.attacH_TEMPALTE_FILEs[i].deP_DOCUMENT_ID = this.attachFile.editTableAttachFile.allData[i]['deP_DOCUMENT_ID'];
            attachTemplateInput.attacH_TEMPALTE_FILEs[i].deP_DOCUMENT_NAME = this.attachFile.editTableAttachFile.allData[i]['deP_DOCUMENT_NAME'];
            attachTemplateInput.attacH_TEMPALTE_FILEs[i].makeR_DOCUMENT_ID = this.attachFile.editTableAttachFile.allData[i]['makeR_DOCUMENT_ID'];
            attachInput.attacH_FILEs[i].brancH_ID = this.inputModel.brancH_ID;
            attachInput.attacH_FILEs[i].deP_ID = this.inputModel.deP_ID;
            attachInput.attacH_FILEs[i].rolE_ID = this.inputModel.rolE_ID;
            if(!this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT'] || !this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT']['filE_NAME_OLD']
            || this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT']['filE_NAME_NEW'] == undefined || this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT']['filE_NAME_NEW'] == null || this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT']['filE_NAME_NEW'] == ''
            || this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT']['filE_NAME_OLD'] == undefined || this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT']['filE_NAME_OLD'] == null || this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT']['filE_NAME_OLD'] == ''){
                this.showErrorMessage(` Dòng ${i}: Thêm mới văn bản thất bại! File đính kèm không được để trống`);
                return;
            }
            else if(!this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT_TEMPLATE']
            || this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT_TEMPLATE']['filE_NAME_NEW'] == undefined || this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT_TEMPLATE']['filE_NAME_NEW'] == null || this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT_TEMPLATE']['filE_NAME_NEW'] == ''
            || this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT_TEMPLATE']['filE_NAME_OLD'] == undefined || this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT_TEMPLATE']['filE_NAME_OLD'] == null || this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT_TEMPLATE']['filE_NAME_OLD'] == ''){
                attachTemplateInput.attacH_TEMPALTE_FILEs[i].filE_NAME_OLD = '';
                attachTemplateInput.attacH_TEMPALTE_FILEs[i].filE_NAME_NEW = '';
                attachTemplateInput.attacH_TEMPALTE_FILEs[i].patH_NEW = '';
            }
            else{
                attachTemplateInput.attacH_TEMPALTE_FILEs[i].filE_NAME_OLD = this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT_TEMPLATE']['filE_NAME_OLD'];
                attachTemplateInput.attacH_TEMPALTE_FILEs[i].filE_NAME_NEW = this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT_TEMPLATE']['filE_NAME_NEW'];
                attachTemplateInput.attacH_TEMPALTE_FILEs[i].patH_NEW = this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT_TEMPLATE']['patH_NEW'];
                attachTemplateInput.attacH_TEMPALTE_FILEs[i].filE_SIZE = this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT_TEMPLATE']['filE_SIZE'];
                attachTemplateInput.attacH_TEMPALTE_FILEs[i].filE_TYPE = this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT_TEMPLATE']['filE_TYPE'];
            }
        }
        this.documentService.dOC_ATTACH_TEMPALTE_FILE_Ins(JSON.parse(JSON.stringify(attachTemplateInput)) ).subscribe(res => {
            if(res['Result'] != 0) {
                this.showErrorMessage(res['ErrorDesc'])
            }
            this.getDetailByid();
            this.updateView();
        })
    }

    getAttachFile(): void {
        this.attachFile.editTableAttachFile.setList([]);

        let attachInput = new ATTACH_FILE_ENTITY();
        attachInput.type = 'DOCUMENT';
        attachInput.typE_REQ = 'DOCUMENT';
        attachInput.reF_ID = this.inputModel.documenT_TYPE_ID;
        attachInput.brancH_ID = this.inputModel.brancH_ID;
        attachInput.deP_ID = this.inputModel.deP_ID;
        attachInput.rolE_ID = this.inputModel.rolE_ID;
        this.documentService
        .dOC_ATTACH_FILE_Byid(attachInput)
        .subscribe((res) => {
            this.attachFile.editTableAttachFile.setList(res);
            for(let i = 0; i < res.length; i++) {
                this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT'] = 
                {   
                    ...res[i]
                };
                //this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT_TEMPLATE'] = [];
            }
            this.updateView();
            this.attachFile.updateView();

            let attachTempalteInput = new ATTACH_FILE_ENTITY();
            attachTempalteInput.type = 'DOCUMENT';
            attachTempalteInput.typE_REQ = 'TEMPLATE_DOCUMENT';
            attachTempalteInput.reF_ID = this.inputModel.documenT_TYPE_ID;
            attachTempalteInput.brancH_ID = this.inputModel.brancH_ID;
            attachTempalteInput.deP_ID = this.inputModel.deP_ID;
            attachTempalteInput.rolE_ID = this.inputModel.rolE_ID;
            this.documentService
            .dOC_ATTACH_FILE_Byid(attachTempalteInput)
            .subscribe((res2) => {
                for(let i = 0; i < res2.length; i++) {
                    this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT_TEMPLATE'] = 
                    {   
                        ...res2[i]
                    };
                }
                this.updateView();
                this.attachFile.updateView();
            })
        })

        
    }

    onChangeAMT(event): void {
        event.quantitY_REMAIN = event.quantitY_ORDER - event.quantitY_PURCHASED;
        //this.totalUseBudgetAMT = this.editTableBudgetCost.allData.map((x) => (x.amT_EXE ? x.amT_EXE : 0)).reduce((a, b) => a + b, 0);
        this.updateView();
    }


    // Show and Select
    showBranchModal(): void {
        this.branchModal.show();
    }

    onSelectBranch(event: CM_BRANCH_ENTITY): void {

        if(this.inputModel.brancH_ID != event.brancH_ID){
            
            this.inputModel.brancH_ID = event.brancH_ID;
            this.inputModel.brancH_NAME = event.brancH_NAME;

            this.inputModel.deP_ID = '';
            this.inputModel.deP_CODE = '';
            this.inputModel.deP_NAME = '';

            this.depModal.currentItem = undefined;
			this.depModal.dataTable.records = [];
			this.depModal.dataTable.totalRecordsCount = undefined;
        }
        else{
            this.inputModel.brancH_ID = event.brancH_ID;
            this.inputModel.brancH_NAME = event.brancH_NAME;
        }

        this.updateView();
    }
    deleteBranch(){
        this.inputModel.brancH_ID = '';
        this.inputModel.brancH_NAME = '';
        this.updateView();
    }

    showDepModal(): void {
        if (!this.inputModel.brancH_ID) {
			this.showErrorMessage(this.l('NeedToChooseBranchErrorMessage'));
			return;
		}
        
        this.depModal.filterInput.brancH_ID = this.inputModel.brancH_ID;
        this.depModal.branch_id = this.inputModel.brancH_ID;
        this.depModal.show();
    }
    
    onSelectDep(event: CM_DEPARTMENT_ENTITY): void {
        this.inputModel.deP_ID = event.deP_ID;
		this.inputModel.deP_NAME = event.deP_NAME;
        this.updateView();
    }

    deleteDep(){
        this.inputModel.deP_ID = '';
		this.inputModel.deP_NAME = '';
        this.updateView();
    }

    showRoleModal(): void {
        this.roleModal.show();
    }

    onSelectRole(event: TL_ROLE_ENTITY): void {
        this.inputModel.rolE_ID = event.id;
        this.inputModel.rolE_CODE = event.displayname;
        this.inputModel.rolE_NAME = event.displayname + ' - ' + event.desc;
        this.updateView();
    }

    deleteRole(){
        this.inputModel.rolE_ID = '';
        this.inputModel.rolE_CODE = '';
        this.inputModel.rolE_NAME = '';
        this.updateView();
    }

    showListUserModal(): void {
        this.userModal.show();
    }

    deleteListUser(){
        this.inputModel.lisT_USER_VIEW_DOCUMENT = '';
        this.updateView();
    }
    onSelectListUser(items: TL_USER_ENTITY[]): void {
        let is_first_item = true;
        for (const item of items) {
            if(is_first_item){
                this.inputModel.lisT_USER_VIEW_DOCUMENT = item.tlnanme
                is_first_item = false;
            }
            else{
                this.inputModel.lisT_USER_VIEW_DOCUMENT += ',' + item.tlnanme;
            }
        }
        this.updateView();
    }
}
