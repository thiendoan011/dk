import { Component, Injector, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PUR_MATERIAL_ENTITY, PUR_ORDER_ENTITY, PUR_REQUISITION_ENTITY, PurOrderServiceProxy, PurSearchServiceProxy, TL_USER_ENTITY, TlUserServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { POHistory2ModalComponent } from '@app/admin/core/modal/module-po/po-history-2-modal/po-history-2-modal.component';
import { PURRequisitionModalComponent } from '@app/admin/core/modal/module-purchase/pur-requisition-modal/pur-requisition-modal.component';
import { PURReceiptEdittableComponent } from './edittable/pur-receipt-edittable.component';
import { PUROrderDetailEdittableComponent } from './edittable/pur-order-detail-edittable.component';
import { PURReceiptMultiEdittableComponent } from './edittable/pur-receipt-multi-edittable.component';

@Component({
    templateUrl: './pur-order-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PUROrderEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<PUR_ORDER_ENTITY> {
//#region constructor
    constructor(
        injector: Injector,
        private tlUserService: TlUserServiceProxy,
        private purOrderService: PurOrderServiceProxy,
        private purSearchService: PurSearchServiceProxy
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.puR_ORDER_ID = this.getRouteParam('id');
        this.initDefaultFilter();
    }

    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: PUR_ORDER_ENTITY = new PUR_ORDER_ENTITY();
    filterInput: PUR_ORDER_ENTITY;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.appToolbar.setRole('PUROrder', false, false, false, false, false, false, false, false);
                this.appToolbar.setEnableForViewDetailPage();

                this.inputModel.autH_STATUS = 'U'
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('PUROrder', false, false, false, false, false, false, false, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('PUROrder', false, false, false, false, false, false, true, false);
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
        this.navigatePassParam('/app/admin/pur-order', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.purOrderService.pUR_ORDER_ById(this.inputModel.puR_ORDER_ID).subscribe(response => {
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

        if(!this.inputModel.puR_ORDER_ID) {
            this.onAdd();
        } else {
            this.onUpdate();
        }
    }

    onAdd(): void {
        this.saving = true;
        this.purOrderService
        .pUR_ORDER_Ins(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.inputModel.puR_ORDER_ID = res['ID'];
                this.showSuccessMessage(res['ErrorDesc']);
                this.getDataPages();
                this.updateView();
            }
        })
    }

    onUpdate(): void {
        this.saving = true;
        this.purOrderService
        .pUR_ORDER_Upd(this.inputModel)
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

    onApprove(item: PUR_ORDER_ENTITY): void{
        this.message.confirm(
            this.l('ApproveWarningMessage', (this.inputModel.puR_ORDER_ID)),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.purOrderService
                    .pUR_ORDER_App(this.inputModel.puR_ORDER_ID)
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
//#endregion CRUD

//#region "EditTable"
    getDataEditTables(){
        // Danh sách vật tư
        this.inputModel.puR_ORDER_Details = this.purOrderDetailEdittable.editTable.allData;
        // Danh sách biên nhận
        this.inputModel.puR_Receipts = this.purReceiptEdittable.editTable.allData;
    }
    setDataEditTables(){
        // Danh sách vật tư
        if (this.inputModel.puR_ORDER_Details && this.inputModel.puR_ORDER_Details.length > 0) {
            this.purOrderDetailEdittable.editTable.setList(this.inputModel.puR_ORDER_Details);
            this.purOrderDetailEdittable.refreshTable();
        }
        // Danh sách biên nhận
        if (this.inputModel.puR_Receipts && this.inputModel.puR_Receipts.length > 0) {
            this.purReceiptEdittable.editTable.setList(this.inputModel.puR_Receipts);
            this.purReceiptEdittable.refreshTable();
        }
        // Import nhiều biên nhận
        this.purReceiptMultiEdittable.editTable.setList([]);
        this.purReceiptMultiEdittable.refreshTable();
    }

    // Danh sách vật tư
    @ViewChild('purOrderDetailEdittable') purOrderDetailEdittable: PUROrderDetailEdittableComponent;
    // Danh sách biên nhận
    @ViewChild('purReceiptEdittable') purReceiptEdittable: PURReceiptEdittableComponent;
    // Import nhiều biên nhận
    @ViewChild('purReceiptMultiEdittable') purReceiptMultiEdittable: PURReceiptMultiEdittableComponent;
    // lịch sử xử lý
    @ViewChild('history_modal') history_modal: POHistory2ModalComponent;

    onSearchReceiptMulti(item: PUR_MATERIAL_ENTITY){
        item.maxResultCount = -1
        this.saving = true;
        this.purSearchService
        .pUR_ORDER_MATERIAL_Search(item)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe((res) => {
            // Import nhiều biên nhận
            if (res.items && res.items.length > 0) {
                this.purReceiptMultiEdittable.editTable.setList(res.items);
                this.purReceiptMultiEdittable.refreshTable();
            }
            else{
                this.purReceiptMultiEdittable.editTable.setList([]);
                this.purReceiptMultiEdittable.refreshTable();
            }
        });
    }
    
//#endregion "EditTable"

//#region "Popup"
    //R
    // @ViewChild('purRequisitionModal') purRequisitionModal : PURRequisitionModalComponent;
    // showRequisitionModal(): void {
	// 	this.purRequisitionModal.show();
	// }
    // onSelectRequisition(event: PUR_REQUISITION_ENTITY): void {
	// 	if (event) {
	// 		this.inputModel.puR_REQUISITION_ID   = event.puR_REQUISITION_ID;
	// 		this.inputModel.puR_REQUISITION_CODE = event.puR_REQUISITION_CODE;
	// 		this.inputModel.puR_REQUISITION_NAME = event.puR_REQUISITION_NAME;
	// 		this.updateView();
	// 	}
	// }
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
        return !this.isNullOrEmpty(this.inputModel.puR_ORDER_ID);
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
