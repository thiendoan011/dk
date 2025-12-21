import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { ProductDetailModalComponent } from "@app/admin/core/modal/module-product/product-detail/product-detail-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PRODUCT_DETAIL_ENTITY, PRODUCT_GROUP_DETAIL_ENTITY } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'product-coststatement-pd-edittable',
	templateUrl: './product-coststatement-pd-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class ProductCoststatementPDEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
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

    _inputModel: PRODUCT_GROUP_DETAIL_ENTITY;
    @Input() set inputModel(value: PRODUCT_GROUP_DETAIL_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): PRODUCT_GROUP_DETAIL_ENTITY {
        return this._inputModel;
    }
//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<PRODUCT_DETAIL_ENTITY>;

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

    onRemove(): void {
        this.editTable.removeAllCheckedItem();
		this.updateView();
    }
    
    reload(){

    }

    @ViewChild('popupModal') popupModal: ProductDetailModalComponent;
    showPopup(): void {
		this.popupModal.show();
	}
	
	onSelectPopup(items: PRODUCT_DETAIL_ENTITY[]): void {
		items.forEach(x => {
			var item = new PRODUCT_DETAIL_ENTITY();
			item.producT_DETAIL_ID = x.producT_DETAIL_ID;
			item.producT_DETAIL_CODE = x.producT_DETAIL_CODE;
			item.producT_DETAIL_NAME = x.producT_DETAIL_NAME;
			this.editTable.allData.push(item);
		})

		this.editTable.resetNoAndPage();
		this.editTable.changePage(0);
		this.updateView();
	}
}