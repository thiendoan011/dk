import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PO_GROUP_PRODUCT_ENTITY, PO_PRODUCT_ENTITY } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'pde-product-template-edittable',
	templateUrl: './pde-product-template-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class PDEProductTemplateEditTableComponent extends DefaultComponentBase implements AfterViewInit {
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

    _inputModel: PO_GROUP_PRODUCT_ENTITY;
    @Input() set inputModel(value: PO_GROUP_PRODUCT_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): PO_GROUP_PRODUCT_ENTITY {
        return this._inputModel;
    }
//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<PO_PRODUCT_ENTITY>;

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
		this.updateView();
    }

    onRemove(): void {
		this.updateView();
    }
    
    reload(){

    }
	
	onSelectPopupAdd(items: PO_PRODUCT_ENTITY[]): void {
		this.updateView();
	}

//#region Hyperlink
    onViewDetailProduct(item: PO_PRODUCT_ENTITY){
        window.open("/app/admin/pde-product-view;id="+ item.producT_ID);
    }
//#endregion Hyperlink    
    
}