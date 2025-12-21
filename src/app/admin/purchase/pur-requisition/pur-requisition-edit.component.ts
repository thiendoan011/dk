import { Component, Injector, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PUR_REQUISITION_ENTITY, PurRequisitionServiceProxy, TL_USER_ENTITY, TlUserServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { POHistory2ModalComponent } from '@app/admin/core/modal/module-po/po-history-2-modal/po-history-2-modal.component';
import { PURRequisitionREdittableComponent } from './edittable/pur-requisition-r-edittable.component';
import { PURRequisitionMaterialEdittableComponent } from './edittable/pur-requisition-material-edittable.component';

@Component({
    templateUrl: './pur-requisition-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PURRequisitionEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<PUR_REQUISITION_ENTITY> {
//#region constructor
    constructor(
        injector: Injector,
        private tlUserService: TlUserServiceProxy,
        private purRequisitionService: PurRequisitionServiceProxy
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.puR_REQUISITION_ID = this.getRouteParam('id');
        this.initDefaultFilter();
    }

    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: PUR_REQUISITION_ENTITY = new PUR_REQUISITION_ENTITY();
    filterInput: PUR_REQUISITION_ENTITY;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.appToolbar.setRole('PURRequisition', false, false, false, false, false, false, false, false);
                this.appToolbar.setEnableForViewDetailPage();

                this.inputModel.autH_STATUS = 'U'
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('PURRequisition', false, false, false, false, false, false, false, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('PURRequisition', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getDataPages();
                break;
        }
        this.appToolbar.setUiActionEdit(this);
    }

    ngAfterViewInit(): void {
        this.updateView();
    }
//#endregion constructor

//#region CRUD    
    goBack() {
        this.navigatePassParam('/app/admin/pur-requisition', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.purRequisitionService.pUR_REQUISITION_ById(this.inputModel.puR_REQUISITION_ID).subscribe(response => {
            // set data
            if (!response) this.goBack()
            this.inputModel = response;

            this.setDataEditTables();
            // set role, view button(detail at region Status Page)
            this.setViewToolBar();
            // lịch sử xử lý
            this.history_modal.getDetail();

            this.updateView();
        });
    }

    onSave(): void {
        this.saveInput();
    }

    saveInput() {
        
        this.getDataEditTables();

        if(!this.inputModel.puR_REQUISITION_ID) {
            this.onAdd();
        } else {
            this.onUpdate();
        }
    }

    onAdd(): void {
        this.saving = true;
        this.purRequisitionService
        .pUR_REQUISITION_Ins(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.inputModel.puR_REQUISITION_ID = res['ID'];
                this.showSuccessMessage(res['ErrorDesc']);
                this.getDataPages();
                this.updateView();
            }
        })
    }

    onUpdate(): void {
        this.saving = true;
        this.purRequisitionService
        .pUR_REQUISITION_Upd(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe((res) => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.updateSuccess();
                this.getDataPages();
                this.updateView();
            }
        });
    }

    onApprove(item: PUR_REQUISITION_ENTITY): void{
        this.message.confirm(
            this.l('ApproveWarningMessage', (this.inputModel.puR_REQUISITION_ID)),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.purRequisitionService
                    .pUR_REQUISITION_App(this.inputModel.puR_REQUISITION_ID)
                    .pipe(finalize(() => {this.saving = false}))
                    .subscribe((res) => {
                        if (res['Result'] != '0') {
                            this.showErrorMessage(res['ErrorDesc']);
                            this.updateView();
                        } 
                        else {
                            this.approveSuccess();
                            this.getDataPages();
                            this.updateView();
                        }
                    });
                }
            }
        );
    }

    onPurMaterialUpd(): void {
        
        this.getDataEditTables();

        this.saving = true;
        this.purRequisitionService
        .pUR_REQUISITION_MATERIAL_Upd(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe((res) => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.updateSuccess();
                this.getDataPages();
                this.updateView();
            }
        });
    }
//#endregion CRUD

//#region "EditTable"
    getDataEditTables(){
        // Danh sách lệnh sản xuất
        this.inputModel.puR_REQUISITION_Rs = this.purRequisitionREdittable.editTable.allData;
        // Danh sách vật tư cần mua
        this.inputModel.puR_REQUISITION_Materials = this.purRequisitionMaterialEdittable.editTable.allData;
    }
    setDataEditTables(){
        // Danh sách lệnh sản xuất
        if (this.inputModel.puR_REQUISITION_Rs && this.inputModel.puR_REQUISITION_Rs.length > 0) {
            this.purRequisitionREdittable.editTable.setList(this.inputModel.puR_REQUISITION_Rs);
            this.purRequisitionREdittable.refreshTable();
        }
        // Danh sách vật tư cần mua
        if (this.inputModel.puR_REQUISITION_Materials && this.inputModel.puR_REQUISITION_Materials.length > 0) {
            this.purRequisitionMaterialEdittable.editTable.setList(this.inputModel.puR_REQUISITION_Materials);
            this.purRequisitionMaterialEdittable.refreshTable();
        }
    }

    // Danh sách Lệnh sản xuất
    @ViewChild('purRequisitionREdittable') purRequisitionREdittable: PURRequisitionREdittableComponent;
    // Danh sách vật tư cần mua
    @ViewChild('purRequisitionMaterialEdittable') purRequisitionMaterialEdittable: PURRequisitionMaterialEdittableComponent;
    // lịch sử xử lý
    @ViewChild('history_modal') history_modal: POHistory2ModalComponent;
    
//#endregion "EditTable"

//#region Status Page
    setViewToolBar(){
    // Button lưu
        // Xem chi tiết
        if(this.editPageState == EditPageState.viewDetail){
            this.appToolbar.setButtonSaveEnable(false);
        }
        // Chỉnh sửa
        else{
            // Chưa duyệt
            if(this.inputModel.autH_STATUS != AuthStatusConsts.Approve){
                this.appToolbar.setButtonSaveEnable(false);
            }
            // Đã duyệt
            else{
                this.appToolbar.setButtonSaveEnable(false);
            }
        }

    // Button duyệt
        if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
            this.appToolbar.setButtonApproveEnable(false);
            this.appToolbar.setButtonSaveEnable(false);
        }
    }

    get disableInput(): boolean {
        return this.editPageState == EditPageState.viewDetail || this.inputModel.autH_STATUS == 'A';
    }

    _disableListR: boolean = false;
    get disableListR(): boolean {
        return this._disableListR;
    }

    onSaveAndLockListR(){
        this.onSave();
        this._disableListR = true;
        this.updateView();
    }
    onUnLockListR(){
        this._disableListR = false;
        this.updateView();
    }
//#endregion Status Page

//#region combobox and default filter

    // call in region constructor
    initDefaultFilter() {
        this.initCombobox();
        // set other filter here
    }
// begin combobox
// edit step 3: search
    initCombobox() {
        let filterCombobox = this.getFillterForCombobox();
        this.tlUserService.tL_USER_Search(filterCombobox).subscribe(response => {
            this._users = response.items;
            this._users= this._users.filter(x=>x.tlnanme!=this.appSession.user.userName);
            this.updateView();
        });
    }

// edit step 1: init variable
    //list user gốc
    _users: TL_USER_ENTITY[];

// edit step 2: handle event
// end combobox

//#endregion combobox and default filter

}
