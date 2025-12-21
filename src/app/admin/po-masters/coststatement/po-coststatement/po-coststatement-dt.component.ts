import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { EditPageState } from "@app/ultilities/enum/edit-page-state";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PO_COSTSTATEMENT_DT_ENTITY, PO_COSTSTATEMENT_ENTITY, PO_PRODUCT_ENTITY } from "@shared/service-proxies/service-proxies";
import * as moment from "moment";

@Component({
    selector: 'po-coststatement-dt',
	templateUrl: './po-coststatement-dt.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class POCoststatementDTComponent extends ChangeDetectionComponent implements AfterViewInit {
    _disableInput: boolean;

    editPageState: EditPageState;
    EditPageState = EditPageState;

    @ViewChild('editTableAttachFile') editTableAttachFile: EditableTableComponent<PO_COSTSTATEMENT_DT_ENTITY>;

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

    _inputModel: PO_COSTSTATEMENT_ENTITY;
    @Input() set inputModel(value: PO_COSTSTATEMENT_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): PO_COSTSTATEMENT_ENTITY {
        return this._inputModel;
    }

    _group_name: string = '';
    @Input() set group_name(value: string) {
        this._group_name = value;
    }
    get group_name(): string {
        return this._group_name;
    }

    listProduct: PO_PRODUCT_ENTITY[];

    ngOnInit(): void {

        this.updateView();
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    onAddAttachFile(): void {
        let datas = this.editTableAttachFile.allData;
        let data = new PO_COSTSTATEMENT_DT_ENTITY();
        data.customeR_ID = this.inputModel.customeR_ID;
        data.customeR_NAME = this.inputModel.customeR_NAME;
        data.coststatemenT_DT_STATUS = 'Y';
        datas.push(data);
		this.editTableAttachFile.setList(datas);
    }

    removeAttachFile(): void {
        this.editTableAttachFile.removeAllCheckedItemWithoutCondition('autH_STATUS', 'A');
		this.updateView();
    }

    l_UploadFileComplete(event:any, item){
        item.filE_NAME_OLD = event.filE_NAME_OLD;
        item.filE_NAME_NEW = event.filE_NAME_NEW;
        item.patH_NEW = event.patH_NEW;
        item.filE_SIZE = event.filE_SIZE;
        item.filE_TYPE = event.filE_TYPE;
    }

    l_UploadFileComplete_Template(event:any, item){
        item.filE_NAME_OLD_TEMPLATE = event.filE_NAME_OLD;
        item.filE_NAME_NEW_TEMPLATE = event.filE_NAME_NEW;
        item.patH_NEW_TEMPLATE = event.patH_NEW;
        item.filE_SIZE_TEMPLATE = event.filE_SIZE;
        item.filE_TYPE_TEMPLATE = event.filE_TYPE;
    }
    
    reload(){
        this.editTableAttachFile.allData.forEach(x => {
            if(this.listProduct.filter(t => t.producT_ID == x.producT_ID).length == 0) {
                let product = new PO_PRODUCT_ENTITY();
                product.producT_ID = x.producT_ID;
                product.producT_NAME = x.producT_NAME;
                this.listProduct.push(product);
            }
        })
    }
}