import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { UserModalComponent } from "@app/admin/core/controls/common/users-modal/user-modal.component";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { DOCUMENT_USER_ENTITY, DOCUMENT_CONFIRM_ENTITY, DocumentServiceProxy, TL_USER_ENTITY } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'doc-dc-user-confirm-edittable',
	templateUrl: './doc-dc-user-confirm-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class DocDcUserConfirmEditTableComponent extends DefaultComponentBase implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
        private documentService: DocumentServiceProxy,
    ) {
        super(injector);
    }

    _disableInput: boolean;
    @Input() set disableInput(value: boolean) {
        this._disableInput = value;
    }
    get disableInput(): boolean {
        return this._disableInput;
    }

    _inputModel: DOCUMENT_CONFIRM_ENTITY;
    @Input() set inputModel(value: DOCUMENT_CONFIRM_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): DOCUMENT_CONFIRM_ENTITY {
        return this._inputModel;
    }
//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<DOCUMENT_USER_ENTITY>;
    @ViewChild('userModal') userModal: UserModalComponent;

    ngOnInit(): void {
        this.updateView();
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    refreshTable(){
        this.updateView();
    }

    onAdd(): void {
        this.userModal.show();
        this.updateView();
    }

    onSelect(items: TL_USER_ENTITY[]){
        
        for (const item of items) {
            let user = new DOCUMENT_USER_ENTITY();
            user.doC_CONFIRM_ID = this.inputModel.doC_CONFIRM_ID;
            user.username = item.tlnanme;
            user.fullname = item.tlFullName;
            user.email = item.email;
            user.iS_CONFIRM = 'Chưa xác nhận';
            this.editTable.allData.push(user);
            this.editTable.resetNoAndPage();
            this.editTable.changePage(0);
            this.updateView();
        }
        this.updateView();
    }

    onRemove(): void {
        this.editTable.removeAllCheckedItem();
		this.updateView();
    }

    @Output() l_change: EventEmitter<any> =   new EventEmitter();
    onUpd(){
        this.inputModel.typE_SEND = 'UPD'
        this.inputModel.documenT_CONFIRM_USER_CONFIRMs = this.editTable.allData;
        abp.ui.setBusy();
        this.documentService
        .dOC_CONFIRM_Upd(this.inputModel)
        .pipe(finalize(() => {abp.ui.clearBusy();}))
        .subscribe((res) => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
            } else {
                this.showSuccessMessage('Cập nhật thành công');
                this.l_change.emit();
                this.updateView();
            }
        });
    }
    onSend(){
        this.inputModel.typE_SEND = 'SEND'
        this.inputModel.documenT_CONFIRM_USER_CONFIRMs = this.editTable.allData;
        abp.ui.setBusy();
        this.documentService
        .dOC_CONFIRM_Upd(this.inputModel)
        .pipe(finalize(() => {abp.ui.clearBusy();}))
        .subscribe((res) => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
            } else {
                this.showSuccessMessage('Gửi yêu cầu thành công');
                this.l_change.emit();
                this.updateView();
            }
        });
    }

}