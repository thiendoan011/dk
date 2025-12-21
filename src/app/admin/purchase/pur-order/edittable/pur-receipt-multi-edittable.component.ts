import { AfterViewInit, Component, EventEmitter, Injector, Input, Output, ViewChild } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { PURGroupProductModalComponent } from "@app/admin/core/modal/module-purchase/pur-group-product-modal/pur-group-product-modal.component";
import { PURMaterialModalComponent } from "@app/admin/core/modal/module-purchase/pur-material-modal/pur-material-modal.component";
import { PURMaterialSummaryModalComponent } from "@app/admin/core/modal/module-purchase/pur-material-summary-modal/pur-material-summary-modal.component";
import { PUROrderMaterialModalComponent } from "@app/admin/core/modal/module-purchase/pur-order-material-modal/pur-order-material-modal.component";
import { PURPOModalComponent } from "@app/admin/core/modal/module-purchase/pur-po-modal/pur-po-modal.component";
import { PURProductDetailModalComponent } from "@app/admin/core/modal/module-purchase/pur-product-detail-modal/pur-product-detail-modal.component";
import { PURProductGroupDetailModalComponent } from "@app/admin/core/modal/module-purchase/pur-product-group-detail-modal/pur-product-group-detail-modal.component";
import { PURProductModalComponent } from "@app/admin/core/modal/module-purchase/pur-product-modal/pur-product-modal.component";
import { PURRModalComponent } from "@app/admin/core/modal/module-purchase/pur-r-modal/pur-r-modal.component";
import { PURUnitPriceOfMaterialModalComponent } from "@app/admin/core/modal/module-purchase/pur-unit-price-of-material-modal/pur-unit-price-of-material-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { PUR_ORDER_ENTITY, PUR_RECEIPT_EDITTABLE, PUR_REQUISITION_MATERIAL_SUMMARY_EDITTABLE, MW_TYPE_SUPPLIER_PRICE_ENTITY, PUR_R_ENTITY, PUR_PO_ENTITY, PUR_GROUP_PRODUCT_ENTITY, PUR_PRODUCT_ENTITY, PUR_PRODUCT_GROUP_DETAIL_ENTITY, PUR_PRODUCT_DETAIL_ENTITY, PUR_MATERIAL_ENTITY, PurOrderServiceProxy, PUR_RECEIPT_MULTI_DTO } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'pur-receipt-multi-edittable',
	templateUrl: './pur-receipt-multi-edittable.component.html'
})

export class PURReceiptMultiEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
        private purOrderService: PurOrderServiceProxy
    ) {
        super(injector);
    }

    _inputModel: PUR_ORDER_ENTITY;
    @Input() set inputModel(value: PUR_ORDER_ENTITY) {
        this._inputModel = value;
        this.filterInput.puR_REQUISITION_ID = value.puR_REQUISITION_ID;
        this.filterInput.puR_BATCH_ID = value.puR_BATCH_ID;
        this.filterInput.puR_ORDER_ID = value.puR_ORDER_ID;
    }
    get inputModel(): PUR_ORDER_ENTITY {
        return this._inputModel;
    }

    _title: string;
    @Input() set title(value: string) {
        this._title = value;
    }
    get title(): string {
        return this._title;
    }

    _disableInput: boolean;
    @Input() set disableInput(value: boolean) {
        this._disableInput = value;
    }
    get disableInput(): boolean {
        return this._disableInput;
    }
//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<PUR_RECEIPT_EDITTABLE>;
    filterInput: PUR_MATERIAL_ENTITY = new PUR_MATERIAL_ENTITY();

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
    }

    onRemove(): void {
        this.editTable.removeAllCheckedItem();
		this.updateView();
    }

    @Output() onSearchReceiptMulti: EventEmitter<any> = new EventEmitter();
    onSearch(){
        this.onSearchReceiptMulti.emit(this.filterInput);
    }

    @Output() onUpdate: EventEmitter<any> = new EventEmitter();
    onUpd(){
        // set data
        let multiReceiptInput: PUR_RECEIPT_MULTI_DTO = new PUR_RECEIPT_MULTI_DTO();
        multiReceiptInput.puR_REQUISITION_ID = this.filterInput.puR_REQUISITION_ID;
        multiReceiptInput.puR_BATCH_ID = this.filterInput.puR_BATCH_ID;
        multiReceiptInput.puR_ORDER_ID = this.filterInput.puR_ORDER_ID;
        multiReceiptInput.materiaL_ID = this.filterInput.materiaL_ID;
        multiReceiptInput.totaL_QUANTITY = this.filterInput.quantity;
        multiReceiptInput.uniT_PRICE = this.filterInput.uniT_PRICE;
        multiReceiptInput.updatE_DT = this.filterInput.updatE_DT;
        multiReceiptInput.puR_MULTI_Receipts = this.editTable.allData;

        abp.ui.setBusy();
        this.purOrderService
        .pUR_RECEIPT_MULTI_Ins(multiReceiptInput)
        .pipe(finalize(() => {abp.ui.clearBusy()}))
        .subscribe((res) => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.showSuccessMessage(res['ErrorDesc']);
                this.onUpdate.emit();
            }
        });
    }

