import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { PoCustomerModalComponent } from "@app/admin/core/modal/module-po/po-customer-modal/po-customer-modal.component";
import { PDEProductWithConditionModalComponent } from "@app/admin/core/modal/module-project-development/pde-product-with-condition-modal/pde-product-with-condition-modal.component";
import { RecordStatusConsts } from "@app/admin/core/ultils/consts/RecordStatusConsts";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import { AppConsts } from "@shared/AppConsts";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PDEGroupProductServiceProxy, PDE_GROUP_PRODUCT_NORMAL_ENTITY, PO_CUSTOMER_ENTITY, PO_PRODUCT_ENTITY } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'pde-req-normal-product-edittable',
	templateUrl: './pde-req-normal-product-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class PDEReqNormalProductEditTableComponent extends DefaultComponentBase implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
        private pdeGroupProductService: PDEGroupProductServiceProxy,
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

    _inputModel: PDE_GROUP_PRODUCT_NORMAL_ENTITY;
    @Input() set inputModel(value: PDE_GROUP_PRODUCT_NORMAL_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): PDE_GROUP_PRODUCT_NORMAL_ENTITY {
        return this._inputModel;
    }

    _title: string;
    @Input() set title(value: string) {
        this._title = value;
    }
    get title(): string {
        return this._title;
    }

    _is_hidden_progress: string;
    @Input() set is_hidden_progress(value: string) {
        this._is_hidden_progress = value;
    }
    get is_hidden_progress(): string {
        return this._is_hidden_progress;
    }

    _disableNoteTech: boolean = true;
    @Input() set disableNoteTech(value: boolean) {
        this._disableNoteTech = value;
    }
    get disableNoteTech(): boolean {
        return this._disableNoteTech;
    }

    _is_request: boolean;
    @Input() set is_request(value: boolean) {
        this._is_request = value;
    }
    get is_request(): boolean {
        return this._is_request;
    }

    _is_progress: boolean;
    @Input() set is_progress(value: boolean) {
        this._is_progress = value;
    }
    get is_progress(): boolean {
        return this._is_progress;
    }

//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<PO_PRODUCT_ENTITY>;
    @ViewChild('popupAdd') popupAdd: PDEProductWithConditionModalComponent;

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
        this.popupAdd.filterInput.grouP_PRODUCT_ID = this.inputModel.grouP_PRODUCT_ID;
		this.popupAdd.show();
    }

    onSelectPopupAdd(items: PO_PRODUCT_ENTITY[]): void {
        items.forEach(x => {
			var item = new PO_PRODUCT_ENTITY();
			item.producT_ID = x.producT_ID;
			item.producT_CODE = x.producT_CODE;
			item.producT_NAME = x.producT_NAME;
			item.quantity = 0;
			this.editTable.allData.push(item);
		})

		this.editTable.resetNoAndPage();
		this.editTable.changePage(0);
		this.updateView();
	}

    onRemove(): void {
        this.editTable.removeAllCheckedItem();
		this.updateView();
    }
    
    reload(){

    }

    @Output() edit_completed: EventEmitter<any> =   new EventEmitter();
    PDE_GROUP_PRODUCT_NORMAL_Edit(){
        if(this._is_request){
            this.inputModel.typE_UPDATE = 'REQUEST';
        }
        else{
            this.inputModel.typE_UPDATE = 'PROGRESS';
        }
		abp.ui.setBusy();
        this.inputModel.pdE_NORMAL_PRODUCTs = this.editTable.allData;
        this.pdeGroupProductService
            .pDE_GROUP_PRODUCT_NORMAL_Edit(this.inputModel)
            .pipe(finalize(() => {abp.ui.clearBusy();}))
            .subscribe((res) => {
                if (res['Result'] != '0') {
                    this.showErrorMessage(res['ErrorDesc']);
                } else {
                    this.showSuccessMessage(res['ErrorDesc']);
                    this.edit_completed.emit();
                    this.updateView();
                }
            });
    }

//#region Hyperlink
    onViewDetailProduct(item: PO_PRODUCT_ENTITY){
        window.open("/app/admin/pde-product-view;id="+ item.producT_ID);
    }
    onViewDetailImage(item: PO_PRODUCT_ENTITY){
        window.open(this.remoteServiceBaseUrl + item.urls)
    }
    onViewDetailCustomer(item: PO_PRODUCT_ENTITY){
        window.open("/app/admin/po-customer-view;id="+ item.customeR_ID);
    }
//#endregion Hyperlink

//#region popup
    @ViewChild('poCusModal') poCusModal: PoCustomerModalComponent;
    showCusModal(): void {
        this.poCusModal.filterInput.recorD_STATUS = RecordStatusConsts.Active;
        this.poCusModal.filterInput.top           = null;
        this.poCusModal.show();
    }

    onSelectCustomer(event: PO_CUSTOMER_ENTITY): void {
        let currentItem = this.editTable.currentItem;
		let dataCurrentItem = this.editTable.allData[this.editTable.allData.indexOf(currentItem)];

        dataCurrentItem.customeR_ID = event.customeR_ID;
        dataCurrentItem.customeR_CODE = event.customeR_CODE;
        dataCurrentItem.customeR_NAME = event.customeR_NAME;
    }
//#endregion popup

}