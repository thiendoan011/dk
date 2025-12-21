import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { R_GROUP_PRODUCT_DTO, PRODUCT_PRODUCT_ENTITY } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'r-group-product-edittable',
	templateUrl: './r-group-product-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class RGroupProductEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
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

    _inputModel: PRODUCT_PRODUCT_ENTITY;
    @Input() set inputModel(value: PRODUCT_PRODUCT_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): PRODUCT_PRODUCT_ENTITY {
        return this._inputModel;
    }
//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<R_GROUP_PRODUCT_DTO>;

    ngOnInit(): void {
        this.updateView();
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    refreshTable(){
        this.updateView();
    }

//#region Hyperlink
    onViewDetailPO(item){
        window.open("/app/admin/po-master-view;id="+ item.pO_ID);
    }
    onViewDetailGroupProduct(item){
        window.open("/app/admin/po-group-product-view;id="+ item.grouP_PRODUCT_ID);
    }
//#endregion Hyperlink    

}