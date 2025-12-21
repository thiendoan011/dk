import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PRODUCT_PRODUCT_ENTITY, PO_PURCHASE_ENTITY } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'r-order-edittable',
	templateUrl: './r-order-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class ROrderEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
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

    _title: string = '';
    @Input() set title(value: string) {
        this._title = value;
    }
    get title(): string {
        return this._title;
    }
//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<PO_PURCHASE_ENTITY>;

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
    onViewDetailPurchase(item){
        window.open("/app/admin/po-purchase-view;id="+ item.purchasE_ID);
    }
//#endregion Hyperlink    

}