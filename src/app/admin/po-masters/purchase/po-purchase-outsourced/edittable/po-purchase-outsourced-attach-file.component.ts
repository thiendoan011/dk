import { AfterViewInit, Component, Injector, Input, ViewChild } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { CM_ATTACH_FILE_DTO, CM_ATTACH_FILE_ENTITY, PO_PURCHASE_ENTITY } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'po-purchase-outsourced-attach-file',
	templateUrl: './po-purchase-outsourced-attach-file.component.html'
})

export class POPurchaseOutsourcedAttachFileComponent extends ChangeDetectionComponent implements AfterViewInit {
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
    _folder_upload: string;
    @Input() set folder_upload(value: string) {
        this._folder_upload = value;
    }

    _inputModel: PO_PURCHASE_ENTITY;
    @Input() set inputModel(value: PO_PURCHASE_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): PO_PURCHASE_ENTITY {
        return this._inputModel;
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

    onAdd(): void {
        let datas = this.editTable.allData;
        let data = new CM_ATTACH_FILE_ENTITY();
        datas.push(data);
        this.editTable.setList(datas);
    }

    onRemove(): void {
        this.editTable.removeAllCheckedItem();
        this.updateView();
    }

    l_UploadFileComplete(event:any, item){
        item.filE_NAME_OLD = event.filE_NAME_OLD;
        item.filE_NAME_NEW = event.filE_NAME_NEW;
        item.patH_NEW = event.patH_NEW;
        item.filE_SIZE = event.filE_SIZE;
        item.filE_TYPE = event.filE_TYPE;
    }
}