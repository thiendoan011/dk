import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { PoPOModalComponent } from "@app/admin/core/modal/module-po/po-po-modal/po-po-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { GROUP_R_ENTITY, R_ENTITY, GROUP_R_LSX_EDITTABLE, GroupRServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'group-r-lsx-edittable',
	templateUrl: './group-r-lsx-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class GroupRLSXEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
        private groupRService: GroupRServiceProxy
    ) {
        super(injector);
    }

    _inputModel: GROUP_R_ENTITY;
    @Input() set inputModel(value: GROUP_R_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): GROUP_R_ENTITY {
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

    _disableEditColumn: boolean;
    @Input() set disableEditColumn(value: boolean) {
        this._disableEditColumn = value;
    }
    get disableEditColumn(): boolean {
        return this._disableEditColumn;
    }
//#endregion "Constructor"    

    @Output() onEditSucess : EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('editTable') editTable: EditableTableComponent<GROUP_R_LSX_EDITTABLE>;

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
        this.showPopup();
    }

    onRemove(): void {
        this.editTable.removeAllCheckedItem();
		this.updateView();
    }

    @ViewChild('popupModal') popupModal: PoPOModalComponent;
    showPopup(): void {
        this.popupModal.filterInput.grouP_R_ID = 'EMPTY';
		this.popupModal.show();
	}
	
	onSelectPopup(items: R_ENTITY[]): void {
		items.forEach(x => {
			var item = new GROUP_R_LSX_EDITTABLE();
			item.r_ID = x.r_ID;
			item.r_CODE = x.r_CODE;
			item.r_NAME = x.r_NAME;
			item.r_TYPE = x.r_TYPE;
			item.implemenT_DT = x.implemenT_DT;
			this.editTable.allData.push(item);
		})

		this.editTable.resetNoAndPage();
		this.editTable.changePage(0);
		this.updateView();
	}

    onViewDetailR(item: GROUP_R_LSX_EDITTABLE){
        window.open("/app/admin/r-view;id="+ item.r_ID);
    }
}