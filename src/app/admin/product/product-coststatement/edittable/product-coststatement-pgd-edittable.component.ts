import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { ProductGroupDetailModalComponent } from "@app/admin/core/modal/module-product/product-group-detail-modal/product-group-detail-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PRODUCT_COSTSTATEMENT_GROUP_DETAIL_ENTITY, PRODUCT_PRODUCT_ENTITY } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'product-coststatement-pgd-edittable',
	templateUrl: './product-coststatement-pgd-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class ProductCoststatementPGDEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
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

    _inputModel: PRODUCT_PRODUCT_ENTITY;
    @Input() set inputModel(value: PRODUCT_PRODUCT_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): PRODUCT_PRODUCT_ENTITY {
        return this._inputModel;
    }
//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<PRODUCT_COSTSTATEMENT_GROUP_DETAIL_ENTITY>;

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
        this.showPopup();
    }

    @Output() emit_remove_product_group_detail: EventEmitter<any> =   new EventEmitter();
    onRemove(): void {
        var deletetedItems = this.editTable.allData.filter((x) => x['isChecked']);
        this.emit_remove_product_group_detail.emit(deletetedItems);
        // xóa cụm chi tiết
        this.editTable.removeAllCheckedItem();
        this.updateView();
    }
    
    reload(){

    }

    @ViewChild('popupModal') popupModal: ProductGroupDetailModalComponent;
    @Output() emit_select_product_group_detail: EventEmitter<any> =   new EventEmitter();
    showPopup(): void {
		this.popupModal.show();
	}

    async onSelectPopup(items: PRODUCT_COSTSTATEMENT_GROUP_DETAIL_ENTITY[]){
        for await (const x of items) {
            // Nếu đã chọn cụm chi tiết rồi thì không cho chọn lại
            if(this.editTable.allData.filter(item => item.producT_GROUP_DETAIL_ID == x.producT_GROUP_DETAIL_ID).length > 0){
                this.showErrorMessage("Cụm chi tiết " + x.producT_GROUP_DETAIL_NAME + " đã được chọn trước đó");
            }
            else{
                var item                           = new PRODUCT_COSTSTATEMENT_GROUP_DETAIL_ENTITY();
                    item.producT_GROUP_DETAIL_ID   = x.producT_GROUP_DETAIL_ID;
                    item.producT_GROUP_DETAIL_CODE = x.producT_GROUP_DETAIL_CODE;
                    item.producT_GROUP_DETAIL_NAME = x.producT_GROUP_DETAIL_NAME;
                this.editTable.allData.push(item);

                // Thêm danh sách mô tả chi tiết vào lưới danh sách mô tả chi tiết
                this.emit_select_product_group_detail.emit(x.producT_GROUP_DETAIL_ID);
                
            }
        }
        
        this.editTable.resetNoAndPage();
        this.editTable.changePage(0);
        this.updateView();
    }
}