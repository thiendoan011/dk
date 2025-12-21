import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { PoPOModalComponent } from "@app/admin/core/modal/module-po/po-po-modal/po-po-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PO_DELAY_ENTITY, PO_ENTITY, PO_DELAY_DT_EDITTABLE } from "@shared/service-proxies/service-proxies";
import * as moment from "moment";

@Component({
    selector: 'po-delay-dt-edittable',
	templateUrl: './po-delay-dt-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class PODelayDTEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
    ) {
        super(injector);
    }

    _inputModel: PO_DELAY_ENTITY;
    @Input() set inputModel(value: PO_DELAY_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): PO_DELAY_ENTITY {
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

    @ViewChild('editTable') editTable: EditableTableComponent<PO_DELAY_DT_EDITTABLE>;

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
        this.popupModal.filterInput.pO_PROCESS = 'A';
        this.popupModal.filterInput.todate = moment().add(-1, 'd');
		this.popupModal.show();
	}
	
	onSelectPopup(items: PO_ENTITY[]): void {
		items.forEach(x => {
			var item = new PO_DELAY_DT_EDITTABLE();
			item.pO_ID = x.pO_ID;
			item.pO_CODE = x.pO_CODE;
			item.pO_NAME = x.pO_NAME;
			item.pO_CUSTOMER_DT = x.exporT_DATE;
			this.editTable.allData.push(item);
		})

		this.editTable.resetNoAndPage();
		this.editTable.changePage(0);
		this.updateView();
	}

    onChangePODelayDT(item: PO_DELAY_DT_EDITTABLE){
        item.notes = "move từ tuần " + item.pO_CUSTOMER_DT.week().toString() + " => tuần " + item.pO_EXPECTED_DT.week().toString();
        this.updateView();
    }
}