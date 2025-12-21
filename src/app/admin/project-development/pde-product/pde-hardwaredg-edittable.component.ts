import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";

import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { PoHardwareDGModalComponent } from "@app/admin/core/modal/module-po/po-hardwaredg-modal/po-hardwaredg-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PO_HARDWAREDG_ENTITY } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'pde-hardwaredg-edittable',
	templateUrl: './pde-hardwaredg-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class PDEProductHardwareDGEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
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
//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<PO_HARDWAREDG_ENTITY>;

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
        this.showHardwareDG();
    }

    onRemove(): void {
        this.editTable.removeAllCheckedItem();
		this.updateView();
    }
    
    reload(){

    }

    @ViewChild('poHardwareDGModal') poHardwareDGModal: PoHardwareDGModalComponent;
    showHardwareDG(): void {
		this.poHardwareDGModal.show();
	}
	
	onSelectHardwareDG(items: PO_HARDWAREDG_ENTITY[]): void {
		items.forEach(x => {
			var item = new PO_HARDWAREDG_ENTITY();
			item.hardwaredG_ID = x.hardwaredG_ID;
			item.hardwaredG_CODE = x.hardwaredG_CODE;
			item.hardwaredG_NAME = x.hardwaredG_NAME;
			item.height = x.height;
			item.widtH1 = x.widtH1;
			item.widtH2 = x.widtH2;
			item.length = x.length;
			item.unit = x.unit;
			item.color = x.color;
			item.quantify = x.quantify;
			item.quantity = 0;
			this.editTable.allData.push(item);
		})

		this.editTable.resetNoAndPage();
		this.editTable.changePage(0);
		this.updateView();
	}
}