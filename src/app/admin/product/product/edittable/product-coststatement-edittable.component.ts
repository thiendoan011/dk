import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { ProductCoststatementModalComponent } from "@app/admin/core/modal/module-product/product-coststatement/product-coststatement-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PRODUCT_COSTSTATEMENT_ENTITY, PRODUCT_DETAIL_ENTITY, PRODUCT_PRODUCT_ENTITY } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'product-coststatement-edittable',
	templateUrl: './product-coststatement-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class ProductCoststatementEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
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

    @ViewChild('editTable') editTable: EditableTableComponent<PRODUCT_COSTSTATEMENT_ENTITY>;

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

    @ViewChild('popupModal') popupModal: ProductCoststatementModalComponent;
    showPopup(): void {
		this.popupModal.show();
	}
	
	onSelectPopup(items: PRODUCT_COSTSTATEMENT_ENTITY[]): void {
		items.forEach(x => {
			var item = new PRODUCT_COSTSTATEMENT_ENTITY();
			item.producT_COSTSTATEMENT_ID = x.producT_COSTSTATEMENT_ID;
			item.producT_COSTSTATEMENT_CODE = x.producT_COSTSTATEMENT_CODE;
			item.producT_COSTSTATEMENT_NAME = x.producT_COSTSTATEMENT_NAME;
			this.editTable.allData.push(item);
		})

		this.editTable.resetNoAndPage();
		this.editTable.changePage(0);
		this.updateView();
	}
}