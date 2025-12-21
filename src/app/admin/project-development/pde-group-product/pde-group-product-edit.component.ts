import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { PO_GROUP_PRODUCT_ENTITY, UltilityServiceProxy, PDEGroupProductServiceProxy, PDE_GROUP_PRODUCT_STATUS_ENTITY, PO_CUSTOMER_ENTITY, PO_PRODUCT_ENTITY, PDEProductServiceProxy, DepartmentServiceProxy, CM_DEPARTMENT_ENTITY } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { IUiActionRejectExt } from '@app/ultilities/ui-action-re';
import { NgForm } from '@angular/forms';
import { PDEPriceCusAttachFileComponent } from './pde-price-cus-attach-file.component';
import { PDETechAttachFileComponent } from './pde-tech-attach-file.component';
import { PDETechRequestCusAttachFileComponent } from './pde-tech-request-cus-attach-file.component';
import { PDEProductEditTableComponent } from './pde-product-edittable.component';
import { PDEProductTemplateEditTableComponent } from './pde-product-template-edittable.component';
import { PDEInforRequestCusAttachFileComponent } from './pde-infor-request-cus-attach-file.component';
import { History2ModalComponent } from '@app/admin/core/modal/history-2-modal/history-2-modal.component';
import { CMSendWithComboboxModalComponent } from '@app/admin/core/controls/common/cm-send-with-combobox-modal/cm-send-with-combobox-modal.component';
import { ToolbarRejectExtComponent } from '@app/admin/core/controls/toolbar-reject-ext/toolbar-reject-ext.component';
import { PoGroupProductModalComponent } from '@app/admin/core/modal/module-po/po-group-product-modal/po-group-product-modal.component';
import { PoCustomerModalComponent } from '@app/admin/core/modal/module-po/po-customer-modal/po-customer-modal.component';
import { PDEChooseRequestEdittableComponent } from './pde-choose-request-edittable.component';

