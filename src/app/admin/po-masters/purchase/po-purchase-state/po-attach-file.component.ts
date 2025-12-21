import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { EditPageState } from "@app/ultilities/enum/edit-page-state";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { ATTACH_FILE_ENTITY } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'po-attach-file',
	templateUrl: './po-attach-file.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class POAttachFileComponent extends ChangeDetectionComponent implements AfterViewInit {
    _disableInput: boolean;

    editPageState: EditPageState;
    EditPageState = EditPageState;

    @ViewChild('editTableAttachFile') editTableAttachFile: EditableTableComponent<ATTACH_FILE_ENTITY>;

    constructor(
        injector: Injector,
    ) {
        super(injector);
    }

    @Input() set disableInput(value: boolean) {
        this._disableInput = value;
    }

    get disableInput(): boolean {
        return this._disableInput;
    }

    get disableChange() {
        return (this.editPageState == EditPageState.viewDetail || 
                (this.editPageState == EditPageState.edit)
        )
    }

    ngOnInit(): void {
        this.updateView();
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    onAddAttachFile(): void {
        let datas = this.editTableAttachFile.allData;
        let data = new ATTACH_FILE_ENTITY();
        datas.push(data);
		this.editTableAttachFile.setList(datas);
    }

    removeAttachFile(): void {
        this.editTableAttachFile.removeAllCheckedItem();
		this.updateView();
    }
}