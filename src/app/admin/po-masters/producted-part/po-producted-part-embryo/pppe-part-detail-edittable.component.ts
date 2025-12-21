import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { PoGroupProductOfPOModalComponent } from "@app/admin/core/modal/module-po/po-group-product-of-po-modal/po-group-product-of-po-modal.component";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PO_ENTITY, PO_GROUP_PRODUCT_ENTITY, PO_PRODUCTED_PART_ENTITY, PoGroupProductServiceProxy } from "@shared/service-proxies/service-proxies";
import * as moment from "moment";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'pppe-part-detail-edittable',
	templateUrl: './pppe-part-detail-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class PPPEPartDetailEditTableComponent extends DefaultComponentBase implements AfterViewInit {
//#region "Constructor"
    constructor(
        private poGroupProductService: PoGroupProductServiceProxy,
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

    _inputModel: PO_GROUP_PRODUCT_ENTITY;
    @Input() set inputModel(value: PO_GROUP_PRODUCT_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): PO_GROUP_PRODUCT_ENTITY {
        return this._inputModel;
    }

    _producted_part_code: string;
    @Input() set producted_part_code(value: string) {
        this._producted_part_code = value;
    }
    get producted_part_code(): string {
        return this._producted_part_code;
    }

    _producted_part_name: string;
    @Input() set producted_part_name(value: string) {
        this._producted_part_name = value;
    }
    get producted_part_name(): string {
        return this._producted_part_name;
    }
//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<PO_PRODUCTED_PART_ENTITY>;

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
        /*
        if(this.isNullOrEmpty(this.inputModel.grouP_PRODUCT_ID)){
            this.showErrorMessage('Vui lòng chọn hệ hàng trước khi thêm mới dòng mới!');
            this.updateView();
        }
        else{
            let datas = this.editTable.allData;
            let data = new PO_PRODUCTED_PART_ENTITY();
            data.pO_ID = this.inputModel.pO_ID;
            //data.grouP_PRODUCT_ID = this.inputModel.grouP_PRODUCT_ID;
            //data.grouP_PRODUCT_CODE = this.inputModel.grouP_PRODUCT_CODE;
            data.producteD_PART_CODE = 'CD1';
            data.producteD_PART_NAME = 'Công đoạn phôi';
            data.expecteD_DT = moment();
            datas.push(data);
            this.editTable.setList(datas);
            this.updateView();
        }
        */
        let datas = this.editTable.allData;
            let data = new PO_PRODUCTED_PART_ENTITY();
            data.pO_ID = this.inputModel.pO_ID;
            //data.grouP_PRODUCT_ID = this.inputModel.grouP_PRODUCT_ID;
            //data.grouP_PRODUCT_CODE = this.inputModel.grouP_PRODUCT_CODE;
            data.producteD_PART_CODE = this._producted_part_code;
            data.producteD_PART_NAME = this._producted_part_name;
            data.expecteD_DT = moment();
            datas.push(data);
            this.editTable.setList(datas);
            this.updateView();
    }

    onRemove(): void {
        this.editTable.removeAllCheckedItem();
		this.updateView();
    }

    @Output() edit_completed: EventEmitter<any> =   new EventEmitter();
    pO_PRODUCTED_PART_GROUP_PRODUCT_Edit(){
        /*
        abp.ui.setBusy();
        let input = new PO_ENTITY();
        input.pO_ID = this.inputModel.pO_ID;
        input.grouP_PRODUCT_ID = this.inputModel.grouP_PRODUCT_ID;
        input.producteD_PART_CODE = 'CD1';
        input.producteD_PART_NAME = 'Công đoạn phôi';
        input.pO_GROUP_PRODUCT_PART_DETAILs = this.editTable.allData;

        this.poGroupProductService
            .pO_PRODUCTED_PART_GROUP_PRODUCT_Edit(input)
            .pipe(finalize(() => {abp.ui.clearBusy();}))
            .subscribe((res) => {
                if (res['Result'] != '0') {
                    this.showErrorMessage(res['ErrorDesc']);
                } else {
                    this.showSuccessMessage(res['ErrorDesc']);
                    this.edit_completed.emit();
                    this.updateView();
                }
            });
        */
    }

//#region popup
    // Hệ hàng 
    @ViewChild('poGroupProductOfPOModal') poGroupProductOfPOModal    : PoGroupProductOfPOModalComponent;
    showGroupProduct(): void {
        this.poGroupProductOfPOModal.filterInput.pO_ID = this.inputModel.pO_ID;
        this.poGroupProductOfPOModal.show();
        this.poGroupProductOfPOModal.search();
    }

    onSelectGroupProduct(item: PO_GROUP_PRODUCT_ENTITY){
        let currentItem = this.editTable.currentItem;
		let dataCurrentItem = this.editTable.allData[this.editTable.allData.indexOf(currentItem)];

        dataCurrentItem.grouP_PRODUCT_ID = item.grouP_PRODUCT_ID;
        dataCurrentItem.grouP_PRODUCT_CODE = item.grouP_PRODUCT_CODE;
    }
//#endregion popup
//#region Hyperlink
    onViewDetailGroupProduct(item: PO_GROUP_PRODUCT_ENTITY){
        window.open("/app/admin/po-group-product-view;id="+ item.grouP_PRODUCT_ID);
    }
//#endregion Hyperlink    
    
}