@Component({
    templateUrl: './pde-group-product-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PDEGroupProductEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionRejectExt<PO_GROUP_PRODUCT_ENTITY> {
//#region "Constructor"    
    constructor(
        injector: Injector,
        private ultilityService: UltilityServiceProxy,
        private departmentService: DepartmentServiceProxy,
        private pdeGroupProductService: PDEGroupProductServiceProxy,
    ) {
        super(injector);

        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.grouP_PRODUCT_ID = this.getRouteParam('id');
        this.initFilter();
        this.initIsApproveFunct();
        this.initCombobox();
    }

    isApproveFunct: boolean;
    initIsApproveFunct(): void {
        this.ultilityService.isApproveFunct(this.getCurrentFunctionId()).subscribe((res) => {
			this.isApproveFunct = res;
		});
    }
    initCombobox(){
        var filter = this.getFillterForCombobox();
        this.departmentService.cM_DEPARTMENT_Search(filter).subscribe((res) => {
            this.combobox_list = res.items;
            this.updateView();
        });
    }
    onDelete(item: PO_GROUP_PRODUCT_ENTITY): void {}
    onViewDetail(item: PO_GROUP_PRODUCT_ENTITY): void {}
    onSearch(): void {}
    onResetSearch(): void {}
    onReject(item: PO_GROUP_PRODUCT_ENTITY): void {}
    onReturn(notes: string) {}
//#endregion "Constructor"  
    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: PO_GROUP_PRODUCT_ENTITY = new PO_GROUP_PRODUCT_ENTITY();
    filterInput: PO_GROUP_PRODUCT_ENTITY;
    
    @ViewChild('editForm') editForm: NgForm;
    // lịch sử xử lý
    @ViewChild('history_modal') history_modal: History2ModalComponent;

    get apptoolbar(): ToolbarRejectExtComponent {
        return this.appToolbar as ToolbarRejectExtComponent;
    }

    get disableInput(): boolean {
        return this.editPageState == EditPageState.viewDetail 
        || this.inputModel.autH_STATUS == 'A';
    }

    get showButtonAppr(): boolean {
        if((this.inputModel.autH_STATUS === 'U')){
            return true;
        }
        else{
            return false;
        }
    }
    get is_group_product_dk(): boolean {
        if (this.inputModel.typE_GROUP_PRODUCT == 'dk' || this.isNullOrEmpty(this.inputModel.typE_GROUP_PRODUCT)) return true;
        else return false;
    }
    
//#region Life Cycle
    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
                this.inputModel.grouP_PRODUCT_STATUS = 'mau';
                this.inputModel.typE_GROUP_PRODUCT = 'dk';
                this.inputModel.usE_REQ_PRICE = 'Y';
                this.inputModel.usE_REQ_TEMPLATE = 'Y';
                this.inputModel.usE_REQ_TABLEHARDWARE = 'Y';
                this.inputModel.usE_REQ_TABLECOLOR = 'Y';
                this.inputModel.usE_REQ_HARDWARE = 'Y';
                this.appToolbar.setRole('PDEGroupProduct', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('PDEGroupProduct', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getPoGroupProduct();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('PDEGroupProduct', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getPoGroupProduct();
                break;
        }
        this.appToolbar.setUiAction(this);
    }
    
    ngAfterViewInit(): void {
        this.updateView();
    }

    goBack() {
        this.navigatePassParam('/app/admin/pde-group-product', null, { filterInput: JSON.stringify(this.filterInput) });
    }
//#endregion Life Cycle
    
    getPoGroupProduct() {
        this.pdeGroupProductService.pO_Group_Product_ById(this.inputModel.grouP_PRODUCT_ID).subscribe(res => {
            this.pdeGroupProductService.cHECK_STATUS_PDE_GROUP_PRODUCT_ById(this.inputModel.grouP_PRODUCT_ID, 'GROUP_PRODUCT', this.appSession.user.userName).subscribe(res_status => {
                // set data
                this.inputModel = res;

                // set role, view button(detail at region Status Page)
                this.statusModel = res_status;
                this.setViewToolBar();

                // set data editTable
                this.setDataEditTables();

                // get history
                this.history_modal.getDetail();
                
                this.updateView(); 
            });
        });
    }

//#region CRUD
    onSave(): void {
        this.saveInput();
    }

    saveInput() {
        if (this.isApproveFunct == undefined) {
            this.showErrorMessage(this.l('PageLoadUndone'));
			this.updateView();
			return;
		}

        this.getDataEditTables();

        if(this.editPageState != EditPageState.viewDetail) {
            this.inputModel.makeR_ID = this.appSession.user.userName;
			this.saving = true;
            if(!this.inputModel.grouP_PRODUCT_ID) {
                if(this.inputModel.typE_GROUP_PRODUCT == 'dk'){
                    this.onAdd();
                }
                else{
                    this.onCustomerAdd();
                }
            } else {
                this.onUpdate();
            }
        } 
    }

    onAdd(): void {
        this.pdeGroupProductService
        .pDE_Group_Product_Ins(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.inputModel.grouP_PRODUCT_ID = res['ID'];
                this.showSuccessMessage(res['ErrorDesc']);
                this.getPoGroupProduct();
                this.updateView();
            }
        })
    }

    onCustomerAdd(): void {
        this.pdeGroupProductService
        .pDE_GROUP_PRODUCT_CUSTOMER_Ins(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.inputModel.grouP_PRODUCT_ID = res['ID'];
                this.showSuccessMessage(res['ErrorDesc']);
                this.getPoGroupProduct();
                this.updateView();
            }
        })
    }

    onUpdate(): void {
        this.updateView();
        this.pdeGroupProductService
			.pDE_Group_Product_Upd(this.inputModel)
			.pipe(finalize(() => {this.saving = false;}))
			.subscribe((res) => {
				if (res['Result'] != '0') {
					this.showErrorMessage(res['ErrorDesc']);
                    this.inputModel.autH_STATUS = AuthStatusConsts.NotApprove;
				} else {
					this.updateSuccess();
                    this.getPoGroupProduct();
                    this.updateView();
				}
			});
    }

    onApprove(item: PO_GROUP_PRODUCT_ENTITY): void {
        this.pdeGroupProductService
			.pO_GROUP_PRODUCT_Appr(this.inputModel.grouP_PRODUCT_ID, this.appSession.user.userName)
			.pipe( finalize(() => { this.saving = false; }) )
            .subscribe((res) => {
                if (res['Result'] != '0') {
                    this.showErrorMessage(res['ErrorDesc']);
                    this.updateView();
                } else {
                    this.showSuccessMessage(res['ErrorDesc']);
                    this.getPoGroupProduct();
                    this.updateView();
                }
            });
    }
