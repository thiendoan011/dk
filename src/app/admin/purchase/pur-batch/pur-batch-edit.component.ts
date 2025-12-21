import { Component, Injector, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PUR_BATCH_DETAIL_EDITTABLE, PUR_BATCH_ENTITY, PUR_BATCH_ORDER_EDITTABLE, PUR_REQUISITION_ENTITY, PurBatchServiceProxy, TL_USER_ENTITY, TlUserServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { POHistory2ModalComponent } from '@app/admin/core/modal/module-po/po-history-2-modal/po-history-2-modal.component';
import { PURBatchDetailEdittableComponent } from './edittable/pur-batch-detail-edittable.component';
import { PURBatchOrderEdittableComponent } from './edittable/pur-batch-order-edittable.component';
import { PURRequisitionModalComponent } from '@app/admin/core/modal/module-purchase/pur-requisition-modal/pur-requisition-modal.component';

@Component({
    templateUrl: './pur-batch-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PURBatchEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<PUR_BATCH_ENTITY> {
//#region constructor
    constructor(
        injector: Injector,
        private tlUserService: TlUserServiceProxy,
        private purBatchService: PurBatchServiceProxy
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.puR_BATCH_ID = this.getRouteParam('id');
        this.initDefaultFilter();
    }

    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: PUR_BATCH_ENTITY = new PUR_BATCH_ENTITY();
    filterInput: PUR_BATCH_ENTITY;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.appToolbar.setRole('PURBatch', false, false, false, false, false, false, false, false);
                this.appToolbar.setEnableForViewDetailPage();

                this.inputModel.autH_STATUS = 'U'
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('PURBatch', false, false, false, false, false, false, false, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('PURBatch', false, false, false, false, false, false, true, false);
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
        this.navigatePassParam('/app/admin/pur-batch', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.purBatchService.pUR_BATCH_ById(this.inputModel.puR_BATCH_ID).subscribe(response => {
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

    saveInputAndCreateOrder(){
        this.inputModel.iS_UPD_BATCH_AND_CREATE_ORDER = "Y";
        this.saveInput();
    }

    onSave(): void {
        this.saveInput();
    }

    saveInput() {
        
        this.getDataEditTables();

        if(!this.inputModel.puR_BATCH_ID) {
            this.onAdd();
        } else {
            this.onUpdate();
        }
    }

    onAdd(): void {
        this.saving = true;
        this.purBatchService
        .pUR_BATCH_Ins(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.inputModel.puR_BATCH_ID = res['ID'];
                this.showSuccessMessage(res['ErrorDesc']);
                this.getDataPages();
                this.updateView();
            }
        })
    }

    onUpdate(): void {
        this.saving = true;
        this.purBatchService
        .pUR_BATCH_Upd(this.inputModel)
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

    onApprove(item: PUR_BATCH_ENTITY): void{
        this.message.confirm(
            this.l('ApproveWarningMessage', (this.inputModel.puR_BATCH_ID)),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.purBatchService
                    .pUR_BATCH_App(this.inputModel.puR_BATCH_ID)
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
        
        // this.getDataEditTables();

        // this.saving = true;
        // this.purBatchService
        // .pUR_BATCH_MATERIAL_Upd(this.inputModel)
        // .pipe(finalize(() => {this.saving = false}))
        // .subscribe((res) => {
        //     if (res['Result'] != '0') {
        //         this.showErrorMessage(res['ErrorDesc']);
        //         this.updateView();
        //     } else {
        //         this.updateSuccess();
        //         this.getDataPages();
        //         this.updateView();
        //     }
        // });
    }
//#endregion CRUD

//#region "EditTable"
    getDataEditTables(){
        // Danh sách vật tư mua
        this.inputModel.puR_BATCH_Details = this.purBatchDetailEdittable.editTable.allData;
        // Danh sách đơn hàng
        this.inputModel.puR_BATCH_ORDERs = this.purBatchOrderEdittable.editTable.allData;
    }
    setDataEditTables(){
        // Danh sách vật tư mua
        if (this.inputModel.puR_BATCH_Details && this.inputModel.puR_BATCH_Details.length > 0) {
            this.purBatchDetailEdittable.editTable.setList(this.inputModel.puR_BATCH_Details);
            this.purBatchDetailEdittable.refreshTable();
        }
        // Danh sách đơn hàng
        if (this.inputModel.puR_BATCH_ORDERs && this.inputModel.puR_BATCH_ORDERs.length > 0) {
            this.purBatchOrderEdittable.editTable.setList(this.inputModel.puR_BATCH_ORDERs);
            this.purBatchOrderEdittable.refreshTable();
        }
    }

    // Danh sách vật tư mua
    @ViewChild('purBatchDetailEdittable') purBatchDetailEdittable: PURBatchDetailEdittableComponent;
    // Danh sách đơn hàng
    @ViewChild('purBatchOrderEdittable') purBatchOrderEdittable: PURBatchOrderEdittableComponent;
    // lịch sử xử lý
    @ViewChild('history_modal') history_modal: POHistory2ModalComponent;

    // Phần emit từ Edittable
    onDeleteOrderOfBatch(item: PUR_BATCH_ORDER_EDITTABLE){
        this.message.confirm(
            this.l('Xác nhận xóa đơn hàng ' + item.puR_ORDER_ID),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    try {
                        this.saving = true;
                        this.purBatchService
                        .pUR_BATCH_ORDER_Del(item.puR_ORDER_ID)
                        .pipe(finalize(() => {this.saving = false}))
                        .subscribe((res) => {
                            if (res['Result'] != '0') {
                                this.showErrorMessage(res['ErrorDesc']);
                                this.updateView();
                            } 
                            else {
                                this.getDataPages();
                                this.showSuccessMessage(res['ErrorDesc']);
                                this.updateView();
                            }
                        });
                    } catch (error) {
                        this.saving = false;
                        this.showErrorMessage(error.toString());
                    }
                }
            }
        );
    }

    onDeleteOrderDetailOfBatch(item: PUR_BATCH_DETAIL_EDITTABLE){
        this.message.confirm(
            this.l('Xác nhận xóa vật tư ' + item.materiaL_CODE + ' của đơn hàng ' + item.puR_ORDER_ID),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    try {
                        this.saving = true;
                        this.purBatchService
                        .pUR_BATCH_ORDER_DETAIL_Del(item.puR_BATCH_DETAIL_ID)
                        .pipe(finalize(() => {this.saving = false}))
                        .subscribe((res) => {
                            if (res['Result'] != '0') {
                                this.showErrorMessage(res['ErrorDesc']);
                                this.updateView();
                            } 
                            else {
                                this.getDataPages();
                                this.showSuccessMessage(res['ErrorDesc']);
                                this.updateView();
                            }
                        });
                    } catch (error) {
                        this.saving = false;
                        this.showErrorMessage(error.toString());
                    }
                }
            }
        );
    }
    
//#endregion "EditTable"

//#region "Popup"
    //R
    @ViewChild('purRequisitionModal') purRequisitionModal : PURRequisitionModalComponent;
    showRequisitionModal(): void {
		this.purRequisitionModal.show();
	}
    onSelectRequisition(event: PUR_REQUISITION_ENTITY): void {
		if (event) {
			this.inputModel.puR_REQUISITION_ID   = event.puR_REQUISITION_ID;
			this.inputModel.puR_REQUISITION_CODE = event.puR_REQUISITION_CODE;
			this.inputModel.puR_REQUISITION_NAME = event.puR_REQUISITION_NAME;
			this.updateView();
		}
	}
//#endregion "Popup"

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

    get disableChance(): boolean {
        return !this.isNullOrEmpty(this.inputModel.puR_BATCH_ID);
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
