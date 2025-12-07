import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { UltilityServiceProxy, PO_GROUP_PRODUCT_ENTITY, PDEGroupProductServiceProxy, TL_USER_ENTITY, TlUserServiceProxy, PDE_GROUP_PRODUCT_STATUS_ENTITY } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { NgForm } from '@angular/forms';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { ToolbarComponent } from '@app/admin/core/controls/toolbar/toolbar.component';
import { PDEProgressTemplateAttachFileComponent } from './pde-progress-template-attach-file.component';
import { DepartmentConsts } from '@app/ultilities/enum/consts';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { PDEProgressTemplatePartEdittableComponent } from './pde-progress-template-part-edittable.component';
import { PDETechRequestCusAttachFileComponent } from '../pde-group-product/pde-tech-request-cus-attach-file.component';
import { PDETechAttachFileComponent } from '../pde-group-product/pde-tech-attach-file.component';
import { PDEReqTemplateProductTemplateEditTableComponent } from './pde-req-template-product-template-edittable.component';
import { PDEInforRequestCusAttachFileComponent } from '../pde-group-product/pde-infor-request-cus-attach-file.component';
import { History2ModalComponent } from '@app/admin/core/modal/history-2-modal/history-2-modal.component';

@Component({
    templateUrl: './pde-progress-template-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PDEProgressTemplateEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<PO_GROUP_PRODUCT_ENTITY> {
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
                this.appToolbar.setRole('PDEProgressTemplate', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('PDEProgressTemplate', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('PDEProgressTemplate', false, false, false, false, false, false, true, false);
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
        this.navigatePassParam('/app/admin/pde-progress-template', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.pdeGroupProductService.pDE_GROUP_PRODUCT_PROGRESS_TEMPLATE_Byid(this.inputModel.grouP_PRODUCT_ID).subscribe(res => {
            this.pdeGroupProductService.cHECK_STATUS_PDE_GROUP_PRODUCT_ById(this.inputModel.grouP_PRODUCT_ID, 'GROUP_PRODUCT_PROGRESS_TEMPLATE', this.appSession.user.userName).subscribe(res_status => {
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
			.pDE_GROUP_PRODUCT_PROGRESS_TEMPLATE_Upd(this.inputModel)
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

//#region "EditTable"
    getDataEditTables(){
        // Thông tin làm mẫu từ bên bộ phận dự án mẫu gửi
        this.inputModel.pdE_REQ_TEMPLATE_ATTACH_FILEs = this.pdeProgressTemplateAttachFileEdittable.editTable.allData;
        /*
        // Thông tin chi tiết báo cáo cho từng công đoạn làm mẫu
        this.inputModel.pdE_PROGRESS_TEMPLATE_PART_EDITATABLEs = this.pdeProgressTemplatePartEdittable.editTable.allData;
        */
        // Thông tin yêu cầu từ khách
        this.inputModel.pdE_TECH_REQUEST_CUS_ATTACH_FILEs = this.pdeTechRequestCusAttachFile.editTable.allData;
        // Bản vẽ kỹ thuật từ khách
        this.inputModel.pdE_INFOR_REQUEST_CUS_ATTACH_FILEs = this.pdeInforRequestCusAttachFile.editTable.allData;
        // Bản vẽ kỹ thuật dũng khanh
        this.inputModel.pdE_TECH_ATTACH_FILEs = this.pdeTechAttachFile.editTable.allData;
        // Danh sách sản phẩm chọn làm mẫu
        this.inputModel.pO_PRODUCT_TEMPLATEs = this.pdeProductTemplateEditTable.editTable.allData;
    }
    setDataEditTables(){
        // Thông tin làm mẫu từ bên bộ phận dự án mẫu gửi
        if (this.inputModel.pdE_REQ_TEMPLATE_ATTACH_FILEs && this.inputModel.pdE_REQ_TEMPLATE_ATTACH_FILEs.length > 0) {
            this.pdeProgressTemplateAttachFileEdittable.editTable.setList(this.inputModel.pdE_REQ_TEMPLATE_ATTACH_FILEs);
            this.pdeProgressTemplateAttachFileEdittable.refreshTable();
        }
        /*
        // Thông tin chi tiết báo cáo cho từng công đoạn làm mẫu
        if (this.inputModel.pdE_PROGRESS_TEMPLATE_PART_EDITATABLEs && this.inputModel.pdE_PROGRESS_TEMPLATE_PART_EDITATABLEs.length > 0) {
            this.pdeProgressTemplatePartEdittable.editTable.setList(this.inputModel.pdE_PROGRESS_TEMPLATE_PART_EDITATABLEs);
            this.pdeProgressTemplatePartEdittable.refreshTable();
        }*/
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
        // Danh sách sản phẩm chọn làm mẫu
        if (this.inputModel.pO_PRODUCT_TEMPLATEs && this.inputModel.pO_PRODUCT_TEMPLATEs.length > 0) {
            this.pdeProductTemplateEditTable.editTable.setList(this.inputModel.pO_PRODUCT_TEMPLATEs);
            this.pdeProductTemplateEditTable.refreshTable();
        }
        // Thông tin chi tiết báo cáo cho từng công đoạn làm mẫu
        if (this.inputModel.pO_PRODUCT_TEMPLATEs && this.inputModel.pO_PRODUCT_TEMPLATEs.length > 0) {
            this.pdeProductTemplate2EditTable.editTable.setList(this.inputModel.pO_PRODUCT_TEMPLATEs);
            this.pdeProductTemplate2EditTable.refreshTable();
        }
    }
    // Thông tin làm mẫu từ bên bộ phận dự án mẫu gửi
    @ViewChild('pdeProgressTemplateAttachFileEdittable') pdeProgressTemplateAttachFileEdittable: PDEProgressTemplateAttachFileComponent;
    // lịch sử xử lý
    @ViewChild('history_modal') history_modal: History2ModalComponent;
    /*
    // Thông tin chi tiết báo cáo cho từng công đoạn làm mẫu
    @ViewChild('pdeProgressTemplatePartEdittable') pdeProgressTemplatePartEdittable: PDEProgressTemplatePartEdittableComponent;
    */
    // Thông tin yêu cầu từ khách
    @ViewChild('pdeInforRequestCusAttachFile') pdeInforRequestCusAttachFile: PDEInforRequestCusAttachFileComponent;
    // Bản vẽ kỹ thuật từ khách
    @ViewChild('pdeTechRequestCusAttachFile') pdeTechRequestCusAttachFile: PDETechRequestCusAttachFileComponent;
    // Bản vẽ kỹ thuật dũng khanh
    @ViewChild('pdeTechAttachFile') pdeTechAttachFile: PDETechAttachFileComponent;
    // Danh sách sản phẩm chọn làm mẫu
    @ViewChild('pdeProductTemplateEditTable') pdeProductTemplateEditTable: PDEReqTemplateProductTemplateEditTableComponent;
    // Thông tin chi tiết báo cáo cho từng công đoạn làm mẫu
    @ViewChild('pdeProductTemplate2EditTable') pdeProductTemplate2EditTable: PDEReqTemplateProductTemplateEditTableComponent;

//#endregion "EditTable"

    onConfirmProgressTemplate(){
        abp.ui.setBusy();
        this.pdeGroupProductService
        .pDE_GROUP_PRODUCT_PROGRESS_TEMPLATE_Confirm(this.inputModel.grouP_PRODUCT_ID ,this.appSession.user.userName)
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
    get showButtonConfirmProgressTemplate(): boolean {
        return this.statusModel.grouP_PRODUCT_CONFIRM_PROGRESS_TEMPLATE == '0';
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