//#endregion CRUD

//#region EvenEmitter
    onCompleteChooseProductTempalte(){
        this.getPoGroupProduct();
        this.updateView();
    }

    onChangePDEChooseRequestEdittable(){
        this.getPoGroupProduct();
        this.updateView();
    }
    
//#endregion EvenEmitter

//#region "EditTable"
    getDataEditTables(){
        // Thông tin báo giá cho khách
        this.inputModel.pdE_PRICE_CUS_ATTACH_FILEs = this.pdePriceCusAttachFile.editTable.allData;
        // Thông tin yêu cầu từ khách
        this.inputModel.pdE_INFOR_REQUEST_CUS_ATTACH_FILEs = this.pdeInforRequestCusAttachFile.editTable.allData;
        // Bản vẽ kỹ thuật từ khách
        this.inputModel.pdE_TECH_REQUEST_CUS_ATTACH_FILEs = this.pdeTechRequestCusAttachFile.editTable.allData;
        // Bản vẽ kỹ thuật dũng khanh
        this.inputModel.pdE_TECH_ATTACH_FILEs = this.pdeTechAttachFile.editTable.allData;
        // Danh sách sản phẩm
        this.inputModel.pO_PRODUCTs = this.pdeProductEditTable.editTable.allData;
        // Danh sách sản phẩm chọn làm mẫu
        this.inputModel.pO_PRODUCT_TEMPLATEs = this.pdeProductTemplateEditTable.editTable.allData;
        // Yêu cầu xử lý
        //this.inputModel.coststatemenT_HISTORYs = this.historyEdittable.editTable.allData;
    }
    setDataEditTables(){
        // Thông tin báo giá cho khách
        if (this.inputModel.pdE_PRICE_CUS_ATTACH_FILEs && this.inputModel.pdE_PRICE_CUS_ATTACH_FILEs.length > 0) {
            this.pdePriceCusAttachFile.editTable.setList(this.inputModel.pdE_PRICE_CUS_ATTACH_FILEs);
            this.pdePriceCusAttachFile.refreshTable();
        }
        // Thông tin yêu cầu từ khách
        if (this.inputModel.pdE_INFOR_REQUEST_CUS_ATTACH_FILEs && this.inputModel.pdE_INFOR_REQUEST_CUS_ATTACH_FILEs.length > 0) {
            this.pdeInforRequestCusAttachFile.editTable.setList(this.inputModel.pdE_INFOR_REQUEST_CUS_ATTACH_FILEs);
            this.pdeInforRequestCusAttachFile.refreshTable();
        }
        // Bản vẽ kỹ thuật từ khách
        if (this.inputModel.pdE_TECH_REQUEST_CUS_ATTACH_FILEs && this.inputModel.pdE_TECH_REQUEST_CUS_ATTACH_FILEs.length > 0) {
            this.pdeTechRequestCusAttachFile.editTable.setList(this.inputModel.pdE_TECH_REQUEST_CUS_ATTACH_FILEs);
            this.pdeTechRequestCusAttachFile.refreshTable();
        }
        // Bản vẽ kỹ thuật dũng khanh
        if (this.inputModel.pdE_TECH_ATTACH_FILEs && this.inputModel.pdE_TECH_ATTACH_FILEs.length > 0) {
            this.pdeTechAttachFile.editTable.setList(this.inputModel.pdE_TECH_ATTACH_FILEs);
            this.pdeTechAttachFile.refreshTable();
        }
        // Danh sách sản phẩm
        if (this.inputModel.pO_PRODUCTs.length > 0) {
            this.pdeProductEditTable.editTable.setList(this.inputModel.pO_PRODUCTs);
        }
        // Danh sách sản phẩm chọn làm mẫu
        if (this.inputModel.pO_PRODUCT_TEMPLATEs.length > 0) {
            this.pdeProductTemplateEditTable.editTable.setList(this.inputModel.pO_PRODUCT_TEMPLATEs);
        }
        // Yêu cầu xử lý
        // if (this.inputModel.coststatemenT_HISTORYs && this.inputModel.coststatemenT_HISTORYs.length > 0) {
        //     this.historyEdittable.editTable.setList(this.inputModel.coststatemenT_HISTORYs);
        // }
    }

    // Thông tin báo giá cho khách
    @ViewChild('pdePriceCusAttachFile') pdePriceCusAttachFile: PDEPriceCusAttachFileComponent;
    // Thông tin yêu cầu từ khách
    @ViewChild('pdeInforRequestCusAttachFile') pdeInforRequestCusAttachFile: PDEInforRequestCusAttachFileComponent;
    // Bản vẽ kỹ thuật từ khách
    @ViewChild('pdeTechRequestCusAttachFile') pdeTechRequestCusAttachFile: PDETechRequestCusAttachFileComponent;
    // Bản vẽ kỹ thuật dũng khanh
    @ViewChild('pdeTechAttachFile') pdeTechAttachFile: PDETechAttachFileComponent;
    // Danh sách sản phẩm
    @ViewChild('pdeProductEditTable') pdeProductEditTable: PDEProductEditTableComponent;
    // Danh sách sản phẩm chọn làm mẫu
    @ViewChild('pdeProductTemplateEditTable') pdeProductTemplateEditTable: PDEProductTemplateEditTableComponent;
    // Yêu cầu xử lý
    @ViewChild('pdeChooseRequestEdittable') pdeChooseRequestEdittable: PDEChooseRequestEdittableComponent;

