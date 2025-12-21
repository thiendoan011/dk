import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PO_ENTITY, PO_PRODUCT_OF_GROUP_PRODUCT_ENTITY } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'pp-product-of-po-edittable',
	templateUrl: './pp-product-of-po-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class PPPoductOfPOEditTableComponent extends DefaultComponentBase implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
    ) {
        super(injector);
        this._producted_part_code = this.getRouteParam('producted_part_code');
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

    _producted_part_code: string;
//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<PO_PRODUCT_OF_GROUP_PRODUCT_ENTITY>;

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
    onClickGroupProduct(item: PO_PRODUCT_OF_GROUP_PRODUCT_ENTITY){
        this.emit_select_row.emit(item);
    }

//#region Hyperlink
    onViewDetailGroupProduct(item: PO_PRODUCT_OF_GROUP_PRODUCT_ENTITY){
        window.open("/app/admin/po-group-product-view;id="+ item.grouP_PRODUCT_ID);
    }
    onViewDetailProduct(item: PO_PRODUCT_OF_GROUP_PRODUCT_ENTITY){
        window.open("/app/admin/product-product-view;id="+ item.producT_ID);
    }
//#endregion Hyperlink    
    
}