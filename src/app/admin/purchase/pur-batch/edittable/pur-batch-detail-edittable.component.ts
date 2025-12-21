import { AfterViewInit, Component, EventEmitter, Injector, Input, Output, ViewChild } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { MWTypeSupplierModalComponent } from "@app/admin/core/modal/module-material/mw-type-supplier-modal/mw-type-supplier-modal.component";
import { PURMaterialSummaryModalComponent } from "@app/admin/core/modal/module-purchase/pur-material-summary-modal/pur-material-summary-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { PUR_REQUISITION_ENTITY, PUR_BATCH_DETAIL_EDITTABLE, PUR_REQUISITION_MATERIAL_SUMMARY_EDITTABLE, MW_TYPE_SUPPLIER_PRICE_ENTITY, PUR_BATCH_ENTITY } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'pur-batch-detail-edittable',
	templateUrl: './pur-batch-detail-edittable.component.html'
})

export class PURBatchDetailEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
    ) {
        super(injector);
    }

    _inputModel: PUR_BATCH_ENTITY;
    @Input() set inputModel(value: PUR_BATCH_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): PUR_BATCH_ENTITY {
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

    @ViewChild('editTable') editTable: EditableTableComponent<PUR_BATCH_DETAIL_EDITTABLE>;

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
			var item = new PUR_BATCH_DETAIL_EDITTABLE();
			item.materiaL_ID = x.materiaL_ID;
			item.materiaL_CODE = x.materiaL_CODE;
			item.quantitY_ORDER = x.quantitY_ORDER - x.quantitY_ORDERED;
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
	
    @ViewChild('materialSupplierModal') materialSupplierModal: MWTypeSupplierModalComponent;
	showMaterialSupplierModal(item: PUR_BATCH_DETAIL_EDITTABLE): void {
		this.materialSupplierModal.dataTable.records = [];
		this.materialSupplierModal.filterInput.mW_TYPE_ID = item.materiaL_ID;
		this.materialSupplierModal.show();
	}

    onSelectMaterialSupplier(event: MW_TYPE_SUPPLIER_PRICE_ENTITY){
        let currentItem = this.editTable.currentItem;
		let dataCurrentItem = this.editTable.allData[this.editTable.allData.indexOf(currentItem)];

        dataCurrentItem.suP_ID = event.suP_ID;
        dataCurrentItem.suP_CODE = event.suP_CODE;
        dataCurrentItem.uniT_PRICE = event.price;
    }

    @Output() onUpdate: EventEmitter<any> = new EventEmitter();
    onUpd(){
        this.onUpdate.emit();
    }

    @Output() onUpdateAndCreateOrder: EventEmitter<any> = new EventEmitter();
    onUpdAndCreateOrder(){
        this.onUpdateAndCreateOrder.emit();
    }

    @Output() onDeleteOrderDetail: EventEmitter<any> = new EventEmitter();
    onDelOrderDetail(item: PUR_BATCH_DETAIL_EDITTABLE){
        this.onDeleteOrderDetail.emit(item);
    }
}