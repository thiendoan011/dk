import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { CM_ATTACH_FILE_ENTITY, R_ENTITY } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'r-purchase-attach-file',
	templateUrl: './r-purchase-attach-file.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class RPurchaseAttachFileComponent extends ChangeDetectionComponent implements AfterViewInit {
    //#region "Constructor"
        constructor(
            injector: Injector,
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
}