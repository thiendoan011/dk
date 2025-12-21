import { AfterViewInit, Component, Injector, Input, ViewChild } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { CMSupplierModalComponent } from "@app/admin/core/modal/module-common/cm-supplier-modal/cm-supplier-modal.component";
import { PoProductOfRModalComponent } from "@app/admin/core/modal/module-po/po-product-of-r-modal/po-product-of-r-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { CM_SUPPLIER_ENTITY, PO_PRODUCT_OUTSOURCED_DTO, R_ENTITY } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'po-purchase-outsourced-product-editable',
	templateUrl: './po-purchase-outsourced-product-editable.component.html'
})

export class POPurchaseOutsourcedProductEditableComponent extends ChangeDetectionComponent implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector
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
    _title: boolean;
    @Input() set title(value: boolean) {
        this._title = value;
    }

    _inputModel: R_ENTITY;
    @Input() set inputModel(value: R_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): R_ENTITY {
        return this._inputModel;
    }
//#endregion "Constructor"   

    @ViewChild('editTable') editTable: EditableTableComponent<PO_PRODUCT_OUTSOURCED_DTO>;

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
        this.poProductOfRModal.filterInput.r_ID = this.inputModel.r_ID;
        this.poProductOfRModal.filterInput.r_CODE = this.inputModel.r_CODE;
        this.poProductOfRModal.show();
    }

    onRemove(): void {
        this.editTable.removeAllCheckedItem();
        this.updateView();
    }

    // Sản phẩm
    @ViewChild('poProductOfRModal') poProductOfRModal: PoProductOfRModalComponent;
    onSelectProductOfR(items){
        for (const item of items) {
            this.editTable.allData.push(item);
            this.editTable.resetNoAndPage();
            this.editTable.changePage(0);
            this.updateView();
        }
    }
    
    @ViewChild('popupSupplierModal') popupSupplierModal: CMSupplierModalComponent;
    showPopupSupplier(): void {
        this.popupSupplierModal.show();
    }
    
    onSelectSupplierPopup(item: CM_SUPPLIER_ENTITY): void {
        let currentItem = this.editTable.currentItem;

        currentItem.suP_ID = item.suP_ID;
        currentItem.suP_CODE = item.suP_CODE;
        currentItem.suP_NAME = item.suP_NAME;
        this.updateView();
    }
    onViewProductDetail(item){
        window.open("/app/admin/cm-supplier-view;id="+ item.suP_ID);
    }
}