import { AfterViewInit, Component, EventEmitter, Injector, Input, Output, ViewChild } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { PoProductOfPurchaseOutsourcedModalComponent } from "@app/admin/core/modal/module-po/po-product-of-purchase-outsourced-modal copy/po-product-of-purchase-outsourced-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { finalize } from "@node_modules/rxjs/operators";
import { PO_PRODUCT_OUTSOURCED_RECEIPT_DTO, PoPurchaseServiceProxy } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'po-purchase-outsourced-product-receipt-editable',
	templateUrl: './po-purchase-outsourced-product-receipt-editable.component.html'
})

export class POPurchaseOutsourcedProductReceiptEditableComponent extends ChangeDetectionComponent implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
        private poPurchaseService: PoPurchaseServiceProxy
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

    _inputModel: PO_PRODUCT_OUTSOURCED_RECEIPT_DTO;
    @Input() set inputModel(value: PO_PRODUCT_OUTSOURCED_RECEIPT_DTO) {
        this._inputModel = value;
    }
    get inputModel(): PO_PRODUCT_OUTSOURCED_RECEIPT_DTO {
        return this._inputModel;
    }

    record: PO_PRODUCT_OUTSOURCED_RECEIPT_DTO = new PO_PRODUCT_OUTSOURCED_RECEIPT_DTO();
//#endregion "Constructor"   

    getReceipt(){
        this.poPurchaseService.pO_PURCHASE_OUTSOURCED_RECEIPT_Byid(this._inputModel)
        .subscribe(response => {
            this.editTable.setList(response);
            this.updateView();
        });
    }

    @ViewChild('editTable') editTable: EditableTableComponent<PO_PRODUCT_OUTSOURCED_RECEIPT_DTO>;

    ngOnInit(): void {
        this.getReceipt();
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    @Output() ins_completed: EventEmitter<any> =   new EventEmitter();
    onAddProductLog(){
        abp.ui.setBusy();
        this.poPurchaseService
        .pO_PURCHASE_PRODUCT_OUTSOURCED_RECEIPT_Ins(this.record)
        .pipe(finalize(() => {abp.ui.clearBusy();}))
        .subscribe((res) => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
            } else {
                this.showSuccessMessage('Thêm thành công!');
                this.record = new PO_PRODUCT_OUTSOURCED_RECEIPT_DTO();
                this.record.quantitY_HANDLE = 0 || undefined;
                this.record.actioN_TYPE = "";
                this.getReceipt();
                this.ins_completed.emit();
            }
        });
    }
    
    @ViewChild('poProductOfPurchaseOutsourcedModal') poProductOfPurchaseOutsourcedModal: PoProductOfPurchaseOutsourcedModalComponent;
    showProductOutsourced(){
        this.poProductOfPurchaseOutsourcedModal.filterInput.r_CODE = this.inputModel.r_CODE;
        this.poProductOfPurchaseOutsourcedModal.show();
        this.poProductOfPurchaseOutsourcedModal.search();
    }

    onSelectProductOutsourced(item){
        this.record.pO_PURCHASE_PRODUCT_OUTSOURCED_ID = item.pO_PURCHASE_PRODUCT_OUTSOURCED_ID;
        this.record.purchasE_ID = item.purchasE_ID;
        this.record.purchasE_CODE = item.purchasE_CODE;
        this.record.r_ID = item.r_ID;
        this.record.r_CODE = item.r_CODE;
        this.record.pO_ID = item.pO_ID;
        this.record.pO_CODE = item.pO_CODE;
        this.record.grouP_PRODUCT_ID = item.grouP_PRODUCT_ID;
        this.record.grouP_PRODUCT_CODE = item.grouP_PRODUCT_CODE;
        this.record.producT_ID = item.producT_ID;
        this.record.producT_CODE = item.producT_CODE;
        this.record.suP_ID = item.suP_ID;
        this.record.suP_CODE = item.suP_CODE;
        this.record.quantity = item.quantity;
        this.record.quantitY_OUTSOURCED = item.quantitY_OUTSOURCED;
        this.record.quantitY_OUTSOURCED_COMPLETED = item.quantitY_OUTSOURCED_COMPLETED;
        this.record.quantitY_OUTSOURCED_DELIVERED = item.quantitY_OUTSOURCED_DELIVERED;
        this.record.quantitY_OUTSOURCED_FAILED = item.quantitY_OUTSOURCED_FAILED;
        this.record.quantitY_OUTSOURCED_RETURNED = item.quantitY_OUTSOURCED_RETURNED;
        this.record.quantitY_HANDLE = item.quantitY_OUTSOURCED - item.quantitY_OUTSOURCED_COMPLETED - item.quantitY_OUTSOURCED_FAILED;
        this.record.actioN_TYPE = "";
        this.updateView();
    }
}