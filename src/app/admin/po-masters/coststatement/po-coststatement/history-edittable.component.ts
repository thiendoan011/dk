import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { EditPageState } from "@app/ultilities/enum/edit-page-state";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PO_COSTSTATEMENT_HISTORY_ENTITY, PO_COSTSTATEMENT_ENTITY, PO_PRODUCT_ENTITY, PoCoststatementServiceProxy } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'history-edittable',
	templateUrl: './history-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class HistoryEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
    EditPageState = EditPageState;

    @ViewChild('editTable') editTable: EditableTableComponent<PO_COSTSTATEMENT_HISTORY_ENTITY>;
    saving: boolean;

    constructor(
        injector: Injector,
        private poCoststatementService: PoCoststatementServiceProxy,
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

    _inputModel: PO_COSTSTATEMENT_ENTITY;
    @Input() set inputModel(value: PO_COSTSTATEMENT_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): PO_COSTSTATEMENT_ENTITY {
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

}