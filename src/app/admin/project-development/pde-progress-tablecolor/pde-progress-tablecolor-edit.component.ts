import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { UltilityServiceProxy, PO_GROUP_PRODUCT_ENTITY, PDEGroupProductServiceProxy, PDE_GROUP_PRODUCT_STATUS_ENTITY } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { NgForm } from '@angular/forms';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { ToolbarComponent } from '@app/admin/core/controls/toolbar/toolbar.component';
import { PDEProgressTablecolorAttachFileComponent } from './pde-progress-tablecolor-attach-file.component';
import { PDETechRequestCusAttachFileComponent } from '../pde-group-product/pde-tech-request-cus-attach-file.component';
import { PDEInforRequestCusAttachFileComponent } from '../pde-group-product/pde-infor-request-cus-attach-file.component';
import { PDEReqTableColorProductEditTableComponent } from '../pde-req-tablecolor/pde-req-tablecolor-product-edittable.component';
import { History2ModalComponent } from '@app/admin/core/modal/history-2-modal/history-2-modal.component';

@Component({
    templateUrl: './pde-progress-tablecolor-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PDEProgressTablecolorEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<PO_GROUP_PRODUCT_ENTITY> {
//#region "Constructor"
    constructor(
        injector: Injector,
        private ultilityService: UltilityServiceProxy,
        private pdeGroupProductService: PDEGroupProductServiceProxy
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.grouP_PRODUCT_ID = this.getRouteParam('id');
        this.initIsApproveFunct();
    }

    isApproveFunct: boolean;
    initIsApproveFunct(): void {
        this.ultilityService.isApproveFunct(this.getCurrentFunctionId()).subscribe((res) => {
            this.isApproveFunct = res;
        });
    }
    EditPageState = EditPageState;
    editPageState: EditPageState;
    @ViewChild('editForm') editForm: NgForm;

    // Begin Change when clone component
    inputModel: PO_GROUP_PRODUCT_ENTITY = new PO_GROUP_PRODUCT_ENTITY();
    filterInput: PO_GROUP_PRODUCT_ENTITY;

    get apptoolbar(): ToolbarComponent {
        return this.appToolbar as ToolbarComponent;
    }
    // End Change when clone component
//#endregion "Constructor"

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.appToolbar.setRole('PDEProgressTablecolor', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('PDEProgressTablecolor', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('PDEProgressTablecolor', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getDataPages();
                break;
        }
        this.appToolbar.setUiActionEdit(this);
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    goBack() {
        this.navigatePassParam('/app/admin/pde-progress-tablecolor', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.pdeGroupProductService.pDE_GROUP_PRODUCT_PROGRESS_TABLECOLOR_Byid(this.inputModel.grouP_PRODUCT_ID).subscribe(res => {
            this.pdeGroupProductService.cHECK_STATUS_PDE_GROUP_PRODUCT_ById(this.inputModel.grouP_PRODUCT_ID, 'GROUP_PRODUCT_PROGRESS_TABLECOLOR', this.appSession.user.userName).subscribe(res_status => {
                // set data
                if (!res) this.goBack()
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

    onSave(): void {
        abp.ui.setBusy();
        this.inputModel.makeR_ID = this.appSession.user.userName;
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
            if(!this.inputModel.grouP_PRODUCT_ID) {
                this.onAdd();
            } else {
                this.onUpdate();
            }
        } 
    }

    onAdd(): void {
        
    }

    onUpdate(): void {
        this.inputModel.makeR_ID = this.appSession.user.userName;
        this.pdeGroupProductService
			.pDE_GROUP_PRODUCT_PROGRESS_TABLECOLOR_Upd(this.inputModel)
			.pipe(
				finalize(() => {
					abp.ui.clearBusy();
				})
			)
			.subscribe((res) => {
				if (res['Result'] != '0') {
					this.showErrorMessage(res['ErrorDesc']);
				} else {
					this.updateSuccess();
                    this.getDataPages();
				}
			});
    }

    onApprove(item: PO_GROUP_PRODUCT_ENTITY): void{
        this.inputModel.checkeR_ID = this.appSession.user.userName;
    }

    onCompleteEditProduct(){
        this.getDataPages();
        this.updateView();
    }

//#region "EditTable"
    getDataEditTables(){
        // Thông tin báo giá từ bên bộ phận dự án mẫu gửi
        this.inputModel.pdE_REQ_TABLECOLOR_ATTACH_FILEs = this.pdeProgressTablecolorAttachFileEdittable.editTable.allData;
        // Thông tin yêu cầu từ khách
        this.inputModel.pdE_INFOR_REQUEST_CUS_ATTACH_FILEs = this.pdeInforRequestCusAttachFile.editTable.allData;
        // Bản vẽ kỹ thuật từ khách
        // this.inputModel.pdE_TECH_REQUEST_CUS_ATTACH_FILEs = this.pdeTechRequestCusAttachFile.editTable.allData;
        // Danh sách sản phẩm
        this.inputModel.pdE_TABLECOLOR_PRODUCTs = this.pdeProductEditTable.editTable.allData;
    }
    setDataEditTables(){
        // Thông tin báo giá từ bên bộ phận dự án mẫu gửi
        if (this.inputModel.pdE_REQ_TABLECOLOR_ATTACH_FILEs && this.inputModel.pdE_REQ_TABLECOLOR_ATTACH_FILEs.length > 0) {
            this.pdeProgressTablecolorAttachFileEdittable.editTable.setList(this.inputModel.pdE_REQ_TABLECOLOR_ATTACH_FILEs);
            this.pdeProgressTablecolorAttachFileEdittable.refreshTable();
        }
        // Thông tin yêu cầu từ khách
        if (this.inputModel.pdE_INFOR_REQUEST_CUS_ATTACH_FILEs && this.inputModel.pdE_INFOR_REQUEST_CUS_ATTACH_FILEs.length > 0) {
            this.pdeInforRequestCusAttachFile.editTable.setList(this.inputModel.pdE_INFOR_REQUEST_CUS_ATTACH_FILEs);
            this.pdeInforRequestCusAttachFile.refreshTable();
        }
        // Bản vẽ kỹ thuật từ khách
        // if (this.inputModel.pdE_TECH_REQUEST_CUS_ATTACH_FILEs && this.inputModel.pdE_TECH_REQUEST_CUS_ATTACH_FILEs.length > 0) {
        //     this.pdeTechRequestCusAttachFile.editTable.setList(this.inputModel.pdE_TECH_REQUEST_CUS_ATTACH_FILEs);
        //     this.pdeTechRequestCusAttachFile.refreshTable();
        // }
        // Danh sách sản phẩm
        if (this.inputModel.pdE_TABLECOLOR_PRODUCTs && this.inputModel.pdE_TABLECOLOR_PRODUCTs.length > 0) {
            this.pdeProductEditTable.editTable.setList(this.inputModel.pdE_TABLECOLOR_PRODUCTs);
        }
    }
    // Thông tin báo giá từ bên bộ phận dự án mẫu gửi
    @ViewChild('pdeProgressTablecolorAttachFileEdittable') pdeProgressTablecolorAttachFileEdittable: PDEProgressTablecolorAttachFileComponent;
    // lịch sử xử lý
    @ViewChild('history_modal') history_modal: History2ModalComponent;
    // Thông tin yêu cầu từ khách
    @ViewChild('pdeInforRequestCusAttachFile') pdeInforRequestCusAttachFile: PDEInforRequestCusAttachFileComponent;
    // Bản vẽ kỹ thuật từ khách
    // @ViewChild('pdeTechRequestCusAttachFile') pdeTechRequestCusAttachFile: PDETechRequestCusAttachFileComponent;
    // Danh sách sản phẩm
    @ViewChild('pdeProductEditTable') pdeProductEditTable: PDEReqTableColorProductEditTableComponent;

//#endregion "EditTable"

    get showButtonConfirmProgressTablecolor(): boolean {
        return this.statusModel.grouP_PRODUCT_CONFIRM_PROGRESS_TABLECOLOR == '0';
    }
    onConfirmProgressTablecolor(){
        abp.ui.setBusy();
        this.pdeGroupProductService
        .pDE_GROUP_PRODUCT_PROGRESS_TABLECOLOR_Confirm(this.inputModel.grouP_PRODUCT_ID ,this.appSession.user.userName)
        .pipe( finalize(() => { abp.ui.clearBusy(); }) )
        .subscribe((res) => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } 
            else {
                this.showSuccessMessage(res['ErrorDesc']);
                this.getDataPages();
                this.updateView();
            }
        });
    }

    get showCompleteButton(): boolean {
        return this.statusModel.grouP_PRODUCT_REQUEST_TABLECOLOR_COMPLETE == '0';
    }
    onComplete(){
        abp.ui.setBusy();
        this.pdeGroupProductService
        .pDE_GROUP_PRODUCT_REQUEST_TABLECOLOR_Complete(this.inputModel.grouP_PRODUCT_ID, this.appSession.user.userName)
        .pipe( finalize(() => { abp.ui.clearBusy(); }) )
        .subscribe((res) => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } 
            else {
                this.showSuccessMessage(res['ErrorDesc']);
                this.getDataPages();
                this.updateView();
            }
        });
    }

//#region Status Page
    statusModel: PDE_GROUP_PRODUCT_STATUS_ENTITY = new PDE_GROUP_PRODUCT_STATUS_ENTITY();
    setViewToolBar(){
        // Button lưu
        if(this.editPageState == EditPageState.viewDetail){
            this.appToolbar.setButtonSaveEnable(false);
        }
        else{
            if(this.statusModel.disablE_INPUT == '0'){
                this.appToolbar.setButtonSaveEnable(false);
            }
            else{
                this.appToolbar.setButtonSaveEnable(true);
            }
        }
        // Button duyệt

        if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
            this.appToolbar.setButtonApproveEnable(false);
            this.appToolbar.setButtonSaveEnable(false);
        }
    }
    get disableInput(): boolean {
        return this.statusModel.disablE_INPUT == '0';
    }
//#endregion Status Page

//#region Hyperlink
    onViewDetailGroupProduct(){
        window.open("/app/admin/pde-group-product-view;id="+ this.inputModel.grouP_PRODUCT_ID);
    }
//#endregion Hyperlink

}