//#endregion "EditTable"


//#region Button Flow
    sendRequestPrice(){
        this.cmSendWithCombobox_SendReq._title = 'Gửi yêu cầu báo giá';
        this.cmSendWithCombobox_SendReq._type = 'PRICE';
        this.cmSendWithCombobox_SendReq.show();
        this.cmSendWithCombobox_SendReq.updateView();
    }

    sendRequestTemplate(){
        this.cmSendWithCombobox_SendReq._title = 'Gửi yêu cầu làm mẫu';
        this.cmSendWithCombobox_SendReq._type = 'TEMPLATE';
        this.cmSendWithCombobox_SendReq.show();
        this.cmSendWithCombobox_SendReq.updateView();
    }
    
    sendRequestTablehardware(){
        this.cmSendWithCombobox_SendReq._title = 'Gửi yêu cầu bảng hardware';
        this.cmSendWithCombobox_SendReq._type = 'TABLEHARDWARE';
        this.cmSendWithCombobox_SendReq.show();
        this.cmSendWithCombobox_SendReq.updateView();
    }

    sendRequestTablecolor(){
        this.cmSendWithCombobox_SendReq._title = 'Gửi yêu cầu bảng màu';
        this.cmSendWithCombobox_SendReq._type = 'TABLECOLOR';
        this.cmSendWithCombobox_SendReq.show();
        this.cmSendWithCombobox_SendReq.updateView();
    }

    sendRequestHardware(){
        this.cmSendWithCombobox_SendReq._title = 'Gửi yêu cầu mua hardware';
        this.cmSendWithCombobox_SendReq._type = 'HARDWARE';
        this.cmSendWithCombobox_SendReq.show();
        this.cmSendWithCombobox_SendReq.updateView();
    }

    onCompleteTempalte(){
        
    }

    onPauseGroupProduct(){
        
    }

    onTransferProduct(){
        abp.ui.setBusy();
        this.pdeGroupProductService
        .pDE_GROUP_PRODUCT_TRANSFER_Product(this.inputModel.grouP_PRODUCT_ID, this.appSession.user.userName)
        .pipe( finalize(() => { abp.ui.clearBusy(); }) )
        .subscribe((res) => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } 
            else {
                this.showSuccessMessage(res['ErrorDesc']);
                this.getPoGroupProduct();
                this.updateView();
            }
        });
    }

