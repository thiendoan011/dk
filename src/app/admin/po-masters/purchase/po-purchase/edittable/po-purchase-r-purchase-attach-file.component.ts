import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AttachFileServiceProxy, CM_ATTACH_FILE_DTO, CM_ATTACH_FILE_ENTITY, R_ENTITY } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'po-purchase-r-purchase-attach-file',
	templateUrl: './po-purchase-r-purchase-attach-file.component.html'
})

export class POPurchaseRPurchaseAttachFileComponent extends ChangeDetectionComponent implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
        private attachFileServiceProxy: AttachFileServiceProxy,
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

    _inputModel: R_ENTITY;
    @Input() set inputModel(value: R_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): R_ENTITY {
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
    
    reload(){
    }

    @Output() o_updateViewParent: EventEmitter<any> = new EventEmitter<any>();
    onUpdateFile(){
        this.attachFile.cM_ID = this._inputModel.r_ID;
        this.attachFile.cM_TYPE = this._folder_upload;
        this.attachFile.cM_ATTACH_FILEs = this.editTable.allData;
        this.attachFileServiceProxy.cM_ATTACH_FILE_2_Ins(this.attachFile)
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.showSuccessMessage(res['ErrorDesc']);
                this.o_updateViewParent.emit();
                this.updateView();
            }
        })
    }
}