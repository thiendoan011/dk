import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { PoGroupProductOfPOModalComponent } from "@app/admin/core/modal/module-po/po-group-product-of-po-modal/po-group-product-of-po-modal.component";
import { ProductOfGroupProductModalComponent } from "@app/admin/core/modal/module-product/product-of-group-product/product-of-group-product-modal.component";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PO_GROUP_PRODUCT_ENTITY, PO_PRODUCT_PRODUCTED_PART_ENTITY, PRODUCT_PRODUCT_ENTITY, PoGroupProductServiceProxy, PoProductedPartDetailServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'product-producted-part-edittable',
	templateUrl: './product-producted-part-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class ProductProductedPartEditTableComponent extends DefaultComponentBase implements AfterViewInit {
//#region "Constructor"
    constructor(
        private poProductedPartDetailService: PoProductedPartDetailServiceProxy,
        injector: Injector,
    ) {
        super(injector);
    }

    @Input() showHeader: boolean = true;

    _disableInput: boolean;
    @Input() set disableInput(value: boolean) {
        this._disableInput = value;
    }
    get disableInput(): boolean {
        return this._disableInput;
    }

    _inputModel: PO_GROUP_PRODUCT_ENTITY;
    @Input() set inputModel(value: PO_GROUP_PRODUCT_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): PO_GROUP_PRODUCT_ENTITY {
        return this._inputModel;
    }

    _producted_part_code: string;
    @Input() set producted_part_code(value: string) {
        this._producted_part_code = value;
    }
    get producted_part_code(): string {
        return this._producted_part_code;
    }

    _producted_part_name: string;
    @Input() set producted_part_name(value: string) {
        this._producted_part_name = value;
    }
    get producted_part_name(): string {
        return this._producted_part_name;
    }

    record: PO_PRODUCT_PRODUCTED_PART_ENTITY = new PO_PRODUCT_PRODUCTED_PART_ENTITY();
//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<PO_PRODUCT_PRODUCTED_PART_ENTITY>;

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
        let datas = this.editTable.allData;
            let data = new PO_PRODUCT_PRODUCTED_PART_ENTITY();
            data.pO_ID = this.inputModel.pO_ID;
            data.producteD_PART_CODE = this._producted_part_code;
            data.producteD_PART_NAME = this._producted_part_name;
            datas.push(data);
            this.editTable.setList(datas);
            this.updateView();
    }

    onRemove(): void {
        this.editTable.removeAllCheckedItem();
		this.updateView();
    }

    @Output() edit_completed: EventEmitter<any> =   new EventEmitter();
    pO_PRODUCTED_PART_GROUP_PRODUCT_Edit(){
    }

    onAddProductLog(){
        this.record.pO_ID = this.inputModel.pO_ID;
        this.record.producteD_PART_CODE = this.producted_part_code;
        this.record.producteD_PART_NAME = this.producted_part_name;
        abp.ui.setBusy();
        this.poProductedPartDetailService
        .pO_PRODUCTED_PART_DETAIL_PRODUCT_LOG_Ins(this.record)
        .pipe(finalize(() => {abp.ui.clearBusy();}))
        .subscribe((res) => {

            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
            } else {
                this.showSuccessMessage('Thêm thành công!')
                this.record = new PO_PRODUCT_PRODUCTED_PART_ENTITY();
                this.record.quantitY_USE = 0;
                this.record.factory = "";
                this.edit_completed.emit();
    
                this.updateView();
            }
        });
    }

//#region popup
    // Hệ hàng 
    @ViewChild('poGroupProductOfPOModal') poGroupProductOfPOModal    : PoGroupProductOfPOModalComponent;
    showGroupProduct(): void {
        this.poGroupProductOfPOModal.filterInput.pO_ID = this.inputModel.pO_ID;
        this.poGroupProductOfPOModal.show();
        this.poGroupProductOfPOModal.search();
    }

    onSelectGroupProduct(item: PO_GROUP_PRODUCT_ENTITY){
        // dùng cho lưới
        // let currentItem = this.editTable.currentItem;
		// let dataCurrentItem = this.editTable.allData[this.editTable.allData.indexOf(currentItem)];

        // dataCurrentItem.grouP_PRODUCT_ID = item.grouP_PRODUCT_ID;
        // dataCurrentItem.grouP_PRODUCT_CODE = item.grouP_PRODUCT_CODE;


        this.record.grouP_PRODUCT_ID = item.grouP_PRODUCT_ID;
        this.record.grouP_PRODUCT_CODE = item.grouP_PRODUCT_CODE;
    }

    // Sản phẩm
    @ViewChild('productModal') productModal    : ProductOfGroupProductModalComponent;
    group_product_id: string = '';
    showProduct(item: PO_PRODUCT_PRODUCTED_PART_ENTITY): void {
        if(this.isNullOrEmpty(this.record.grouP_PRODUCT_ID)){
            this.showErrorMessage(this.l('Vui lòng chọn hệ hàng trước khi chọn sản phẩm'));
			this.updateView();
			return;
        }
        this.productModal.group_product_id = this.record.grouP_PRODUCT_ID;
        //this.productModal.filterInput.grouP_PRODUCT_ID = item.grouP_PRODUCT_ID;
        this.productModal.show();
        this.productModal.search();
    }

    onSelectProductModal(item: PRODUCT_PRODUCT_ENTITY){
        // dùng cho lưới
        // let currentItem = this.editTable.currentItem;
		// let dataCurrentItem = this.editTable.allData[this.editTable.allData.indexOf(currentItem)];

        // dataCurrentItem.producT_ID = item.producT_ID;
        // dataCurrentItem.producT_CODE = item.producT_CODE;
        // dataCurrentItem.producT_NAME = item.producT_NAME;

        this.record.producT_ID = item.producT_ID;
        this.record.producT_CODE = item.producT_CODE;
        this.record.producT_NAME = item.producT_NAME;

        abp.ui.setBusy();
        this.poProductedPartDetailService
			.pO_PRODUCTED_PART_DETAIL_GET_INFOR_Product(this.inputModel.pO_ID, this.record.grouP_PRODUCT_ID, this.record.producT_ID, this.producted_part_code)
			.pipe(
				finalize(() => {
					abp.ui.clearBusy();
				})
			)
			.subscribe((res) => {

				this.record.quantitY_TOTAL = res['QUANTITY_TOTAL'];
				this.record.quantitY_USED = res['QUANTITY_USED'];
				this.record.quantitY_REMAIN = res['QUANTITY_TOTAL'] - res['QUANTITY_USED'];

                this.updateView();
			});        
    }
//#endregion popup

//#region Hyperlink
    // Hệ hàng
    onViewDetailGroupProduct(item: PO_GROUP_PRODUCT_ENTITY){
        window.open("/app/admin/po-group-product-view;id="+ item.grouP_PRODUCT_ID);
    }

    // Sản phẩm
    onViewDetailProduct(item: PO_GROUP_PRODUCT_ENTITY){
        window.open("/app/admin/product-product-view;id="+ item.producT_ID);
    }
//#endregion Hyperlink    
    
}