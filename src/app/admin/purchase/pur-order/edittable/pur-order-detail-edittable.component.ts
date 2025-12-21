import { AfterViewInit, Component, EventEmitter, Injector, Input, Output, ViewChild } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { PUR_REQUISITION_ENTITY, PUR_ORDER_DETAIL_EDITTABLE } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'pur-order-detail-edittable',
	templateUrl: './pur-order-detail-edittable.component.html'
})

export class PUROrderDetailEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
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
//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<PUR_ORDER_DETAIL_EDITTABLE>;

    ngOnInit(): void {
        this.updateView();
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    refreshTable(){
        this.updateView();
    }
}