//#endregion Button Flow

//#region popup
    @ViewChild('poCusModal') poCusModal: PoCustomerModalComponent;
    showCusModal(): void {
        this.poCusModal.filterInput.recorD_STATUS = RecordStatusConsts.Active;
        this.poCusModal.filterInput.top           = null;
        this.poCusModal.show();
    }

    onSelectCustomer(event: PO_CUSTOMER_ENTITY): void {
        if (event) {
            this.inputModel.customeR_ID   = event.customeR_ID;
            this.inputModel.customeR_NAME = event.customeR_NAME;
            this.updateView();
        }
    }

    @ViewChild('poGroupProductModal') poGroupProductModal    : PoGroupProductModalComponent;
    showGroupProduct(): void {
        this.poGroupProductModal.show();
    }

    onSelectGroupProduct(item: PO_GROUP_PRODUCT_ENTITY){
        this.inputModel.grouP_PRODUCT_PARENT_ID   = item.grouP_PRODUCT_ID;
        this.inputModel.grouP_PRODUCT_PARENT_NAME = item.grouP_PRODUCT_NAME;
    }
    onChangeTypeGroupProduct(){
        this.updateView();
    }

    //popup chọn phòng ban
    @ViewChild('cmSendWithCombobox_SendReq') cmSendWithCombobox_SendReq: CMSendWithComboboxModalComponent;
    combobox_list:CM_DEPARTMENT_ENTITY[] = [];
    onSendReq(event){
        if(event.type == 'PRICE'){
            abp.ui.setBusy();
            this.pdeGroupProductService
            .pDE_GROUP_PRODUCT_REQUEST_PRICE_Send(this.inputModel.grouP_PRODUCT_ID, this.appSession.user.userName, event.value)
            .pipe( finalize(() => { abp.ui.clearBusy(); }) )
            .subscribe((res) => {
                if (res['Result'] != '0') {
                    this.showErrorMessage(res['ErrorDesc']);
                    this.updateView();
                } 
                else {
                    this.showSuccessMessage(res['ErrorDesc']);
                    this.getPoGroupProduct();
                    this.updateView();
                }
            });
        }
        else if(event.type == 'TEMPLATE'){
            abp.ui.setBusy();
            this.pdeGroupProductService
            .pDE_GROUP_PRODUCT_REQUEST_TEMPLATE_Send(this.inputModel.grouP_PRODUCT_ID, this.appSession.user.userName, event.value)
            .pipe( finalize(() => { abp.ui.clearBusy(); }) )
            .subscribe((res) => {
                if (res['Result'] != '0') {
                    this.showErrorMessage(res['ErrorDesc']);
                    this.updateView();
                } 
                else {
                    this.showSuccessMessage(res['ErrorDesc']);
                    this.getPoGroupProduct();
                    this.updateView();
                }
            });
        }
        else if(event.type == 'TABLEHARDWARE'){
            abp.ui.setBusy();
            this.pdeGroupProductService
            .pDE_GROUP_PRODUCT_REQUEST_TABLEHARDWARE_Send(this.inputModel.grouP_PRODUCT_ID, this.appSession.user.userName, event.value)
            .pipe( finalize(() => { abp.ui.clearBusy(); }) )
            .subscribe((res) => {
                if (res['Result'] != '0') {
                    this.showErrorMessage(res['ErrorDesc']);
                    this.updateView();
                } 
                else {
                    this.showSuccessMessage(res['ErrorDesc']);
                    this.getPoGroupProduct();
                    this.updateView();
                }
            });
            
        }
        else if(event.type == 'TABLECOLOR'){
            abp.ui.setBusy();
            this.pdeGroupProductService
            .pDE_GROUP_PRODUCT_REQUEST_TABLECOLOR_Send(this.inputModel.grouP_PRODUCT_ID, this.appSession.user.userName, event.value)
            .pipe( finalize(() => { abp.ui.clearBusy(); }) )
            .subscribe((res) => {
                if (res['Result'] != '0') {
                    this.showErrorMessage(res['ErrorDesc']);
                    this.updateView();
                } 
                else {
                    this.showSuccessMessage(res['ErrorDesc']);
                    this.getPoGroupProduct();
                    this.updateView();
                }
            });
            
        }
        else if(event.type == 'HARDWARE'){
            abp.ui.setBusy();
            this.pdeGroupProductService
            .pDE_GROUP_PRODUCT_REQUEST_HARDWARE_Send(this.inputModel.grouP_PRODUCT_ID, this.appSession.user.userName, event.value)
            .pipe( finalize(() => { abp.ui.clearBusy(); }) )
            .subscribe((res) => {
                if (res['Result'] != '0') {
                    this.showErrorMessage(res['ErrorDesc']);
                    this.updateView();
                } 
                else {
                    this.showSuccessMessage(res['ErrorDesc']);
                    this.getPoGroupProduct();
                    this.updateView();
                }
            });
        }
        else{
            console.log('else condition');
            this.showErrorMessage('Xảy ra lỗi khi gửi yêu cầu! Vui lòng gửi lại yêu cầu hoặc liên hệ phòng IT để được hỗ trợ!')
            this.updateView();
        }
    }
