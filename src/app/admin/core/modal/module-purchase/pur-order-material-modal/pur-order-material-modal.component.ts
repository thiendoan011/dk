import { ViewEncapsulation, Injector, Component, Input, ViewChild } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { PUR_GROUP_PRODUCT_ENTITY, PUR_MATERIAL_ENTITY, PUR_PO_ENTITY, PUR_PRODUCT_DETAIL_ENTITY, PUR_PRODUCT_ENTITY, PUR_PRODUCT_GROUP_DETAIL_ENTITY, PUR_R_ENTITY, PurSearchServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { PURRModalComponent } from "../pur-r-modal/pur-r-modal.component";
import { PURPOModalComponent } from "../pur-po-modal/pur-po-modal.component";
import { PURGroupProductModalComponent } from "../pur-group-product-modal/pur-group-product-modal.component";
import { PURProductModalComponent } from "../pur-product-modal/pur-product-modal.component";
import { PURProductGroupDetailModalComponent } from "../pur-product-group-detail-modal/pur-product-group-detail-modal.component";
import { PURProductDetailModalComponent } from "../pur-product-detail-modal/pur-product-detail-modal.component";
import { PURMaterialModalComponent } from "../pur-material-modal/pur-material-modal.component";

@Component({
    selector: "pur-order-material-modal",
    templateUrl: "./pur-order-material-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PUROrderMaterialModalComponent extends PopupBaseComponent<PUR_MATERIAL_ENTITY> {
    constructor(injector: Injector,
        private purSearchService: PurSearchServiceProxy) {
        super(injector);
        this.filterInput = new PUR_MATERIAL_ENTITY();
        this.keyMember = 'id';
        this.pagingClient = true;

    }
    
    _title: string;
    @Input() set title(value: string) {
        this._title = value;
    }
    get title(): string {
        return this._title;
    }
    
    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        var result = await this.purSearchService.pUR_ORDER_MATERIAL_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading())).toPromise();

        if (checkAll) {
            this.selectedItems = result.items;
        }
        else {
            this.setRecords(result);
        }

        return result;
    }

//#region "Popup"
    // R
    @ViewChild('rModal') rModal: PURRModalComponent;
    showR(): void {
        // reset search
        this.rModal.dataTable.records = [];
        //require
        this.rModal.filterInput.puR_REQUISITION_ID = this.filterInput.puR_REQUISITION_ID;
        this.rModal.filterInput.puR_ORDER_ID = this.filterInput.puR_ORDER_ID;
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
        this.poModal.filterInput.puR_REQUISITION_ID = this.filterInput.puR_REQUISITION_ID;
        this.poModal.filterInput.puR_ORDER_ID = this.filterInput.puR_ORDER_ID;
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
        this.groupProductModal.filterInput.puR_REQUISITION_ID = this.filterInput.puR_REQUISITION_ID;
        this.groupProductModal.filterInput.puR_ORDER_ID = this.filterInput.puR_ORDER_ID;
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
        this.productModal.filterInput.puR_REQUISITION_ID = this.filterInput.puR_REQUISITION_ID;
        this.productModal.filterInput.puR_ORDER_ID = this.filterInput.puR_ORDER_ID;
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
        this.productGroupDetailModal.filterInput.puR_REQUISITION_ID = this.filterInput.puR_REQUISITION_ID;
        this.productGroupDetailModal.filterInput.puR_ORDER_ID = this.filterInput.puR_ORDER_ID;
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
        this.productDetailModal.filterInput.puR_REQUISITION_ID = this.filterInput.puR_REQUISITION_ID;
        this.productDetailModal.filterInput.puR_ORDER_ID = this.filterInput.puR_ORDER_ID;
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
        this.materialModal.filterInput.puR_REQUISITION_ID = this.filterInput.puR_REQUISITION_ID;
        this.materialModal.filterInput.puR_ORDER_ID = this.filterInput.puR_ORDER_ID;
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
        
        this.updateView();
    }
//#endregion "Popup"
}
