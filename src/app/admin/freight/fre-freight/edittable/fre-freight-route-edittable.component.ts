import { AfterViewInit, Component, Injector, Input, ViewChild } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { FRE_FREIGHT_ENTITY, FRE_FREIGHT_ROUTE_ENTITY } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'fre-freight-route-edittable',
	templateUrl: './fre-freight-route-edittable.component.html'
})

export class FREFreightRouteEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
    ) {
        super(injector);
    }

    _title: string;
    @Input() set title(value: string) {
        this._title = value;
    }
    get title(): string {
        return this._title;
    }

    _inputModel: FRE_FREIGHT_ENTITY;
    @Input() set inputModel(value: FRE_FREIGHT_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): FRE_FREIGHT_ENTITY {
        return this._inputModel;
    }

    _disableInput: boolean;
    @Input() set disableInput(value: boolean) {
        this._disableInput = value;
    }
    get disableInput(): boolean {
        return this._disableInput;
    }
//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<FRE_FREIGHT_ROUTE_ENTITY>;

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