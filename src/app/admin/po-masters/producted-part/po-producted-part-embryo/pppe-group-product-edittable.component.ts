import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PO_ENTITY, PO_GROUP_PRODUCT_ENTITY } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'pppe-group-product-edittable',
	templateUrl: './pppe-group-product-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class PPPEGroupProductEditTableComponent extends DefaultComponentBase implements AfterViewInit {
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

    _inputModel: PO_ENTITY;
    @Input() set inputModel(value: PO_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): PO_ENTITY {
        return this._inputModel;
    }
//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<PO_GROUP_PRODUCT_ENTITY>;

    ngOnInit(): void {
        this.updateView();
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    refreshTable(){
        this.updateView();
    }

    @Output() emit_select_row: EventEmitter<any> =   new EventEmitter();
    onClickGroupProduct(item: PO_GROUP_PRODUCT_ENTITY){
        this.emit_select_row.emit(item);
    }

//#region Hyperlink
    onViewDetailGroupProduct(item: PO_GROUP_PRODUCT_ENTITY){
        window.open("/app/admin/po-group-product-view;id="+ item.grouP_PRODUCT_ID);
    }
//#endregion Hyperlink    
    
}