import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { PoHardwareVTModalComponent } from "@app/admin/core/modal/module-po/po-hardwarevt-modal/po-hardwarevt-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { CM_IMAGE_ENTITY, PO_HARDWAREVT_ENTITY } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'pde-hardwarevt-edittable',
	templateUrl: './pde-hardwarevt-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class PDEProductHardwareEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
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

    @ViewChild('editTable') editTable: EditableTableComponent<PO_HARDWAREVT_ENTITY>;

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
        this.showHardwareVT();
    }

    onRemove(): void {
        this.editTable.removeAllCheckedItem();
		this.updateView();
    }
    
    reload(){

    }

    @ViewChild('poHardwareVTModal') poHardwareVTModal: PoHardwareVTModalComponent;
    showHardwareVT(): void {
		this.poHardwareVTModal.show();
	}
	
	onSelectHardwareVT(items: PO_HARDWAREVT_ENTITY[]): void {
		items.forEach(x => {
			var item = new PO_HARDWAREVT_ENTITY();
			item.hardwarevT_ID = x.hardwarevT_ID;
			item.hardwarevT_CODE = x.hardwarevT_CODE;
			item.hardwarevT_NAME = x.hardwarevT_NAME;
			item.unit = x.unit;
			item.color = x.color;
			item.quantity = 0;
            item.hardwarevT_LENGTH = x.hardwarevT_LENGTH;
            item.hardwarevT_WIDTH = x.hardwarevT_WIDTH;
            item.hardwarevT_HEIGHT = x.hardwarevT_HEIGHT;
			this.editTable.allData.push(item);
		})

		this.editTable.resetNoAndPage();
		this.editTable.changePage(0);
		this.updateView();
	}
//#region Hyperlink
    onViewDetailHardwareVT(item: PO_HARDWAREVT_ENTITY){
        window.open("/app/admin/po-hardwareVT-view;id="+ item.hardwarevT_ID);
    }
//#endregion Hyperlink   
}