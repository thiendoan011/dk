import { Component, Injector, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ATTACH_FILE_ENTITY, DOCUMENT_CONFIRM_ENTITY, DocumentServiceProxy, PoCoststatementServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { DocumentModalComponent } from '@app/admin/core/modal/module-po/document-modal/document-modal.component';
import { DocDcUserConfirmEditTableComponent } from './edittable/doc-dc-user-confirm-edittable.component';

@Component({
    templateUrl: './document-confirm-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class DocumentConfirmEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit {
//#region constructor
    constructor(
        injector: Injector,
        private documentService: DocumentServiceProxy,
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.doC_CONFIRM_ID = this.getRouteParam('id');
    }

    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: DOCUMENT_CONFIRM_ENTITY = new DOCUMENT_CONFIRM_ENTITY();
    filterInput: DOCUMENT_CONFIRM_ENTITY;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                break;
            case EditPageState.edit:
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.getDataPages();
                break;
        }
    }

    ngAfterViewInit(): void {
        this.updateView();
    }
//#endregion constructor

//#region CRUD    
    goBack() {
        this.navigatePassParam('/app/admin/document-confirm', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.documentService.dOC_CONFIRM_ById(this.inputModel.doC_CONFIRM_ID).subscribe(response => {
            // set data
            if (!response) this.goBack()
            this.inputModel = response;

            this.setDataEditTables();

            // set role, view button(detail at region Status Page)
            this.setViewToolBar();
            if(response.documenT_CONFIRM_USER_CONFIRMs.filter(x => x.username == this.appSession.user.userName && x.iS_CONFIRM == 'Chưa xác nhận').length > 0){
                this._is_confirm = true;
            } 
            else{
                this._is_confirm = false;
            }

            this.updateView();
        });
    }
//#endregion CRUD

//#region "EditTable"
    getDataEditTables(){
        // Danh sách bảng chiết tính
        this.inputModel.documenT_CONFIRM_USER_CONFIRMs = this.docdcuserconfirm.editTable.allData;
    }
    setDataEditTables(){
        // Chi tiết tiến độ sản phẩm
        if (this.inputModel.documenT_CONFIRM_USER_CONFIRMs && this.inputModel.documenT_CONFIRM_USER_CONFIRMs.length > 0) {
            this.docdcuserconfirm.editTable.setList(this.inputModel.documenT_CONFIRM_USER_CONFIRMs);
            this.docdcuserconfirm.refreshTable();
        }
    }

    // Danh sách bảng chiết tính
    @ViewChild('docdcuserconfirm') docdcuserconfirm: DocDcUserConfirmEditTableComponent;

//#endregion "EditTable"

//#region Status Page
    setViewToolBar(){
    }

    get disableInput(): boolean {
        return this.inputModel.autH_STATUS == 'P' || this.inputModel.autH_STATUS == 'A';
    }
    
//#endregion Status Page
    _is_confirm: boolean = false;
    get is_confirm(): boolean{
        return this._is_confirm;
    }
    onConfirm(){
        this.getDataEditTables();
        this.inputModel.typE_SEND = 'CONFIRM'
        abp.ui.setBusy();
        this.documentService
        .dOC_CONFIRM_Upd(this.inputModel)
        .pipe(finalize(() => {abp.ui.clearBusy();}))
        .subscribe((res) => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
            } else {
                this.showSuccessMessage('Xác nhận thành công');
                this.getDataPages();
                this.updateView();
            }
        });
    }

    // bộ phận tiếp nhận
    @ViewChild('docModal') docModal    : DocumentModalComponent;
    showDoc(): void {
        this.docModal.show();
    }

    onSelectDoc(item: ATTACH_FILE_ENTITY){
        this.inputModel.documenT_TYPE_ID   = item.documenT_TYPE_ID;
        this.inputModel.documenT_TYPE_CODE = item.documenT_TYPE_CODE;
        this.inputModel.documenT_TYPE_NAME = item.documenT_TYPE_NAME;

        this.inputModel.documenT_ID   = item.documenT_ID;
        this.inputModel.documenT_CODE = item.documenT_CODE;
        this.inputModel.documenT_NAME = item.documenT_NAME;
    }
    deleteDoc(){
        this.inputModel.documenT_TYPE_ID   = '';
        this.inputModel.documenT_TYPE_CODE = '';
        this.inputModel.documenT_TYPE_NAME = '';

        this.inputModel.documenT_ID   = '';
        this.inputModel.documenT_CODE = '';
        this.inputModel.documenT_NAME = '';
    }
}
