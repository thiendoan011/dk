import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PDEGroupProductServiceProxy, PDE_GROUP_PRODUCT_HARDWARE_ENTITY, PO_GROUP_PRODUCT_ENTITY, PO_HARDWAREVT_ENTITY, PO_PRODUCT_ENTITY } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'pde-hardware-edittable',
	templateUrl: './pde-hardware-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class PDEHardwareEditTableComponent extends DefaultComponentBase implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
        private pdeGroupProductService: PDEGroupProductServiceProxy,
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

    @ViewChild('editTable') editTable: EditableTableComponent<PDE_GROUP_PRODUCT_HARDWARE_ENTITY>;

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
	
	onSelectPopupAdd(items: PO_HARDWAREVT_ENTITY[]): void {
		this.updateView();
	}

    @Output() generate_hardware_completed: EventEmitter<any> =   new EventEmitter();
    pdE_GROUP_PRODUCT_HARDWARE_Upd(){
		abp.ui.setBusy();
        this.pdeGroupProductService
            .pDE_GROUP_PRODUCT_HARDWARE_Upd(this.inputModel)
            .pipe(finalize(() => {abp.ui.clearBusy();}))
            .subscribe((res) => {
                if (res['Result'] != '0') {
                    this.showErrorMessage(res['ErrorDesc']);
                } else {
                    this.showSuccessMessage(res['ErrorDesc']);
                    this.generate_hardware_completed.emit();
                    this.updateView();
                }
            });
    }

    @Output() edit_hardware_completed: EventEmitter<any> =   new EventEmitter();
    pdE_GROUP_PRODUCT_HARDWARE_Edit(){
		abp.ui.setBusy();
        this.pdeGroupProductService
            .pDE_GROUP_PRODUCT_HARDWARE_Edit(this.inputModel)
            .pipe(finalize(() => {abp.ui.clearBusy();}))
            .subscribe((res) => {
                if (res['Result'] != '0') {
                    this.showErrorMessage(res['ErrorDesc']);
                } else {
                    this.showSuccessMessage(res['ErrorDesc']);
                    this.edit_hardware_completed.emit();
                    this.updateView();
                }
            });
    }

    onChangeQuantity(item: PDE_GROUP_PRODUCT_HARDWARE_ENTITY){
        item.quantitY_REMAIN = item.quantitY_REAL - item.quantitY_USE;
        this.updateView();
    }

    exportPurchaseOrderExcel(){
        
    }

//#region Hyperlink
    onViewDetailProduct(item: PO_PRODUCT_ENTITY){
        window.open("/app/admin/pde-product-view;id="+ item.producT_ID);
    }
    onViewDetailHardwareVT(item: PDE_GROUP_PRODUCT_HARDWARE_ENTITY){
        window.open("/app/admin/po-hardwareVT-view;id="+ item.hardwarE_ID);
    }
//#endregion Hyperlink    
}