//#endregion popup

//#region Status Page
    statusModel: PDE_GROUP_PRODUCT_STATUS_ENTITY = new PDE_GROUP_PRODUCT_STATUS_ENTITY();
    setViewToolBar(){
        if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
            this.appToolbar.setButtonApproveEnable(false);
            this.appToolbar.setButtonSaveEnable(false);
        }
    }

    get showButtonSendRequestPrice(): boolean {
        return this.statusModel.grouP_PRODUCT_SEND_REQUEST_PRICE == '0';
    }
    get showButtonSendRequestTemplate(): boolean {
        return this.statusModel.grouP_PRODUCT_SEND_REQUEST_TEMPLATE == '0';
    }
    get showButtonOnCompleteTempalte(): boolean {
        return this.statusModel.grouP_PRODUCT_ON_COMPLETE_TEMPALTE == '0';
    }
    get showButtonOnPauseGroupProduct(): boolean {
        return this.statusModel.grouP_PRODUCT_ON_PAUSE_GROUP_PRODUCT == '0';
    }
    get showButtonOnTransferProduct(): boolean {
        return this.statusModel.grouP_PRODUCT_ON_TRANSFER_PRODUCT == '0';
    }
    get showButtonSendRequestTablehardware(): boolean {
        return this.statusModel.grouP_PRODUCT_SEND_REQUEST_TABLEHARDWARE == '0';
    }
    get showButtonSendRequestTablecolor(): boolean {
        return this.statusModel.grouP_PRODUCT_SEND_REQUEST_TABLECOLOR == '0';
    }
    get showButtonSendRequestHardware(): boolean {
        return this.statusModel.grouP_PRODUCT_SEND_REQUEST_HARDWARE == '0';
    }
//#endregion Status Page

//#region Hyperlink
    onViewDetail_Group_PRODUCT_PARENT(){
        window.open("/app/admin/pde-group-product-view;id="+ this.inputModel.grouP_PRODUCT_PARENT_ID);
    }
    onViewDetailCustomer(){
        window.open("/app/admin/po-customer-view;id="+ this.inputModel.customeR_ID);
    }
//#endregion Hyperlink
}
