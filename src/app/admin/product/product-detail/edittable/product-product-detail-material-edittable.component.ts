import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { ProductGroupDetailModalComponent } from "@app/admin/core/modal/module-product/product-group-detail-modal/product-group-detail-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PRODUCT_DETAIL_MATERIAL_EDITTABLE, PRODUCT_DETAIL_ENTITY } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'product-product-detail-material-edittable',
	templateUrl: './product-product-detail-material-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class ProductProductDetailMaterialEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
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

    _inputModel: PRODUCT_DETAIL_ENTITY;
    @Input() set inputModel(value: PRODUCT_DETAIL_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): PRODUCT_DETAIL_ENTITY {
        return this._inputModel;
    }

    _title: string;
    @Input() set title(value: string) {
        this._title = value;
    }
    get title(): string {
        return this._title;
    }
//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<PRODUCT_DETAIL_MATERIAL_EDITTABLE>;

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

    @ViewChild('popupModal') popupModal: ProductGroupDetailModalComponent;
    showPopup(): void {
		this.popupModal.show();
	}
	
	onSelectPopup(items: PRODUCT_DETAIL_MATERIAL_EDITTABLE[]): void {
		items.forEach(x => {
			var item = new PRODUCT_DETAIL_MATERIAL_EDITTABLE();
			item.mW_TYPE_ID = x.mW_TYPE_ID;
			item.mW_TYPE_CODE = x.mW_TYPE_CODE;
			item.mW_TYPE_NAME = x.mW_TYPE_NAME;
			this.editTable.allData.push(item);
		})

		this.editTable.resetNoAndPage();
		this.editTable.changePage(0);
		this.updateView();
	}
}