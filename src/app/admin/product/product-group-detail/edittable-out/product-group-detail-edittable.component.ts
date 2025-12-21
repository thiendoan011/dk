import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { ProductGroupDetailModalComponent } from "@app/admin/core/modal/module-product/product-group-detail-modal/product-group-detail-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PRODUCT_GROUP_DETAIL_EDITTABLE, PRODUCT_GROUP_DETAIL_ENTITY, PRODUCT_PRODUCT_ENTITY } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'product-group-detail-edittable',
	templateUrl: './product-group-detail-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class ProductGroupDetailEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
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

    _title: string;
    @Input() set title(value: string) {
        this._title = value;
    }
    get title(): string {
        return this._title;
    }
//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<PRODUCT_GROUP_DETAIL_EDITTABLE>;

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

    @ViewChild('popupModal') popupModal: ProductGroupDetailModalComponent;
    showPopup(): void {
		this.popupModal.show();
	}
	
	onSelectPopup(items: PRODUCT_GROUP_DETAIL_ENTITY[]): void {
		items.forEach(x => {
			var item = new PRODUCT_GROUP_DETAIL_EDITTABLE();
			item.producT_GROUP_DETAIL_ID = x.producT_GROUP_DETAIL_ID;
			item.producT_GROUP_DETAIL_CODE = x.producT_GROUP_DETAIL_CODE;
			item.producT_GROUP_DETAIL_NAME = x.producT_GROUP_DETAIL_NAME;
			this.editTable.allData.push(item);
		})

		this.editTable.resetNoAndPage();
		this.editTable.changePage(0);
		this.updateView();
	}

    onViewGroupProduct(item){
        window.open("/app/admin/product-group-detail-view;id="+ item.producT_GROUP_DETAIL_ID);
    }
}