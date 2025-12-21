import { AfterViewInit, Component, Injector, Input, ViewChild } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { CM_ATTACH_FILE_DTO, CM_ATTACH_FILE_ENTITY } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'po-purchase-r-attach-file',
	templateUrl: './po-purchase-r-attach-file.component.html'
})

export class POPurchaseRAttachFileComponent extends ChangeDetectionComponent implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector
    ) {
        super(injector);
    }
    _title: boolean;
    @Input() set title(value: boolean) {
        this._title = value;
    }
//#endregion "Constructor"   

    @ViewChild('editTable') editTable: EditableTableComponent<CM_ATTACH_FILE_ENTITY>;
    attachFile: CM_ATTACH_FILE_DTO = new CM_ATTACH_FILE_DTO();

    ngOnInit(): void {
        this.updateView();
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    refreshTable(){
        for (const item of this.editTable.allData) {
            item['filE_ATTACHMENT'] = new CM_ATTACH_FILE_ENTITY();
            item['filE_ATTACHMENT']['filE_NAME_OLD'] = item.filE_NAME_OLD;
            item['filE_ATTACHMENT']['filE_NAME_NEW'] = item.filE_NAME_NEW;
            item['filE_ATTACHMENT']['patH_NEW'] = item.patH_NEW;
            item['filE_ATTACHMENT']['filE_SIZE'] = item.filE_SIZE;
            item['filE_ATTACHMENT']['filE_TYPE'] = item.filE_TYPE;

            this.editTable.resetNoAndPage();
            this.editTable.changePage(0);
            this.editTable.updateParentView();
        }
        this.updateView();
    }
}