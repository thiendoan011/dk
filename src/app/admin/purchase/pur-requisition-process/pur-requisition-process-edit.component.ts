import { Component, Injector, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PUR_MATERIAL_ENTITY, PUR_REQUISITION_ENTITY, PurRequisitionProcessServiceProxy, PurSearchServiceProxy, TL_USER_ENTITY, TlUserServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { POHistory2ModalComponent } from '@app/admin/core/modal/module-po/po-history-2-modal/po-history-2-modal.component';
import { PURRequisitionREdittableComponent } from '../pur-requisition/edittable/pur-requisition-r-edittable.component';
import { PURRequisitionMaterialSummaryNotPurchaseEdittableComponent } from './edittable/pur-requisition-material-summary-not-purchase-edittable.component';
import { PURRequisitionMaterialSummaryPurchasingEdittableComponent } from './edittable/pur-requisition-material-summary-purchasing-edittable.component';
import { PURRequisitionMaterialSummaryPurchasedEdittableComponent } from './edittable/pur-requisition-material-summary-purchased-edittable.component';
import { PURInventoryReceiptMultiEdittableComponent } from './edittable/pur-inventory-receipt-multi-edittable.component';

@Component({
    templateUrl: './pur-requisition-process-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PURRequisitionProcessEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit {
//#region constructor
    constructor(
        injector: Injector,
        private tlUserService: TlUserServiceProxy,
        private purRequisitionProcessService: PurRequisitionProcessServiceProxy,
        private purSearchService: PurSearchServiceProxy
    ) {
        super(injector);
        this.inputModel.puR_REQUISITION_ID = this.getRouteParam('id');
        this.initDefaultFilter();
    }

    inputModel: PUR_REQUISITION_ENTITY = new PUR_REQUISITION_ENTITY();
    filterInput: PUR_REQUISITION_ENTITY;

    get disableInput(): boolean {
        return this.inputModel.procesS_STATUS == 'A';
    }

    ngOnInit(): void {
        this.getDataPages();
    }

    ngAfterViewInit(): void {
        this.updateView();
    }
//#endregion constructor

//#region CRUD    
    goBack() {
        this.navigatePassParam('/app/admin/pur-requisition-process', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.purRequisitionProcessService.pUR_REQUISITION_PRCOESS_ById(this.inputModel.puR_REQUISITION_ID).subscribe(response => {
            // set data
            if (!response) this.goBack()
            this.inputModel = response;

            this.setDataEditTables();
            // lịch sử xử lý
            this.history_modal.getDetail();

            this.updateView();
        });
    }

    onAccept(): void {
        this.saving = true;
        this.purRequisitionProcessService
        .pUR_REQUISITION_PROCESS_Accept(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe((res) => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.showSuccessMessage(res['ErrorDesc']);
                this.getDataPages();
                this.updateView();
            }
        });
    }

    onUpdateMaterialSummaryEdittable(type_material_summary_upd: string){
        this.getDataEditTables();
        this.saving = true;
        
        this.inputModel.typE_MATERIAL_SUMMARY_UPD = type_material_summary_upd;
        this.purRequisitionProcessService
        .pUR_REQUISITION_MATERIAL_SUMMARY_Upd(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe((res) => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.showSuccessMessage(res['ErrorDesc']);
                this.getDataPages();
                this.updateView();
            }
        });
    }
//#endregion CRUD

//#region "EditTable"
    getDataEditTables(){
        // Danh sách tổng hợp vật tư
        //this.inputModel.puR_REQUISITION_MATERIAL_Summaries = this.purRequisitionMaterialSummaryEdittable.editTable.allData;
        // Danh sách tổng hợp vật tư chưa mua
        this.inputModel.puR_REQUISITION_MATERIAL_SUMMARY_NOT_Purchases = this.purRequisitionMaterialSummaryNotPurchaseEdittable.editTable.allData;
        // Danh sách tổng hợp vật tư đang mua
        this.inputModel.puR_REQUISITION_MATERIAL_SUMMARY_Purchasing = this.purRequisitionMaterialSummaryPurchasingEdittable.editTable.allData;
        // Danh sách tổng hợp vật tư đã mua xong
        this.inputModel.puR_REQUISITION_MATERIAL_SUMMARY_Purchased = this.purRequisitionMaterialSummaryPurchasedEdittable.editTable.allData;
    }

    setDataEditTables(){
        // Danh sách lệnh sản xuất
        if (this.inputModel.puR_REQUISITION_Rs && this.inputModel.puR_REQUISITION_Rs.length > 0) {
            this.purRequisitionREdittable.editTable.setList(this.inputModel.puR_REQUISITION_Rs);
            this.purRequisitionREdittable.refreshTable();
        }
        // Danh sách tổng hợp vật tư
        // if (this.inputModel.puR_REQUISITION_MATERIAL_Summaries && this.inputModel.puR_REQUISITION_MATERIAL_Summaries.length > 0) {
        //     this.purRequisitionMaterialSummaryEdittable.editTable.setList(this.inputModel.puR_REQUISITION_MATERIAL_Summaries);
        //     this.purRequisitionMaterialSummaryEdittable.refreshTable();
        // }
        // Danh sách tổng hợp vật tư chưa mua
        if (this.inputModel.puR_REQUISITION_MATERIAL_SUMMARY_NOT_Purchases && this.inputModel.puR_REQUISITION_MATERIAL_SUMMARY_NOT_Purchases.length > 0) {
            this.purRequisitionMaterialSummaryNotPurchaseEdittable.editTable.setList(this.inputModel.puR_REQUISITION_MATERIAL_SUMMARY_NOT_Purchases);
            this.purRequisitionMaterialSummaryNotPurchaseEdittable.refreshTable();
        }
        // Danh sách tổng hợp vật tư đang mua
        if (this.inputModel.puR_REQUISITION_MATERIAL_SUMMARY_Purchasing && this.inputModel.puR_REQUISITION_MATERIAL_SUMMARY_Purchasing.length > 0) {
            this.purRequisitionMaterialSummaryPurchasingEdittable.editTable.setList(this.inputModel.puR_REQUISITION_MATERIAL_SUMMARY_Purchasing);
            this.purRequisitionMaterialSummaryPurchasingEdittable.refreshTable();
        }
        // Danh sách tổng hợp vật tư đã mua xong
        if (this.inputModel.puR_REQUISITION_MATERIAL_SUMMARY_Purchased && this.inputModel.puR_REQUISITION_MATERIAL_SUMMARY_Purchased.length > 0) {
            this.purRequisitionMaterialSummaryPurchasedEdittable.editTable.setList(this.inputModel.puR_REQUISITION_MATERIAL_SUMMARY_Purchased);
            this.purRequisitionMaterialSummaryPurchasedEdittable.refreshTable();
        }
        // Import nhiều biên nhận
        this.purInventoryReceiptMultiEdittable.editTable.setList([]);
        this.purInventoryReceiptMultiEdittable.refreshTable();
    }

    // Danh sách Lệnh sản xuất 
    @ViewChild('purRequisitionREdittable') purRequisitionREdittable: PURRequisitionREdittableComponent;
    // Danh sách tổng hợp vật tư 
    //@ViewChild('purRequisitionMaterialSummaryEdittable') purRequisitionMaterialSummaryEdittable: PURRequisitionMaterialSummaryEdittableComponent;
    // Danh sách tổng hợp vật tư chưa mua
    @ViewChild('purRequisitionMaterialSummaryNotPurchaseEdittable') purRequisitionMaterialSummaryNotPurchaseEdittable: PURRequisitionMaterialSummaryNotPurchaseEdittableComponent;
    // Danh sách tổng hợp vật tư đang mua
    @ViewChild('purRequisitionMaterialSummaryPurchasingEdittable') purRequisitionMaterialSummaryPurchasingEdittable: PURRequisitionMaterialSummaryPurchasingEdittableComponent;
    // Danh sách tổng hợp vật tư đã mua xong
    @ViewChild('purRequisitionMaterialSummaryPurchasedEdittable') purRequisitionMaterialSummaryPurchasedEdittable: PURRequisitionMaterialSummaryPurchasedEdittableComponent;
    // Import nhiều biên nhận
    @ViewChild('purInventoryReceiptMultiEdittable') purInventoryReceiptMultiEdittable: PURInventoryReceiptMultiEdittableComponent;
    // lịch sử xử lý
    @ViewChild('history_modal') history_modal: POHistory2ModalComponent;

    onSearchReceiptMulti(item: PUR_MATERIAL_ENTITY){
        item.maxResultCount = -1
        this.saving = true;
        this.purSearchService
        .pUR_RECEIPT_INVENTORY_MATERIAL_Search(item)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe((res) => {
            // Import nhiều biên nhận
            if (res.items && res.items.length > 0) {
                this.purInventoryReceiptMultiEdittable.editTable.setList(res.items);
                this.purInventoryReceiptMultiEdittable.refreshTable();
            }
            else{
                this.purInventoryReceiptMultiEdittable.editTable.setList([]);
                this.purInventoryReceiptMultiEdittable.refreshTable();
            }
        });
    }
    
//#endregion "EditTable"

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
