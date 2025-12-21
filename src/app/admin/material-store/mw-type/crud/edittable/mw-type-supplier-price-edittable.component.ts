import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { ProductDetailModalComponent } from "@app/admin/core/modal/module-product/product-detail/product-detail-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { MW_TYPE_ENTITY, CM_SUPPLIER_ENTITY, MW_TYPE_SUPPLIER_PRICE_ENTITY } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'mw-type-supplier-price-edittable',
	templateUrl: './mw-type-supplier-price-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class MWTypeSupplierPriceEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
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

    _inputModel: MW_TYPE_ENTITY;
    @Input() set inputModel(value: MW_TYPE_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): MW_TYPE_ENTITY {
        return this._inputModel;
    }
//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<MW_TYPE_SUPPLIER_PRICE_ENTITY>;

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
        //this.editTable.removeAllCheckedItem();
		this.updateView();
    }

    onSave(){
        
    }
    
    reload(){

    }

    @ViewChild('popupModal') popupModal: ProductDetailModalComponent;
    showPopup(): void {
		this.popupModal.show();
	}
	
	onSelectPopup(items: CM_SUPPLIER_ENTITY[]): void {
		items.forEach(x => {
			var item = new MW_TYPE_SUPPLIER_PRICE_ENTITY();
			item.suP_ID = x.suP_ID;
			item.suP_CODE = x.suP_CODE;
			item.suP_NAME = x.suP_NAME;
			this.editTable.allData.push(item);
		})

		this.editTable.resetNoAndPage();
		this.editTable.changePage(0);
		this.updateView();
	}
    onViewProductDetail(item){
        window.open("/app/admin/cm-supplier-view;id="+ item.suP_ID);
    }
}