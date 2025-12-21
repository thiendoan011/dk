import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { EditPageState } from "@app/ultilities/enum/edit-page-state";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PO_COSTSTATEMENT_HISTORY_ENTITY, PO_COSTSTATEMENT_ENTITY, PO_PRODUCT_ENTITY, PoCoststatementServiceProxy, PO_GROUP_PRODUCT_ENTITY, R_ENTITY, RServiceProxy } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'r-manage-date-edittable',
	templateUrl: './r-manage-date-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class RManageDateEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
    EditPageState = EditPageState;

    @ViewChild('editTable') editTable: EditableTableComponent<PO_COSTSTATEMENT_HISTORY_ENTITY>;
    saving: boolean;

    constructor(
        injector: Injector,
        private rService: RServiceProxy
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

    _inputModel: R_ENTITY;
    @Input() set inputModel(value: R_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): R_ENTITY {
        return this._inputModel;
    }

    _editPageState: EditPageState;
    @Input() set editPageState(value: EditPageState) {
        this._editPageState = value;
    }
    get editPageState(): EditPageState {
        return this._editPageState;
    }

    listProduct: PO_PRODUCT_ENTITY[];

    ngOnInit(): void {

        this.updateView();
        this.changeAccordionHeaderIcon();
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    onAddAttachFile(): void {
        let datas = this.editTable.allData;
        let data = new PO_COSTSTATEMENT_HISTORY_ENTITY();
        datas.push(data);
		this.editTable.setList(datas);
    }

    removeAttachFile(): void {
        this.editTable.removeAllCheckedItemWithoutCondition('autH_STATUS', 'A');
		this.updateView();
    }
    
    reload(){
    }
//#region popup  

//#endregion popup
    @Output() edit_history: EventEmitter<any> =   new EventEmitter();
    onUpdate(): void {
        /*
        //Danh sách lịch sử cập nhật
        this.inputModel.coststatemenT_HISTORYs = this.editTable.allData;
        this.inputModel.typE_UPD = 'OFFICE'

        this.poCoststatementService
        .pO_COSTSTATEMENT_HISTORY_Upd(this.inputModel)
        .pipe(
            finalize(() => {
                this.saving = false;
            })
        )
        .subscribe((res) => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
                this.inputModel.autH_STATUS = '';
            } else {
                this.showSuccessMessage(res['ErrorDesc']);
                this.edit_history.emit();
                this.updateView();
            }
        });
        */
    }

    onChangeNBDay(){
        // BỘ PHẬN VẬT TƯ CUNG CẤP VẬT TƯ SƠN + ĐÓNG GÓI                (4)
        this.inputModel.warehousE_PAINT_REQUEST_NBDAY = Math.round(this.inputModel.assemblY_REQUEST_NBDAY * 1.3);
        // BỘ PHẬN VẬT TƯ CUNG CẤP VẬT TƯ LẮP RÁP                       (6) 
        this.inputModel.warehousE_ASSEMBLY_REQUEST_NBDAY = Math.round(this.inputModel.structurE_REQUEST_NBDAY * 1.3);
        // BỘ PHẬN VẬT TƯ CUNG CẤP VẬT TƯ ĐỊNH HÌNH                     (8)
        this.inputModel.warehousE_STRUCTURE_REQUEST_NBDAY = Math.round(this.inputModel.embryO_REQUEST_NBDAY*1.3);
        this.updateView();
    }

    onTest(){
        this.rService.r_TEST_ById(this.inputModel).subscribe(response => {
            // Ngày YCHT P.DAPT cung cấp hồ sơ sản phẩm cho PKT
            this.inputModel.tesT_PDE_PRODUCT_PROFILE_REQUEST_DT = response.tesT_PDE_PRODUCT_PROFILE_REQUEST_DT;
            this.inputModel.tesT_PDE_PRODUCT_PROFILE_REQUEST_NBDAY = response.tesT_PDE_PRODUCT_PROFILE_REQUEST_DT.diff(this.inputModel.pdE_PRODUCT_PROFILE_REQUEST_DT, "day");
            // Ngày YCHT PKT triên khai PPS
            this.inputModel.tesT_TECH_REQUEST_DT = response.tesT_TECH_REQUEST_DT;
            this.inputModel.tesT_TECH_REQUEST_NBDAY = response.tesT_TECH_REQUEST_DT.diff(this.inputModel.tecH_REQUEST_DT, "day");
            // Ngày YCHT Hồ sơ sản phẩm cho các phòng liên quan
            this.inputModel.tesT_TECH_PRODUCT_PROFILE_REQUEST_DT = response.tesT_TECH_PRODUCT_PROFILE_REQUEST_DT;
            this.inputModel.tesT_TECH_PRODUCT_PROFILE_REQUEST_NBDAY = response.tesT_TECH_PRODUCT_PROFILE_REQUEST_DT.diff(this.inputModel.tecH_PRODUCT_PROFILE_REQUEST_DT, "day");
            // Ngày YCHT Vật tư cung cấp nguyên liệu
            this.inputModel.tesT_WAREHOUSE_MATERIAL_REQUEST_DT = response.tesT_WAREHOUSE_MATERIAL_REQUEST_DT;
            this.inputModel.tesT_WAREHOUSE_MATERIAL_REQUEST_NBDAY = response.tesT_WAREHOUSE_MATERIAL_REQUEST_DT.diff(this.inputModel.warehousE_MATERIAL_REQUEST_DT, "day");
            // Ngày YCHT Phôi
            this.inputModel.tesT_EMBRYO_REQUEST_DT = response.tesT_EMBRYO_REQUEST_DT;
            this.inputModel.tesT_EMBRYO_REQUEST_NBDAY = response.tesT_EMBRYO_REQUEST_DT.diff(this.inputModel.embryO_REQUEST_DT, "day");
            // Ngày YCHT Vật tư định hình
            this.inputModel.tesT_WAREHOUSE_STRUCTURE_REQUEST_DT = response.tesT_WAREHOUSE_STRUCTURE_REQUEST_DT;
            this.inputModel.tesT_WAREHOUSE_STRUCTURE_REQUEST_NBDAY = response.tesT_WAREHOUSE_STRUCTURE_REQUEST_DT.diff(this.inputModel.warehousE_STRUCTURE_REQUEST_DT, "day");
            // Ngày YCHT Định hình
            this.inputModel.tesT_STRUCTURE_REQUEST_DT = response.tesT_STRUCTURE_REQUEST_DT;
            this.inputModel.tesT_STRUCTURE_REQUEST_NBDAY = response.tesT_STRUCTURE_REQUEST_DT.diff(this.inputModel.structurE_REQUEST_DT, "day");
            // Ngày YCHT Vật tư lắp ráp
            this.inputModel.tesT_WAREHOUSE_ASSEMBLY_REQUEST_DT = response.tesT_WAREHOUSE_ASSEMBLY_REQUEST_DT;
            this.inputModel.tesT_WAREHOUSE_ASSEMBLY_REQUEST_NBDAY = response.tesT_WAREHOUSE_ASSEMBLY_REQUEST_DT.diff(this.inputModel.warehousE_ASSEMBLY_REQUEST_DT, "day");
            // Ngày YCHT Lắp ráp
            this.inputModel.tesT_ASSEMBLY_REQUEST_DT = response.tesT_ASSEMBLY_REQUEST_DT;
            this.inputModel.tesT_ASSEMBLY_REQUEST_NBDAY = response.tesT_ASSEMBLY_REQUEST_DT.diff(this.inputModel.assemblY_REQUEST_DT, "day");
            // Ngày YCHT Cung cấp VT Sơn+Đóng gói
            this.inputModel.tesT_WAREHOUSE_PAINT_REQUEST_DT = response.tesT_WAREHOUSE_PAINT_REQUEST_DT;
            this.inputModel.tesT_WAREHOUSE_PAINT_REQUEST_NBDAY = response.tesT_WAREHOUSE_PAINT_REQUEST_DT.diff(this.inputModel.warehousE_PAINT_REQUEST_DT, "day");
            // Ngày YCHT Sơn
            this.inputModel.tesT_PAINT_REQUEST_DT = response.tesT_PAINT_REQUEST_DT;
            this.inputModel.tesT_PAINT_REQUEST_NBDAY = response.tesT_PAINT_REQUEST_DT.diff(this.inputModel.painT_REQUEST_DT, "day");
            // Ngày YCHT Đóng gói
            this.inputModel.tesT_WRAP_REQUEST_DT = response.tesT_WRAP_REQUEST_DT;
            this.inputModel.tesT_WRAP_REQUEST_NBDAY = response.tesT_WRAP_REQUEST_DT.diff(this.inputModel.wraP_REQUEST_DT, "day");
            
            this.updateView();
        });
    }

}