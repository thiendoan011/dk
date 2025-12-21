import { AfterViewInit, Component, EventEmitter, Injector, Input, Output, ViewChild } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { PURRequisitionRModalComponent } from "@app/admin/core/modal/module-purchase/pur-requisition-r-modal/pur-requisition-r-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { PUR_REQUISITION_ENTITY, PUR_REQUISITION_R_EDITTABLE } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'pur-requisition-r-edittable',
	templateUrl: './pur-requisition-r-edittable.component.html'
})

export class PURRequisitionREdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    _inputModel: PUR_REQUISITION_ENTITY;
    @Input() set inputModel(value: PUR_REQUISITION_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): PUR_REQUISITION_ENTITY {
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
    
    _disableUpdate: boolean;
    @Input() set disableUpdate(value: boolean) {
        this._disableUpdate = value;
    }
    get disableUpdate(): boolean {
        return this._disableUpdate;
    }
//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<PUR_REQUISITION_R_EDITTABLE>;

    ngOnInit(): void {
        this.updateView();
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    refreshTable(){
        this.updateView();
    }

    @Output() onUpdate: EventEmitter<any> = new EventEmitter();
    @Output() onSaveAndLocked: EventEmitter<any> = new EventEmitter();
    @Output() onUnLocked: EventEmitter<any> = new EventEmitter();
    onUpd(){
        this.onUpdate.emit();
    }
    onSaveAndLock(){
        this.onSaveAndLocked.emit();
    }
    onUnLock(){
        this.onUnLocked.emit();
    }

    onAdd(): void {
        this.showPopup();
    }

    onRemove(): void {
        this.editTable.removeAllCheckedItem();
		this.updateView();
    }

    @ViewChild('popupModal') popupModal: PURRequisitionRModalComponent;
    showPopup(): void {
		this.popupModal.show();
	}
	
	onSelectPopup(items: PUR_REQUISITION_R_EDITTABLE[]): void {
		items.forEach(x => {
			var item = new PUR_REQUISITION_R_EDITTABLE();
			item.r_ID = x.r_ID;
			item.r_CODE = x.r_CODE;
			item.r_NAME = x.r_NAME;
			item.warehousE_MATERIAL_STATUS = x.warehousE_MATERIAL_STATUS;
			item.warehousE_STRUCTURE_STATUS = x.warehousE_STRUCTURE_STATUS;
			item.warehousE_ASSEMBLY_STATUS = x.warehousE_ASSEMBLY_STATUS;
			item.warehousE_PAINT_STATUS = x.warehousE_PAINT_STATUS;
			this.editTable.allData.push(item);
		})

		this.editTable.resetNoAndPage();
		this.editTable.changePage(0);
		this.updateView();
	}

}