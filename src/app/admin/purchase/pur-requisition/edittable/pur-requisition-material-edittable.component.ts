import { AfterViewInit, Component, EventEmitter, Injector, Input, Output, ViewChild } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { PURRequisitionMaterialModalComponent } from "@app/admin/core/modal/module-purchase/pur-requisition-material-modal/pur-requisition-material-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { PUR_REQUISITION_ENTITY, PUR_REQUISITION_MATERIAL_EDITTABLE, PO_ENTITY, PurRequisitionServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'pur-requisition-material-edittable',
	templateUrl: './pur-requisition-material-edittable.component.html'
})

export class PURRequisitionMaterialEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
        private purRequisitionService: PurRequisitionServiceProxy
    ) {
        super(injector);
    }

    _inputModel: PUR_REQUISITION_ENTITY;
    @Input() set inputModel(value: PUR_REQUISITION_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): PUR_REQUISITION_ENTITY {
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

    _disableListR: boolean;
    @Input() set disableListR(value: boolean) {
        this._disableListR = value;
    }
    get disableListR(): boolean {
        return this._disableListR;
    }
//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<PUR_REQUISITION_MATERIAL_EDITTABLE>;

    ngOnInit(): void {
        this.updateView();
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    refreshTable(){
        this.updateView();
    }

    @Output() onUpdate: EventEmitter<any> = new EventEmitter();
    @Output() onSaveAndLocked: EventEmitter<any> = new EventEmitter();
    onUpd(){
        this.onUpdate.emit();
    }
    onSaveAndLock(){
        this.onSaveAndLocked.emit();
    }

    onAdd(): void {
        this.showPopup();
    }

    onRemove(): void {
        this.editTable.removeAllCheckedItem();
		this.updateView();
    }

    @ViewChild('popupModal') popupModal: PURRequisitionMaterialModalComponent;
    showPopup(): void {
		this.popupModal.show();
	}
	
	onSelectPopup(items: PUR_REQUISITION_MATERIAL_EDITTABLE[]): void {
		items.forEach(x => {
			var item = new PUR_REQUISITION_MATERIAL_EDITTABLE();
			item.r_ID = x.r_ID;
			item.r_CODE = x.r_CODE;
            item.pO_ID = x.pO_ID;
			item.pO_CODE = x.pO_CODE;
            item.grouP_PRODUCT_ID = x.grouP_PRODUCT_ID;
			item.grouP_PRODUCT_CODE = x.grouP_PRODUCT_CODE;
            item.producT_ID = x.producT_ID;
			item.producT_CODE = x.producT_CODE;
            item.producT_GROUP_DETAIL_ID = x.producT_GROUP_DETAIL_ID;
			item.producT_GROUP_DETAIL_CODE = x.producT_GROUP_DETAIL_CODE;
            item.producT_DETAIL_ID = x.producT_DETAIL_ID;
			item.producT_DETAIL_CODE = x.producT_DETAIL_CODE;
            item.materiaL_ID = x.materiaL_ID;
			item.materiaL_CODE = x.materiaL_CODE;
			item.producteD_PART_CODE = x.producteD_PART_CODE;
			item.producteD_PART_NAME = x.producteD_PART_NAME;
			item.iS_IMPORTANT = x.iS_IMPORTANT;
			item.quantitY_ORDER = x.quantitY_ORDER;
			item.quantitY_RECEIVED = 0;
			item.autH_STATUS = 'U';
			this.editTable.allData.push(item);
		})

		this.editTable.resetNoAndPage();
		this.editTable.changePage(0);
		this.updateView();
	}

    onGenerateMaterials(){
        this.editTable.allData = [];

        this.purRequisitionService.pUR_REQUISITION_GENERATE_MATERIALs(this.inputModel.puR_REQUISITION_ID)
        .pipe(finalize(() => {abp.ui.clearBusy();}))
        .subscribe((res) => {
            if (res.length > 0) {
                res.forEach((x) => {
                    var item = new PUR_REQUISITION_MATERIAL_EDITTABLE();
                    item.r_ID = x.r_ID;
                    item.r_CODE = x.r_CODE;
                    item.pO_ID = x.pO_ID;
                    item.pO_CODE = x.pO_CODE;
                    item.grouP_PRODUCT_ID = x.grouP_PRODUCT_ID;
                    item.grouP_PRODUCT_CODE = x.grouP_PRODUCT_CODE;
                    item.producT_ID = x.producT_ID;
                    item.producT_CODE = x.producT_CODE;
                    item.producT_GROUP_DETAIL_ID = x.producT_GROUP_DETAIL_ID;
                    item.producT_GROUP_DETAIL_CODE = x.producT_GROUP_DETAIL_CODE;
                    item.producT_DETAIL_ID = x.producT_DETAIL_ID;
                    item.producT_DETAIL_CODE = x.producT_DETAIL_CODE;
                    item.materiaL_ID = x.materiaL_ID;
                    item.materiaL_CODE = x.materiaL_CODE;
                    item.producteD_PART_CODE = x.producteD_PART_CODE;
                    item.producteD_PART_NAME = x.producteD_PART_NAME;
                    item.part = x.part;
                    item.iS_IMPORTANT = x.iS_IMPORTANT;
                    item.quantitY_ORDER = x.quantitY_ORDER;
                    item.quantitY_RECEIVED = 0;
                    item.autH_STATUS = 'U';
                    item.procesS_STATUS = '';
                    this.editTable.allData.push(item);
                });

                this.editTable.resetNoAndPage();
                this.editTable.changePage(0);
                this.showSuccessMessage('Tạo danh sách vật tư thành công');
                this.updateView();
            } else {
                this.showErrorMessage('Tạo danh sách vật tư thất bại! Không có vật tư trong lệnh sản xuất');
                this.updateView();
            }
        });
    }

}