import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { PoPOModalComponent } from "@app/admin/core/modal/module-po/po-po-modal/po-po-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { GROUP_R_ENTITY, GROUP_R_GROUP_PRODUCT_EDITTABLE, PO_ENTITY } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'group-r-group-product-edittable',
	templateUrl: './group-r-group-product-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class GroupRGroupProductEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
    ) {
        super(injector);
    }

    _inputModel: GROUP_R_ENTITY;
    @Input() set inputModel(value: GROUP_R_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): GROUP_R_ENTITY {
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

    @ViewChild('editTable') editTable: EditableTableComponent<GROUP_R_GROUP_PRODUCT_EDITTABLE>;

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

    @ViewChild('popupModal') popupModal: PoPOModalComponent;
    showPopup(): void {
		this.popupModal.show();
	}
	
	onSelectPopup(items: PO_ENTITY[]): void {
		items.forEach(x => {
			var item = new GROUP_R_GROUP_PRODUCT_EDITTABLE();
			item.pO_ID = x.pO_ID;
			item.pO_CODE = x.pO_CODE;
			item.pO_NAME = x.pO_NAME;
			this.editTable.allData.push(item);
		})

		this.editTable.resetNoAndPage();
		this.editTable.changePage(0);
		this.updateView();
	}

    onViewDetailPO(item: GROUP_R_GROUP_PRODUCT_EDITTABLE){
        window.open("/app/admin/po-master-view;id="+ item.pO_ID);
    }
}