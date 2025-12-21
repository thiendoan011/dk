import { AfterViewInit, Component, EventEmitter, Injector, Input, Output, ViewChild } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { PURMaterialSummaryModalComponent } from "@app/admin/core/modal/module-purchase/pur-material-summary-modal/pur-material-summary-modal.component";
import { PUROrderMaterialModalComponent } from "@app/admin/core/modal/module-purchase/pur-order-material-modal/pur-order-material-modal.component";
import { PURUnitPriceOfMaterialModalComponent } from "@app/admin/core/modal/module-purchase/pur-unit-price-of-material-modal/pur-unit-price-of-material-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { PUR_ORDER_ENTITY, PUR_RECEIPT_EDITTABLE, PUR_REQUISITION_MATERIAL_SUMMARY_EDITTABLE, PUR_MATERIAL_ENTITY, PurOrderServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'pur-receipt-edittable',
	templateUrl: './pur-receipt-edittable.component.html'
})

export class PURReceiptEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
        private purOrderService: PurOrderServiceProxy
    ) {
        super(injector);
    }

    _inputModel: PUR_ORDER_ENTITY;
    @Input() set inputModel(value: PUR_ORDER_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): PUR_ORDER_ENTITY {
        return this._inputModel;
    }

    _title: string;
    @Input() set title(value: string) {
        this._title = value;
    }
    get title(): string {
        return this._title;
    }

    _disableInput: boolean;
    @Input() set disableInput(value: boolean) {
        this._disableInput = value;
    }
    get disableInput(): boolean {
        return this._disableInput;
    }
//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<PUR_RECEIPT_EDITTABLE>;
    record: PUR_RECEIPT_EDITTABLE = new PUR_RECEIPT_EDITTABLE();

    ngOnInit(): void {
        this.updateView();
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    refreshTable(){
        this.updateView();
    }
    
    @ViewChild('popupModal') popupModal: PURMaterialSummaryModalComponent;
    showPopup(): void {
        this.popupModal.filterInput.puR_REQUISITION_ID = this.inputModel.puR_REQUISITION_ID;
		this.popupModal.show();
		this.popupModal.search();
	}
	
	onSelectPopup(items: PUR_REQUISITION_MATERIAL_SUMMARY_EDITTABLE[]): void {
		items.forEach(x => {
			var item = new PUR_RECEIPT_EDITTABLE();
			item.materiaL_ID = x.materiaL_ID;
			item.materiaL_CODE = x.materiaL_CODE;
			this.editTable.allData.push(item);
		})

		this.editTable.resetNoAndPage();
		this.editTable.changePage(0);
		this.updateView();
	}

    onAdd(): void {
        this.showPopup();
    }

    onRemove(): void {
        this.editTable.removeAllCheckedItem();
		this.updateView();
    }

    @Output() onUpdate: EventEmitter<any> = new EventEmitter();
    onAddReceipt(){

        this.record.puR_REQUISITION_ID = this.inputModel.puR_REQUISITION_ID;
        this.record.puR_BATCH_ID = this.inputModel.puR_BATCH_ID;
        this.record.puR_ORDER_ID = this.inputModel.puR_ORDER_ID;

        abp.ui.setBusy();
        this.purOrderService
        .pUR_RECEIPT_Ins(this.record)
        .pipe(finalize(() => {abp.ui.clearBusy();}))
        .subscribe((res) => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
            } else {
                this.showSuccessMessage(res['ErrorDesc'])
                this.record = new PUR_RECEIPT_EDITTABLE();
                this.onUpdate.emit();
    
                this.updateView();
            }
        });
    }

//#region "Popup"
    // Vật tư
    @ViewChild('purOrdermaterialModal') purOrdermaterialModal: PUROrderMaterialModalComponent;
	showPurOrderMaterial(): void {
        // reset search
		this.purOrdermaterialModal.dataTable.records = [];
        //required
		this.purOrdermaterialModal.filterInput.puR_REQUISITION_ID = this.inputModel.puR_REQUISITION_ID;
		this.purOrdermaterialModal.filterInput.puR_ORDER_ID = this.inputModel.puR_ORDER_ID;

        //search
		this.purOrdermaterialModal.show();
		this.purOrdermaterialModal.search();
	}

    onSelectPurOrderMaterial(event: PUR_MATERIAL_ENTITY){
        this.record.materiaL_ID = event.materiaL_ID;
        this.record.materiaL_CODE = event.materiaL_CODE;
        this.record.producteD_PART_CODE = event.producteD_PART_CODE;
        this.record.part = event.part;
        this.record.uniT_PRICE = 0;
        this.record.quantitY_ORDER = event.quantitY_ORDER;
        this.record.quantitY_RECEIVED = event.quantitY_RECEIVED;
        this.record.quantitY_REMAIN = event.quantitY_ORDER - event.quantitY_RECEIVED;

        this.record.r_ID = event.r_ID;
        this.record.r_CODE = event.r_CODE;
        this.record.pO_ID = event.pO_ID;
        this.record.pO_CODE = event.pO_CODE;
        this.record.grouP_PRODUCT_ID = event.grouP_PRODUCT_ID;
        this.record.grouP_PRODUCT_CODE = event.grouP_PRODUCT_CODE;
        this.record.producT_ID = event.producT_ID;
        this.record.producT_CODE = event.producT_CODE;
        this.record.producT_GROUP_DETAIL_ID = event.producT_GROUP_DETAIL_ID;
        this.record.producT_GROUP_DETAIL_CODE = event.producT_GROUP_DETAIL_CODE;
        this.record.producT_DETAIL_ID = event.producT_DETAIL_ID;
        this.record.producT_DETAIL_CODE = event.producT_DETAIL_CODE;

        this.updateView();
    }

    // Đơn giá
    @ViewChild('unitPriceOfMaterialModal') unitPriceOfMaterialModal: PURUnitPriceOfMaterialModalComponent;
    showUnitPriceOfMaterial(): void {
        // reset search
        this.unitPriceOfMaterialModal.dataTable.records = [];
        //require
        this.unitPriceOfMaterialModal.filterInput.puR_ORDER_ID = this.inputModel.puR_ORDER_ID;
        this.unitPriceOfMaterialModal.filterInput.materiaL_ID = this.record.materiaL_ID;
        //search
        this.unitPriceOfMaterialModal.show();
        this.unitPriceOfMaterialModal.search(true);
    }

    onSelectUnitPriceOfMaterial(event: PUR_MATERIAL_ENTITY){
        this.record.uniT_PRICE = event.uniT_PRICE;
        this.updateView();
    }
//#endregion "Popup"
}