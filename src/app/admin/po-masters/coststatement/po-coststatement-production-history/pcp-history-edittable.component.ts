import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { GroupDetailOfProductModalComponent } from "@app/admin/core/modal/module-product/group-detail-of-product-modal/group-detail-of-product-modal-modal.component";
import { ProductDetailOfProductGroupDetailModalComponent } from "@app/admin/core/modal/module-product/product-detail-of-product-group-detail-modal/product-detail-of-product-group-detail-modal.component";
import { ProductOfGroupProductModalComponent } from "@app/admin/core/modal/module-product/product-of-group-product/product-of-group-product-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { EditPageState } from "@app/ultilities/enum/edit-page-state";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PO_COSTSTATEMENT_HISTORY_ENTITY, PO_COSTSTATEMENT_ENTITY, PO_PRODUCT_ENTITY, PRODUCT_DETAIL_ENTITY, PRODUCT_GROUP_DETAIL_ENTITY, PoCoststatementServiceProxy, PO_COSTSTATEMENT_HISTORY_DT_ENTITY } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'pcp-history-edittable',
	templateUrl: './pcp-history-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class PCPHistoryEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
    EditPageState = EditPageState;

    @ViewChild('editTable') editTable: PO_COSTSTATEMENT_HISTORY_DT_ENTITY[];

    constructor(
        injector: Injector,
        private poCoststatementService: PoCoststatementServiceProxy,
    ) {
        super(injector);
    }

    _type_upd: string = 'request';
    @Input() set type_upd(value: string) {
        this._type_upd = value;
    }
    get type_upd(): string {
        return this._type_upd;
    }
    

    _disableInput: boolean;
    @Input() set disableInput(value: boolean) {
        this._disableInput = value;
    }
    get disableInput(): boolean {
        return this._disableInput;
    }

    _inputModel: PO_COSTSTATEMENT_HISTORY_ENTITY;
    @Input() set inputModel(value: PO_COSTSTATEMENT_HISTORY_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): PO_COSTSTATEMENT_HISTORY_ENTITY {
        return this._inputModel;
    }

    _editPageState: EditPageState;
    @Input() set editPageState(value: EditPageState) {
        this._editPageState = value;
    }
    get editPageState(): EditPageState {
        return this._editPageState;
    }

    listProduct: PO_PRODUCT_ENTITY[];

    ngOnInit(): void {

        this.updateView();
        this.changeAccordionHeaderIcon();
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    onAddForRequest(){
        let datas = this.editTable;
        let data = new PO_COSTSTATEMENT_HISTORY_DT_ENTITY();
        data.makeR_ID = this.appSession.user.userName;
        data.makeR_NAME = this.appSession.user.name;
        datas.push(data);
        this.updateView();
    }

    onAddForResponse(){
        let datas = this.editTable;
        let data = new PO_COSTSTATEMENT_HISTORY_DT_ENTITY();
        data.makeR_ID = this.appSession.user.userName;
        data.makeR_NAME = this.appSession.user.name;
        datas.push(data);
        this.updateView();
    }
    
    reload(){
        this.editTable.forEach(x => {
            if(this.listProduct.filter(t => t.producT_ID == x.producT_ID).length == 0) {
                let product = new PO_PRODUCT_ENTITY();
                product.producT_ID = x.producT_ID;
                product.producT_NAME = x.producT_NAME;
                this.listProduct.push(product);
            }
        })
    }
//#region popup  
    curr_index: number = 0;
    // Sản phẩm
    @ViewChild('productModal') productModal: ProductOfGroupProductModalComponent;
    showProductModal(index: number): void {
        this.curr_index = index;
        this.productModal.group_product_id = this.inputModel.grouP_PRODUCT_ID;
        this.productModal.show();
        this.productModal.search();
    }
    onSelectProductModal(event: PO_PRODUCT_ENTITY): void {
        this.editTable[this.curr_index].producT_ID = event.producT_ID;
        this.editTable[this.curr_index].producT_CODE = event.producT_CODE;
        this.editTable[this.curr_index].producT_NAME = event.producT_NAME;
        this.updateView();
    }
    onViewDetailProduct(item: PRODUCT_GROUP_DETAIL_ENTITY){

    }

    // Cụm chi tiết
    @ViewChild('productGroupDetailModal') productGroupDetailModal: GroupDetailOfProductModalComponent;
    showProductGroupDetailModal(index: number): void {
        this.curr_index = index;
        this.productGroupDetailModal.filterInput.producT_ID = this.editTable[this.curr_index].producT_ID;
        this.productGroupDetailModal.show();
        this.productGroupDetailModal.search();
    }
    onSelectProductGroupDetailModal(event: PRODUCT_GROUP_DETAIL_ENTITY): void {
        this.editTable[this.curr_index].producT_GROUP_DETAIL_ID = event.producT_GROUP_DETAIL_ID;
        this.editTable[this.curr_index].producT_GROUP_DETAIL_CODE = event.producT_GROUP_DETAIL_CODE;
        this.editTable[this.curr_index].producT_GROUP_DETAIL_NAME = event.producT_GROUP_DETAIL_NAME;
        this.updateView();
    }
    onViewDetailProductGroupDetail(item: PRODUCT_GROUP_DETAIL_ENTITY){

    }

    // Mô tả chi tiết
    @ViewChild('productDetailModal') productDetailModal: ProductDetailOfProductGroupDetailModalComponent;
    showProductDetailModal(index: number): void {
        this.curr_index = index;
        this.productDetailModal.filterInput.producT_GROUP_DETAIL_ID = this.editTable[this.curr_index].producT_GROUP_DETAIL_ID;
        this.productDetailModal.show();
        this.productDetailModal.search();
    }
    onSelectProductDetailModal(event: PRODUCT_DETAIL_ENTITY): void {
        this.editTable[this.curr_index].producT_DETAIL_ID = event.producT_DETAIL_ID;
        this.editTable[this.curr_index].producT_DETAIL_CODE = event.producT_DETAIL_CODE;
        this.editTable[this.curr_index].producT_DETAIL_NAME = event.producT_DETAIL_NAME;
        this.updateView();
    }
    onViewDetailProductDetail(item: PRODUCT_DETAIL_ENTITY){

    }

//#endregion popup

}