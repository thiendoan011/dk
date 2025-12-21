import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { BranchModalComponent } from "@app/admin/core/controls/common/branch-modal/branch-modal.component";
import { DepartmentModalComponent } from "@app/admin/core/controls/common/dep-modal/department-modal.component";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { DocumentRoleModalComponent } from "@app/admin/core/modal/module-po/document-role-modal/document-role-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { EditPageState } from "@app/ultilities/enum/edit-page-state";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { ATTACH_FILE_ENTITY, CM_BRANCH_ENTITY, CM_DEPARTMENT_ENTITY, DOCUMENT_CONFIRM_ENTITY, DOCUMENT_ROLE_ENTITY, DocumentServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'document-attach-file',
	templateUrl: './document-attach-file.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class DocumentAttachFileComponent extends ChangeDetectionComponent implements AfterViewInit {
    _disableInput: boolean;

    editPageState: EditPageState;
    EditPageState = EditPageState;

    @ViewChild('editTableAttachFile') editTableAttachFile: EditableTableComponent<ATTACH_FILE_ENTITY>;
    @ViewChild('branchModal') branchModal: BranchModalComponent;
    @ViewChild('depModal') depModal: DepartmentModalComponent;
    @ViewChild('docRoleModal') docRoleModal: DocumentRoleModalComponent;

    constructor(
        injector: Injector,
        private documentService: DocumentServiceProxy,
    ) {
        super(injector);
    }

    @Input() set disableInput(value: boolean) {
        this._disableInput = value;
    }

    get disableInput(): boolean {
        return this._disableInput;
    }

    get disableChange() {
        return (this.editPageState == EditPageState.viewDetail || 
                (this.editPageState == EditPageState.edit)
        )
    }

    ngOnInit(): void {

        this.updateView();
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    onAddAttachFile(): void {
        let datas = this.editTableAttachFile.allData;
        let data = new ATTACH_FILE_ENTITY();
        datas.push(data);
		this.editTableAttachFile.setList(datas);
    }

    removeAttachFile(): void {
        this.editTableAttachFile.removeAllCheckedItem();
		this.updateView();
    }

    // Show and Select
    showBranchModal(): void {
        this.branchModal.show();
    }

    onSelectBranch(event: CM_BRANCH_ENTITY): void {
        let currentItem = this.editTableAttachFile.currentItem;
		let dataCurrentItem = this.editTableAttachFile.allData[this.editTableAttachFile.allData.indexOf(currentItem)];

        if(dataCurrentItem.brancH_ID != event.brancH_ID){
            
            dataCurrentItem.brancH_ID = event.brancH_ID;
            dataCurrentItem.brancH_NAME = event.brancH_NAME;

            dataCurrentItem.deP_ID = '';
            dataCurrentItem.deP_CODE = '';
            dataCurrentItem.deP_NAME = '';

            this.depModal.currentItem = undefined;
			this.depModal.dataTable.records = [];
			this.depModal.dataTable.totalRecordsCount = undefined;
        }
        else{
            dataCurrentItem.brancH_ID = event.brancH_ID;
            dataCurrentItem.brancH_NAME = event.brancH_NAME;
        }

        this.updateView();
    }

    showDepModal(event): void {
        if (!event.brancH_ID) {
			this.showErrorMessage(this.l('NeedToChooseBranchErrorMessage'));
			return;
		}
        
        this.depModal.filterInput.brancH_ID = event.brancH_ID;
        this.depModal.branch_id = event.brancH_ID;
        this.depModal.show();
    }
    
    onSelectDep(event: CM_DEPARTMENT_ENTITY): void {
        let currentItem = this.editTableAttachFile.currentItem;
		let dataCurrentItem = this.editTableAttachFile.allData[this.editTableAttachFile.allData.indexOf(currentItem)];

        dataCurrentItem.deP_ID = event.deP_ID;
		dataCurrentItem.deP_NAME = event.deP_NAME;

        this.updateView();
    }

    showDocumentRoleModal(): void {
        this.docRoleModal.show();
    }

    onSelectDocumentRole(event: DOCUMENT_ROLE_ENTITY): void {
        let currentItem = this.editTableAttachFile.currentItem;
		let dataCurrentItem = this.editTableAttachFile.allData[this.editTableAttachFile.allData.indexOf(currentItem)];

        dataCurrentItem.rolE_ID = event.documenT_ROLE_ID;
        dataCurrentItem.rolE_CODE = event.documenT_ROLE_CODE;
        dataCurrentItem.rolE_NAME = event.documenT_ROLE_NAME;

        this.updateView();
    }

    @Output() l_req_confirm: EventEmitter<any> =   new EventEmitter();
    onAddReqConfirm(item: ATTACH_FILE_ENTITY){
        let input = new DOCUMENT_CONFIRM_ENTITY();
        input.useR_LOGIN = this.appSession.user.userName;
        input.documenT_TYPE_ID = item.reF_ID;
        input.documenT_ID = item.attacH_ID;

        abp.ui.setBusy();
        this.documentService
        .dOC_CONFIRM_Ins(input)
        .pipe(finalize(() => {abp.ui.clearBusy();}))
        .subscribe((res) => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
            } else {
                this.showSuccessMessage('Thêm mới yêu cầu thành công');
                this.l_req_confirm.emit();
                this.updateView();
            }
        });
    }
    onSendReqConfirm(item: ATTACH_FILE_ENTITY){
        let input = new DOCUMENT_CONFIRM_ENTITY();
        input.useR_LOGIN = this.appSession.user.userName;
        input.documenT_TYPE_ID = item.reF_ID;
        input.documenT_ID = item.attacH_ID;
        input.doC_CONFIRM_ID = item.doC_CONFIRM_ID;
        input.typE_SEND = 'SEND'

        abp.ui.setBusy();
        this.documentService
        .dOC_CONFIRM_Upd(input)
        .pipe(finalize(() => {abp.ui.clearBusy();}))
        .subscribe((res) => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
            } else {
                this.showSuccessMessage('Gửi yêu cầu thành công');
                this.l_req_confirm.emit();
                this.updateView();
            }
        });
    }
    conViewReqConfirm(item: ATTACH_FILE_ENTITY){
        window.open("/app/admin/document-confirm-view;id="+ item.doC_CONFIRM_ID);
    }
}