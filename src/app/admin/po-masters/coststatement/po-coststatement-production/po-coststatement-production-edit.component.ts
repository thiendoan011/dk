import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { PO_COSTSTATEMENT_ENTITY, CM_DEPARTMENT_ENTITY, UltilityServiceProxy, PO_PURCHASE_ORDERS_ENTITY, PoCoststatementServiceProxy, PO_GROUP_PRODUCT_ENTITY, CM_ATTACH_FILE_ENTITY, PO_COSTSTATEMENT_DT_ENTITY, PoGroupProductServiceProxy, PO_PRODUCT_ENTITY } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes } from '@app/ultilities/enum/all-codes';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { IUiActionRejectExt } from '@app/ultilities/ui-action-re';
import { NgForm } from '@angular/forms';
import * as moment from 'moment'
import { HistoryModalComponent } from '@app/admin/core/modal/history-modal/history-modal.component';
import { POCoststatementDTProductionComponent } from './po-coststatement-production-dt.component';
import { HistoryEdittableComponent } from '../po-coststatement/history-edittable.component';
import { POCoststatementProductionLatestDTComponent } from './po-coststatement-production-latest-dt.component';
import {FileUploadModule} from 'primeng/fileupload';
import { Observable } from 'rxjs/internal/Observable';
import { EditableTableComponent } from '@app/admin/core/controls/common/editable-table/editable-table.component';
import { ToolbarRejectExtComponent } from '@app/admin/core/controls/toolbar-reject-ext/toolbar-reject-ext.component';
import { PoPOModalComponent } from '@app/admin/core/modal/module-po/po-po-modal/po-po-modal.component';
import { PoGroupProductModalComponent } from '@app/admin/core/modal/module-po/po-group-product-modal/po-group-product-modal.component';
import { PDEGroupProductModalComponent } from '@app/admin/core/modal/module-project-development/pde-group-product-modal/pde-group-product-modal.component';
@Component({
    templateUrl: './po-coststatement-production-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class POCoststatementProductionProductionEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionRejectExt<PO_COSTSTATEMENT_ENTITY> {
    constructor(
        injector: Injector,
        private ultilityService: UltilityServiceProxy,
        private poGroupProductService: PoGroupProductServiceProxy,
        private poCoststatementService: PoCoststatementServiceProxy,
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.coststatemenT_ID = this.getRouteParam('id');
        this.initFilter();
        this.initInput();
        this.initIsApproveFunct();
    }

    isApproveFunct: boolean;
    initIsApproveFunct(): void {
        this.ultilityService.isApproveFunct(this.getCurrentFunctionId()).subscribe((res) => {
			this.isApproveFunct = res;
		});
    }

    initInput(){
        this.inputModel.useR_LOGIN = this.appSession.user.userName;
        this.inputModel.brancH_LOGIN = this.appSession.user.subbrId;
        this.inputModel.deP_LOGIN = this.appSession.user.deP_ID;
    }

    @ViewChild('editForm') editForm: NgForm;
    @ViewChild('poPOModal') poPOModal: PoPOModalComponent;
    @ViewChild('editTablePurchaseState') editTablePurchaseState: EditableTableComponent<PO_PURCHASE_ORDERS_ENTITY>;
    // lịch sử xử lý
    @ViewChild('history_modal') history_modal: HistoryModalComponent;

    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;
    inputModel: PO_COSTSTATEMENT_ENTITY = new PO_COSTSTATEMENT_ENTITY();
    filterInput: PO_COSTSTATEMENT_ENTITY;

    get disableInput(): boolean {
        return this.editPageState == EditPageState.viewDetail || this.inputModel.autH_STATUS == AuthStatusConsts.Approve || this.inputModel.autH_STATUS == AuthStatusConsts.NotApprove;
    }

    get apptoolbar(): ToolbarRejectExtComponent {
        return this.appToolbar as ToolbarRejectExtComponent;
    }

    get isCreated(){
        return this.inputModel.coststatemenT_ID;
    }

    get getButtonRejectChooseNewCoststatement(){
        return (this.editPageState === EditPageState.viewDetail && this.inputModel.autH_STATUS == AuthStatusConsts.Approve);
    }

    get getButtonSendAppr(){
        return  (   (this.editPageState === EditPageState.edit && this.inputModel.autH_STATUS == AuthStatusConsts.Draft)
                    || (this.editPageState === EditPageState.add && this.inputModel.autH_STATUS == AuthStatusConsts.Draft)
                );
    }

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
                this.appToolbar.setRole('POCoststatementProduction', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('POCoststatementProduction', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.history_modal.getDetail();
                this.getDetailByid();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('POCoststatementProduction', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.history_modal.getDetail();
                this.getDetailByid();
                break;
        }
        this.appToolbar.setUiAction(this);
    }
    
    ngAfterViewInit(): void {
        this.updateView();
    }

    goBack() {
        this.navigatePassParam('/app/admin/po-coststatement-production', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDetailByid() {

        this.pocoststatementproductiondt.listProduct = [];
        this.poCoststatementService.pO_COSTSTATEMENT_ById(this.inputModel.coststatemenT_ID).subscribe(response => {
            if (!response) this.goBack()
            this.inputModel = response;
            this.initInput();

            this.appToolbar.setButtonApproveEnable(false);
            this.appToolbar.setButtonSaveEnable(false);
            
            this.setDataEditTables();

            this.history_modal.getDetail();
            this.updateView();
        });
    }


    saveInput() { 
    }

    onAdd(): void {
    }

    onUpdate(): void {
    }

    onSendAppr(){
    }

    onApprove(item: PO_COSTSTATEMENT_ENTITY): void {
    }

    onClickRejectToChooseNewCoststatement(){
    }

    onChangeHistoryEdittable(){
        this.getDetailByid();
        this.updateView();
    }
 //#region popup  
    // hệ hàng 
    @ViewChild('poGroupProductModal') poGroupProductModal: PoGroupProductModalComponent;
    showGroupProduct():void{
        this.poGroupProductModal.show();
    }
    onSelectGroupProduct(item: PO_GROUP_PRODUCT_ENTITY): void {
        this.inputModel.grouP_PRODUCT_ID = item.grouP_PRODUCT_ID;
        this.inputModel.grouP_PRODUCT_CODE = item.grouP_PRODUCT_CODE;
        this.inputModel.grouP_PRODUCT_NAME = item.grouP_PRODUCT_NAME;
        this.inputModel.customeR_ID = item.customeR_ID;
        this.inputModel.customeR_NAME = item.customeR_NAME;
        this.poGroupProductService
			.gET_PRODUCT_OF_PO_GROUP_PRODUCT_Byid(item.grouP_PRODUCT_ID)
			.subscribe((res) => {
                this.pocoststatementproductiondt.listProduct = [];
                this.pocoststatementproductiondt.editTableAttachFile.setList([]);
				for (const itemdt of res) {
                    let product = new PO_PRODUCT_ENTITY();
                    
                    product.producT_ID = itemdt.producT_ID;
                    product.producT_CODE = itemdt.producT_CODE;
                    product.producT_NAME = itemdt.producT_NAME;
                    this.pocoststatementproductiondt.listProduct.push(product);
                }
                for (const itemdt of res) {
                    let data = new PO_COSTSTATEMENT_DT_ENTITY();
                    let datas = this.pocoststatementproductiondt.editTableAttachFile.allData;
                    // khách hàng
                    data.customeR_ID = itemdt.customeR_ID;
                    data.customeR_NAME = itemdt.customeR_NAME;
                    // sản phẩm
                    data.producT_ID = itemdt.producT_ID;
                    data.producT_CODE = itemdt.producT_CODE;
                    data.producT_NAME = itemdt.producT_NAME;
                    datas.push(data);
                    this.pocoststatementproductiondt.editTableAttachFile.setList(datas);
                    this.pocoststatementproductiondt.editTableAttachFile.updateParentView();
                }
			});
        this.updateView();
    }
    deleteGroupProduct(event) {
        this.inputModel.grouP_PRODUCT_ID = '';
        this.inputModel.grouP_PRODUCT_CODE = '';
        this.inputModel.grouP_PRODUCT_NAME = '';
        this.inputModel.customeR_ID = '';
        this.inputModel.customeR_NAME = '';
        this.updateView();
    }

    // bộ phận tiếp nhận
    @ViewChild('depModal') depModal    : PDEGroupProductModalComponent;
    showDep(): void {
        this.depModal.show();
    }

    onSelectDep(item: PO_COSTSTATEMENT_ENTITY){
        this.inputModel.deP_ID   = item.deP_ID;
        this.inputModel.deP_CODE = item.deP_CODE;
        this.inputModel.deP_NAME = item.deP_NAME;
    }
    deleteDep(){
        this.inputModel.deP_ID   = '';
        this.inputModel.deP_CODE = '';
        this.inputModel.deP_NAME = '';
    }
//#endregion popup

//#region "EditTable"
    getDataEditTables(){
        // Danh sách bảng chiết tính
        this.inputModel.coststatemenT_DTs = this.pocoststatementproductiondt.editTableAttachFile.allData;
    }
    setDataEditTables(){
        // Danh sách bảng chiết tính thuộc sản phẩm và lịch sử cập nhật
        this.getEditTablesByid(this.inputModel.coststatemenT_ID);
    }

    // Danh sách bảng chiết tính
    @ViewChild('pocoststatementproductiondt') pocoststatementproductiondt: POCoststatementDTProductionComponent;
    // Danh sách bảng chiết tính hiện hành
    @ViewChild('pocoststatementproductionlatestdt') pocoststatementproductionlatestdt: POCoststatementProductionLatestDTComponent;
    // Yêu cầu xử lý
    //@ViewChild('historyEdittable') historyEdittable: HistoryEdittableComponent;

    getEditTablesByid(id: string): void {
        // lưới chi tiết
        this.poGroupProductService
        .gET_PRODUCT_OF_PO_GROUP_PRODUCT_Byid(this.inputModel.grouP_PRODUCT_ID)
        .subscribe((res1) => {
            // combobox sản phẩm của lưới dt
            this.pocoststatementproductiondt.listProduct = [];
            // combobox sản phẩm của lưới dt hiện hành
            this.pocoststatementproductionlatestdt.listProduct = [];
            for (const itemdt of res1) {
                // combobox product
                let product = new PO_PRODUCT_ENTITY();
                product.producT_ID = itemdt.producT_ID;
                product.producT_CODE = itemdt.producT_CODE;
                product.producT_NAME = itemdt.producT_NAME;

                // lưới Danh sách bảng chiết tính thuộc sản phẩm
                this.pocoststatementproductiondt.listProduct.push(product);
                this.pocoststatementproductiondt.editTableAttachFile.resetNoAndPage();
                this.pocoststatementproductiondt.editTableAttachFile.changePage(0);

                // lưới Danh sách bảng chiết tính thuộc sản phẩm
                this.pocoststatementproductionlatestdt.listProduct.push(product);
                this.pocoststatementproductionlatestdt.editTableAttachFile.resetNoAndPage();
                this.pocoststatementproductionlatestdt.editTableAttachFile.changePage(0);
            }
            // set Danh sách bảng chiết tính thuộc sản phẩm
            this.poCoststatementService.pO_COSTSTATEMENT_DT_ById(this.inputModel.coststatemenT_ID).subscribe(res => {
                // set list
                this.pocoststatementproductiondt.editTableAttachFile.setList(res.filter(x => x.coststatemenT_DT_STATUS != 'Y'));
                // set file đính kèm cho từng dòng
                for (const item of this.pocoststatementproductiondt.editTableAttachFile.allData) {
                    item.filE_ATTACHMENT = new CM_ATTACH_FILE_ENTITY();
                    item.filE_ATTACHMENT.filE_NAME_OLD = item.filE_NAME_OLD;
                    item.filE_ATTACHMENT.filE_NAME_NEW = item.filE_NAME_NEW;
                    item.filE_ATTACHMENT.patH_NEW = item.patH_NEW;
                    item.filE_ATTACHMENT.filE_SIZE = item.filE_SIZE;
                    item.filE_ATTACHMENT.filE_TYPE = item.filE_TYPE;
    
                    item.filE_ATTACHMENT_TEMPLATE = new CM_ATTACH_FILE_ENTITY();
                    item.filE_ATTACHMENT_TEMPLATE.filE_NAME_OLD = item.filE_NAME_OLD_TEMPLATE;
                    item.filE_ATTACHMENT_TEMPLATE.filE_NAME_NEW = item.filE_NAME_NEW_TEMPLATE;
                    item.filE_ATTACHMENT_TEMPLATE.patH_NEW = item.patH_NEW_TEMPLATE;
                    item.filE_ATTACHMENT_TEMPLATE.filE_SIZE = item.filE_SIZE_TEMPLATE;
                    item.filE_ATTACHMENT_TEMPLATE.filE_TYPE = item.filE_TYPE_TEMPLATE;
    
                    this.pocoststatementproductiondt.editTableAttachFile.resetNoAndPage();
                    this.pocoststatementproductiondt.editTableAttachFile.changePage(0);
                    this.pocoststatementproductiondt.editTableAttachFile.updateParentView();
                }

                // set danh sách hiện hành
                this.pocoststatementproductionlatestdt.editTableAttachFile.setList(res.filter(x => x.coststatemenT_DT_STATUS == 'Y'));
                // set file đính kèm cho từng dòng
                for (const item of this.pocoststatementproductionlatestdt.editTableAttachFile.allData) {
                    item.filE_ATTACHMENT = new CM_ATTACH_FILE_ENTITY();
                    item.filE_ATTACHMENT.filE_NAME_OLD = item.filE_NAME_OLD;
                    item.filE_ATTACHMENT.filE_NAME_NEW = item.filE_NAME_NEW;
                    item.filE_ATTACHMENT.patH_NEW = item.patH_NEW;
                    item.filE_ATTACHMENT.filE_SIZE = item.filE_SIZE;
                    item.filE_ATTACHMENT.filE_TYPE = item.filE_TYPE;
    
                    item.filE_ATTACHMENT_TEMPLATE = new CM_ATTACH_FILE_ENTITY();
                    item.filE_ATTACHMENT_TEMPLATE.filE_NAME_OLD = item.filE_NAME_OLD_TEMPLATE;
                    item.filE_ATTACHMENT_TEMPLATE.filE_NAME_NEW = item.filE_NAME_NEW_TEMPLATE;
                    item.filE_ATTACHMENT_TEMPLATE.patH_NEW = item.patH_NEW_TEMPLATE;
                    item.filE_ATTACHMENT_TEMPLATE.filE_SIZE = item.filE_SIZE_TEMPLATE;
                    item.filE_ATTACHMENT_TEMPLATE.filE_TYPE = item.filE_TYPE_TEMPLATE;
    
                    this.pocoststatementproductionlatestdt.editTableAttachFile.resetNoAndPage();
                    this.pocoststatementproductionlatestdt.editTableAttachFile.changePage(0);
                    this.pocoststatementproductionlatestdt.editTableAttachFile.updateParentView();
                }
            });
        });
    }
//#endregion "EditTable"

//#region ETC
    onViewDetail(item: PO_COSTSTATEMENT_ENTITY): void {
    }

    onSave(): void {
        this.saveInput();
    }

    onSearch(): void {
    }

    onResetSearch(): void {
    }

    onReject(item: PO_COSTSTATEMENT_ENTITY): void {
        this.getDetailByid();
    }

    onReturn(notes: string) {
    }

    onDelete(item: PO_COSTSTATEMENT_ENTITY): void {

    }
    myfile: any[] = [];
  onUpload(event) {
    
    console.log('upload');
    console.log(event);
  }
//#endregion ETC
}