//#region "Popup"
    // R
    @ViewChild('rModal') rModal: PURRModalComponent;
    showR(): void {
        // reset search
        this.rModal.dataTable.records = [];
        //require
        this.rModal.filterInput.puR_REQUISITION_ID = this.inputModel.puR_REQUISITION_ID;
        this.rModal.filterInput.puR_ORDER_ID = this.inputModel.puR_ORDER_ID;
        //filter
        //search
        this.rModal.show();
        this.rModal.search(true);
    }

    onSelectR(event: PUR_R_ENTITY){
        if(!this.isNullOrEmpty(this.filterInput.r_ID) && event.r_ID != this.filterInput.r_ID){
            this.filterInput.pO_ID = '';
            this.filterInput.pO_CODE = '';
            this.filterInput.grouP_PRODUCT_ID = '';
            this.filterInput.grouP_PRODUCT_CODE = '';
            this.filterInput.producT_ID = '';
            this.filterInput.producT_CODE = '';
            this.filterInput.producT_GROUP_DETAIL_ID = '';
            this.filterInput.producT_GROUP_DETAIL_CODE = '';
            this.filterInput.producT_DETAIL_ID = '';
            this.filterInput.producT_DETAIL_CODE = '';
            this.filterInput.materiaL_ID = '';
            this.filterInput.materiaL_CODE = '';
            this.filterInput.uniT_PRICE = 0;

            this.filterInput.r_ID = event.r_ID;
            this.filterInput.r_CODE = event.r_CODE;
            this.updateView();
        }
        else{
            this.filterInput.r_ID = event.r_ID;
            this.filterInput.r_CODE = event.r_CODE;
            this.updateView();
        }
    }
    // PO
    @ViewChild('poModal') poModal: PURPOModalComponent;
    showPO(): void {
        // reset search
        this.poModal.dataTable.records = [];
        //require
        this.poModal.filterInput.puR_REQUISITION_ID = this.inputModel.puR_REQUISITION_ID;
        this.poModal.filterInput.puR_ORDER_ID = this.inputModel.puR_ORDER_ID;
        //filter param
        this.poModal.filterInput.r_ID = this.filterInput.r_ID;
        this.poModal.filterInput.r_CODE = this.filterInput.r_CODE;
        //filter display
        //search
        this.poModal.show();
        this.poModal.search(true);
    }

    onSelectPO(event: PUR_PO_ENTITY){
        if(!this.isNullOrEmpty(this.filterInput.pO_ID) && event.pO_ID != this.filterInput.pO_ID){
            this.filterInput.grouP_PRODUCT_ID = '';
            this.filterInput.grouP_PRODUCT_CODE = '';
            this.filterInput.producT_ID = '';
            this.filterInput.producT_CODE = '';
            this.filterInput.producT_GROUP_DETAIL_ID = '';
            this.filterInput.producT_GROUP_DETAIL_CODE = '';
            this.filterInput.producT_DETAIL_ID = '';
            this.filterInput.producT_DETAIL_CODE = '';
            this.filterInput.materiaL_ID = '';
            this.filterInput.materiaL_CODE = '';
            this.filterInput.uniT_PRICE = 0;
            this.updateView();
        }
        else{
            this.filterInput.pO_ID = event.pO_ID;
            this.filterInput.pO_CODE = event.pO_CODE;
            this.updateView();
        }
    }
    // Hệ hàng
    @ViewChild('groupProductModal') groupProductModal: PURGroupProductModalComponent;
    showGroupProduct(): void {
        // reset search
        this.groupProductModal.dataTable.records = [];
        //require
        this.groupProductModal.filterInput.puR_REQUISITION_ID = this.inputModel.puR_REQUISITION_ID;
        this.groupProductModal.filterInput.puR_ORDER_ID = this.inputModel.puR_ORDER_ID;
        //filter param
        this.groupProductModal.filterInput.r_ID = this.filterInput.r_ID;
        this.groupProductModal.filterInput.pO_ID = this.filterInput.pO_ID;
        //filter display
        this.groupProductModal.filterInput.r_CODE = this.filterInput.r_CODE;
        this.groupProductModal.filterInput.pO_CODE = this.filterInput.pO_CODE;
        //search
        this.groupProductModal.show();
        this.groupProductModal.search(true);
    }

    onSelectGroupProduct(event: PUR_GROUP_PRODUCT_ENTITY){
        if(!this.isNullOrEmpty(this.filterInput.grouP_PRODUCT_ID) && event.grouP_PRODUCT_ID != this.filterInput.grouP_PRODUCT_ID){
            this.filterInput.producT_ID = '';
            this.filterInput.producT_CODE = '';
            this.filterInput.producT_GROUP_DETAIL_ID = '';
            this.filterInput.producT_GROUP_DETAIL_CODE = '';
            this.filterInput.producT_DETAIL_ID = '';
            this.filterInput.producT_DETAIL_CODE = '';
            this.filterInput.materiaL_ID = '';
            this.filterInput.materiaL_CODE = '';
            this.filterInput.uniT_PRICE = 0;
            this.updateView();
        }
        else{
            this.filterInput.grouP_PRODUCT_ID = event.grouP_PRODUCT_ID;
            this.filterInput.grouP_PRODUCT_CODE = event.grouP_PRODUCT_CODE;
            this.updateView();
        }
    }
    // Sản phẩm
    @ViewChild('productModal') productModal: PURProductModalComponent;
    showProduct(): void {
        // reset search
        this.productModal.dataTable.records = [];
        //require
        this.productModal.filterInput.puR_REQUISITION_ID = this.inputModel.puR_REQUISITION_ID;
        this.productModal.filterInput.puR_ORDER_ID = this.inputModel.puR_ORDER_ID;
        //filter param
        this.productModal.filterInput.r_ID = this.filterInput.r_ID;
        this.productModal.filterInput.pO_ID = this.filterInput.pO_ID;
        this.productModal.filterInput.grouP_PRODUCT_ID = this.filterInput.grouP_PRODUCT_ID;
        //filter display
        this.productModal.filterInput.r_CODE = this.filterInput.r_CODE;
        this.productModal.filterInput.pO_CODE = this.filterInput.pO_CODE;
        this.productModal.filterInput.grouP_PRODUCT_CODE = this.filterInput.grouP_PRODUCT_CODE;
        //search
        this.productModal.show();
        this.productModal.search(true);
    }

    onSelectProduct(event: PUR_PRODUCT_ENTITY){
        if(!this.isNullOrEmpty(this.filterInput.producT_ID) && event.producT_ID != this.filterInput.producT_ID){
            this.filterInput.producT_GROUP_DETAIL_ID = '';
            this.filterInput.producT_GROUP_DETAIL_CODE = '';
            this.filterInput.producT_DETAIL_ID = '';
            this.filterInput.producT_DETAIL_CODE = '';
            this.filterInput.materiaL_ID = '';
            this.filterInput.materiaL_CODE = '';
            this.filterInput.uniT_PRICE = 0;
            this.updateView();
        }
        else{
            this.filterInput.producT_ID = event.producT_ID;
            this.filterInput.producT_CODE = event.producT_CODE;
            this.updateView();
        }
    }
    // Cụm chi tiết
    @ViewChild('productGroupDetailModal') productGroupDetailModal: PURProductGroupDetailModalComponent;
    showProductGroupDetail(): void {
        // reset search
        this.productGroupDetailModal.dataTable.records = [];
        //require
        this.productGroupDetailModal.filterInput.puR_REQUISITION_ID = this.inputModel.puR_REQUISITION_ID;
        this.productGroupDetailModal.filterInput.puR_ORDER_ID = this.inputModel.puR_ORDER_ID;
        //filter param
        this.productGroupDetailModal.filterInput.r_ID = this.filterInput.r_ID;
        this.productGroupDetailModal.filterInput.pO_ID = this.filterInput.pO_ID;
        this.productGroupDetailModal.filterInput.grouP_PRODUCT_ID = this.filterInput.grouP_PRODUCT_ID;
        this.productGroupDetailModal.filterInput.producT_ID = this.filterInput.producT_ID;
        //filter display
        this.productGroupDetailModal.filterInput.r_CODE = this.filterInput.r_CODE;
        this.productGroupDetailModal.filterInput.pO_CODE = this.filterInput.pO_CODE;
        this.productGroupDetailModal.filterInput.grouP_PRODUCT_CODE = this.filterInput.grouP_PRODUCT_CODE;
        this.productGroupDetailModal.filterInput.producT_CODE = this.filterInput.producT_CODE;
        //search
        this.productGroupDetailModal.show();
        this.productGroupDetailModal.search(true);
    }

    onSelectProductGroupDetail(event: PUR_PRODUCT_GROUP_DETAIL_ENTITY){
        if(!this.isNullOrEmpty(this.filterInput.producT_GROUP_DETAIL_ID) && event.producT_GROUP_DETAIL_ID != this.filterInput.producT_GROUP_DETAIL_ID){
            this.filterInput.producT_DETAIL_ID = '';
            this.filterInput.producT_DETAIL_CODE = '';
            this.filterInput.materiaL_ID = '';
            this.filterInput.materiaL_CODE = '';
            this.filterInput.uniT_PRICE = 0;
            this.updateView();
        }
        else{
            this.filterInput.producT_GROUP_DETAIL_ID = event.producT_GROUP_DETAIL_ID;
            this.filterInput.producT_GROUP_DETAIL_CODE = event.producT_GROUP_DETAIL_CODE;
            this.updateView();
        }
    }
    // Mô tả chi tiết
    @ViewChild('productDetailModal') productDetailModal: PURProductDetailModalComponent;
    showProductDetail(): void {
        // reset search
        this.productDetailModal.dataTable.records = [];
        //require
        this.productDetailModal.filterInput.puR_REQUISITION_ID = this.inputModel.puR_REQUISITION_ID;
        this.productDetailModal.filterInput.puR_ORDER_ID = this.inputModel.puR_ORDER_ID;
        //filter param
        this.productDetailModal.filterInput.r_ID = this.filterInput.r_ID;
        this.productDetailModal.filterInput.pO_ID = this.filterInput.pO_ID;
        this.productDetailModal.filterInput.grouP_PRODUCT_ID = this.filterInput.grouP_PRODUCT_ID;
        this.productDetailModal.filterInput.producT_ID = this.filterInput.producT_ID;
        this.productDetailModal.filterInput.producT_GROUP_DETAIL_ID = this.filterInput.producT_GROUP_DETAIL_ID;
        //filter display
        this.productDetailModal.filterInput.r_CODE = this.filterInput.r_CODE;
        this.productDetailModal.filterInput.pO_CODE = this.filterInput.pO_CODE;
        this.productDetailModal.filterInput.grouP_PRODUCT_CODE = this.filterInput.grouP_PRODUCT_CODE;
        this.productDetailModal.filterInput.producT_CODE = this.filterInput.producT_CODE;
        this.productDetailModal.filterInput.producT_GROUP_DETAIL_CODE = this.filterInput.producT_GROUP_DETAIL_CODE;
        //search
        this.productDetailModal.show();
        this.productDetailModal.search(true);
    }

    onSelectProductDetail(event: PUR_PRODUCT_DETAIL_ENTITY){
        if(!this.isNullOrEmpty(this.filterInput.producT_DETAIL_ID) && event.producT_DETAIL_ID != this.filterInput.producT_DETAIL_ID){
            this.filterInput.materiaL_ID = '';
            this.filterInput.materiaL_CODE = '';
            this.filterInput.uniT_PRICE = 0;
            this.updateView();
        }
        else{
            this.filterInput.producT_DETAIL_ID = event.producT_DETAIL_ID;
            this.filterInput.producT_DETAIL_CODE = event.producT_DETAIL_CODE;
            this.updateView();
        }
    }
    // Vật tư
    @ViewChild('materialModal') materialModal: PURMaterialModalComponent;
    showMaterial(): void {
        // reset search
        this.materialModal.dataTable.records = [];
        //require
        this.materialModal.filterInput.puR_REQUISITION_ID = this.inputModel.puR_REQUISITION_ID;
        this.materialModal.filterInput.puR_ORDER_ID = this.inputModel.puR_ORDER_ID;
        //filter param
        this.materialModal.filterInput.r_ID = this.filterInput.r_ID;
        this.materialModal.filterInput.pO_ID = this.filterInput.pO_ID;
        this.materialModal.filterInput.grouP_PRODUCT_ID = this.filterInput.grouP_PRODUCT_ID;
        this.materialModal.filterInput.producT_ID = this.filterInput.producT_ID;
        this.materialModal.filterInput.producT_GROUP_DETAIL_ID = this.filterInput.producT_GROUP_DETAIL_ID;
        this.materialModal.filterInput.producT_DETAIL_ID = this.filterInput.producT_DETAIL_ID;
        //filter display
        this.materialModal.filterInput.r_CODE = this.filterInput.r_CODE;
        this.materialModal.filterInput.pO_CODE = this.filterInput.pO_CODE;
        this.materialModal.filterInput.grouP_PRODUCT_CODE = this.filterInput.grouP_PRODUCT_CODE;
        this.materialModal.filterInput.producT_CODE = this.filterInput.producT_CODE;
        this.materialModal.filterInput.producT_GROUP_DETAIL_CODE = this.filterInput.producT_GROUP_DETAIL_CODE;
        this.materialModal.filterInput.producT_DETAIL_CODE = this.filterInput.producT_DETAIL_CODE;
        //search
        this.materialModal.show();
        this.materialModal.search(true);
    }

    onSelectMaterial(event: PUR_MATERIAL_ENTITY){
        this.filterInput.materiaL_ID = event.materiaL_ID;
        this.filterInput.materiaL_CODE = event.materiaL_CODE;
        this.filterInput.uniT_PRICE = 0;
        this.editTable.setList([]);
        this.updateView();
    }

    // Đơn giá
    @ViewChild('unitPriceOfMaterialModal') unitPriceOfMaterialModal: PURUnitPriceOfMaterialModalComponent;
    showUnitPriceOfMaterial(): void {
        // reset search
        this.unitPriceOfMaterialModal.dataTable.records = [];
        //require
        this.unitPriceOfMaterialModal.filterInput.puR_REQUISITION_ID = this.inputModel.puR_REQUISITION_ID;
        this.unitPriceOfMaterialModal.filterInput.puR_ORDER_ID = this.inputModel.puR_ORDER_ID;
        //filter param
        this.unitPriceOfMaterialModal.filterInput.r_ID = this.filterInput.r_ID;
        this.unitPriceOfMaterialModal.filterInput.pO_ID = this.filterInput.pO_ID;
        this.unitPriceOfMaterialModal.filterInput.grouP_PRODUCT_ID = this.filterInput.grouP_PRODUCT_ID;
        this.unitPriceOfMaterialModal.filterInput.producT_ID = this.filterInput.producT_ID;
        this.unitPriceOfMaterialModal.filterInput.producT_GROUP_DETAIL_ID = this.filterInput.producT_GROUP_DETAIL_ID;
        this.unitPriceOfMaterialModal.filterInput.producT_DETAIL_ID = this.filterInput.producT_DETAIL_ID;
        this.unitPriceOfMaterialModal.filterInput.materiaL_ID = this.filterInput.materiaL_ID;
        //filter display
        this.unitPriceOfMaterialModal.filterInput.r_CODE = this.filterInput.r_CODE;
        this.unitPriceOfMaterialModal.filterInput.pO_CODE = this.filterInput.pO_CODE;
        this.unitPriceOfMaterialModal.filterInput.grouP_PRODUCT_CODE = this.filterInput.grouP_PRODUCT_CODE;
        this.unitPriceOfMaterialModal.filterInput.producT_CODE = this.filterInput.producT_CODE;
        this.unitPriceOfMaterialModal.filterInput.producT_GROUP_DETAIL_CODE = this.filterInput.producT_GROUP_DETAIL_CODE;
        this.unitPriceOfMaterialModal.filterInput.producT_DETAIL_CODE = this.filterInput.producT_DETAIL_CODE;
        this.unitPriceOfMaterialModal.filterInput.materiaL_CODE = this.filterInput.materiaL_CODE;
        //search
        this.unitPriceOfMaterialModal.show();
        this.unitPriceOfMaterialModal.search(true);
    }

    onSelectUnitPriceOfMaterial(event: PUR_MATERIAL_ENTITY){
        this.filterInput.uniT_PRICE = event.uniT_PRICE;
        this.updateView();
    }

    onResetSearch(){
        this.filterInput.r_ID = '';
        this.filterInput.r_CODE = '';
        this.filterInput.pO_ID = '';
        this.filterInput.pO_CODE = '';
        this.filterInput.grouP_PRODUCT_ID = '';
        this.filterInput.grouP_PRODUCT_CODE = '';
        this.filterInput.producT_ID = '';
        this.filterInput.producT_CODE = '';
        this.filterInput.producT_GROUP_DETAIL_ID = '';
        this.filterInput.producT_GROUP_DETAIL_CODE = '';
        this.filterInput.producT_DETAIL_ID = '';
        this.filterInput.producT_DETAIL_CODE = '';
        this.filterInput.materiaL_ID = '';
        this.filterInput.materiaL_CODE = '';
        this.filterInput.uniT_PRICE = 0;
        
        this.updateView();
    }
//#endregion "Popup"

}