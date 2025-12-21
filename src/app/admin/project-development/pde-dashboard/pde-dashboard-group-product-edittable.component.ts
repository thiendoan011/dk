import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import { AppConsts } from "@shared/AppConsts";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PDEDashboardServiceProxy, PDEGroupProductServiceProxy, PDE_REQ_GROUP_PRODUCT_ENTITY, PO_GROUP_PRODUCT_ENTITY, PO_PRODUCT_ENTITY } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'pde-dashboard-group-product-edittable',
	templateUrl: './pde-dashboard-group-product-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class PDEDashboardGroupProductEditTableComponent extends DefaultComponentBase implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
        private pdeDashboardService: PDEDashboardServiceProxy
    ) {
        super(injector);
        this.remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;
    }

    remoteServiceBaseUrl: string;

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

    _title: string;
    @Input() set title(value: string) {
        this._title = value;
    }
    get title(): string {
        return this._title;
    }

    _filterInput: PO_GROUP_PRODUCT_ENTITY = new PO_GROUP_PRODUCT_ENTITY();

//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<PDE_REQ_GROUP_PRODUCT_ENTITY>;

    ngOnInit(): void {
        this.updateView();
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    refreshTable(){
        this.updateView();
    }

    PDE_REQ_OF_GROUP_PRODUCT_Search(){
        this.pdeDashboardService
        .pDE_REQ_OF_GROUP_PRODUCT_Search(this._filterInput)
        .subscribe((res) => {
            this.editTable.setList(res);
            this.updateView();
        });
    }

//#region Hyperlink
    onViewDetailProduct(item: PDE_REQ_GROUP_PRODUCT_ENTITY){
        //window.open("/app/admin/pde-product-view;id="+ item.producT_ID);
    }
    onViewDetailImage(item: PDE_REQ_GROUP_PRODUCT_ENTITY){
        //window.open(this.remoteServiceBaseUrl + item.urls)
    }
//#endregion Hyperlink

}