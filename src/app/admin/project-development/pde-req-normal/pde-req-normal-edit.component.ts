import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { UltilityServiceProxy, PDE_GROUP_PRODUCT_NORMAL_ENTITY, PDEGroupProductServiceProxy, TL_USER_ENTITY, TlUserServiceProxy, PDE_GROUP_PRODUCT_STATUS_ENTITY, AsposeServiceProxy, ReportInfo } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { NgForm } from '@angular/forms';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { ToolbarComponent } from '@app/admin/core/controls/toolbar/toolbar.component';
import { CMRejectModalComponent } from '@app/admin/core/controls/common/cm-reject-modal/cm-reject-modal.component';
import { PDETechRequestCusAttachFileComponent } from '../pde-group-product/pde-tech-request-cus-attach-file.component';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { DepartmentConsts } from '@app/ultilities/enum/consts';
import { PDEProgressNormalAttachFileComponent } from '../pde-progress-normal/pde-progress-normal-attach-file.component';
import { PDEInforRequestCusAttachFileComponent } from '../pde-group-product/pde-infor-request-cus-attach-file.component';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { ReportTypeConsts } from '@app/admin/core/ultils/consts/ReportTypeConsts';
import { PDEReqNormalProductEditTableComponent } from './pde-req-normal-product-edittable.component';
import { History2ModalComponent } from '@app/admin/core/modal/history-2-modal/history-2-modal.component';

@Component({
    templateUrl: './pde-req-normal-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PDEReqNormalEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<PDE_GROUP_PRODUCT_NORMAL_ENTITY> {
//#region "Constructor"
    constructor(
        injector: Injector,
        private ultilityService: UltilityServiceProxy,
        private tlUserService: TlUserServiceProxy,
		private asposeService: AsposeServiceProxy,
		private fileDownloadService: FileDownloadService,
        private pdeGroupProductService: PDEGroupProductServiceProxy
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.pdE_GROUP_PRODUCT_NORMAL_ID = this.getRouteParam('id');
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
    inputModel: PDE_GROUP_PRODUCT_NORMAL_ENTITY = new PDE_GROUP_PRODUCT_NORMAL_ENTITY();
    filterInput: PDE_GROUP_PRODUCT_NORMAL_ENTITY;

    get apptoolbar(): ToolbarComponent {
        return this.appToolbar as ToolbarComponent;
    }
    // End Change when clone component
//#endregion "Constructor"

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.appToolbar.setRole('PDEReqNormal', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('PDEReqNormal', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('PDEReqNormal', false, false, false, false, false, false, true, false);
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
        this.navigatePassParam('/app/admin/pde-req-normal', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.pdeGroupProductService.pDE_GROUP_PRODUCT_REQUEST_NORMAL_Byid(this.inputModel.pdE_GROUP_PRODUCT_NORMAL_ID).subscribe(res => {
            this.pdeGroupProductService.pDE_CHECK_STATUS_REQ_NORMAL_ById(this.inputModel.pdE_GROUP_PRODUCT_NORMAL_ID, this.inputModel.grouP_PRODUCT_ID, 'GROUP_PRODUCT_REQ_NORMAL', this.appSession.user.userName).subscribe(res_status => {
                // set data
                if (!res) this.goBack()
                this.inputModel = res;

                this.initCombobox();

                // set role, view button(detail at region Status Page)
                this.statusModel = res_status;
                this.setViewToolBar();

                // set data editTable
                this.setDataEditTables();

                // get history
                this.history_modal.id = this.inputModel.grouP_PRODUCT_ID;
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

        //this.getEditTablesData();

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
        
    }

    onApprove(item: PDE_GROUP_PRODUCT_NORMAL_ENTITY): void{
        this.inputModel.checkeR_ID = this.appSession.user.userName;

    }

    onCompleteEditProduct(){
        this.getDataPages();
        this.updateView();
    }

//#region "EditTable"
    getDataEditTables(){
        // Thông tin phản hồi
        this.inputModel.pdE_REQ_NORMAL_ATTACH_FILEs = this.pdeReqnormalAttachFileEdittable.editTable.allData;
        // Thông tin yêu cầu từ khách
        //this.inputModel.pdE_INFOR_REQUEST_CUS_ATTACH_FILEs = this.pdeInforRequestCusAttachFile.editTable.allData;
        // Bản vẽ kỹ thuật từ khách
        //this.inputModel.pdE_TECH_REQUEST_CUS_ATTACH_FILEs = this.pdeTechRequestCusAttachFile.editTable.allData;
        // Thông tin yêu cầu
        this.inputModel.pdE_NORMAL_PRODUCTs = this.pdeProductEditTable.editTable.allData;
    }
    setDataEditTables(){
        // Thông tin phản hồi
        if (this.inputModel.pdE_REQ_NORMAL_ATTACH_FILEs && this.inputModel.pdE_REQ_NORMAL_ATTACH_FILEs.length > 0) {
            this.pdeReqnormalAttachFileEdittable.editTable.setList(this.inputModel.pdE_REQ_NORMAL_ATTACH_FILEs);
            this.pdeReqnormalAttachFileEdittable.refreshTable();
        }
        // Thông tin yêu cầu từ khách
        // if (this.inputModel.pdE_INFOR_REQUEST_CUS_ATTACH_FILEs && this.inputModel.pdE_INFOR_REQUEST_CUS_ATTACH_FILEs.length > 0) {
        //     this.pdeInforRequestCusAttachFile.editTable.setList(this.inputModel.pdE_INFOR_REQUEST_CUS_ATTACH_FILEs);
        //     this.pdeInforRequestCusAttachFile.refreshTable();
        // }
        // Bản vẽ kỹ thuật từ khách
        // if (this.inputModel.pdE_TECH_REQUEST_CUS_ATTACH_FILEs && this.inputModel.pdE_TECH_REQUEST_CUS_ATTACH_FILEs.length > 0) {
        //     this.pdeTechRequestCusAttachFile.editTable.setList(this.inputModel.pdE_TECH_REQUEST_CUS_ATTACH_FILEs);
        //     this.pdeTechRequestCusAttachFile.refreshTable();
        // }
        // Thông tin yêu cầu
        if (this.inputModel.pdE_NORMAL_PRODUCTs && this.inputModel.pdE_NORMAL_PRODUCTs.length > 0) {
            this.pdeProductEditTable.editTable.setList(this.inputModel.pdE_NORMAL_PRODUCTs);
        }
    }
    // Thông tin phản hồi
    @ViewChild('pdeReqnormalAttachFileEdittable') pdeReqnormalAttachFileEdittable: PDEProgressNormalAttachFileComponent;
    // Thông tin yêu cầu từ khách
    //@ViewChild('pdeInforRequestCusAttachFile') pdeInforRequestCusAttachFile: PDEInforRequestCusAttachFileComponent;
    // Bản vẽ kỹ thuật từ khách
    //@ViewChild('pdeTechRequestCusAttachFile') pdeTechRequestCusAttachFile: PDETechRequestCusAttachFileComponent;
    // Thông tin yêu cầu
    @ViewChild('pdeProductEditTable') pdeProductEditTable: PDEReqNormalProductEditTableComponent;

//#endregion "EditTable"

//#region Button Flow
    get showAcceptButton(): boolean {
        return this.inputModel.reQ_NORMAL_REQ_STATUS == 'U';
    }
    onAccept(){
        abp.ui.setBusy();
        this.pdeGroupProductService
        .pDE_GROUP_PRODUCT_REQUEST_NORMAL_Accept(this.inputModel.pdE_GROUP_PRODUCT_NORMAL_ID, this.inputModel.grouP_PRODUCT_ID, this.appSession.user.userName)
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

    // lịch sử xử lý
    @ViewChild('history_modal') history_modal: History2ModalComponent;
    // Không tiếp nhận
    @ViewChild('cmRejectModal') cmRejectModal: CMRejectModalComponent;
    onShowNotAccept(){
        this.cmRejectModal.rejectLogInput.trN_TYPE = 'PDE';
        this.cmRejectModal.rejectLogInput.stage = 'PDE_REQ_NORMAL_SEND';
        this.cmRejectModal.rejectLogInput.trN_ID = this.inputModel.pdE_GROUP_PRODUCT_NORMAL_ID;
        this.cmRejectModal.show();
    }

    onSelectNotAccept(){
        this.getDataPages();
        this.updateView();
    }

    getRecommendReject(){
        this.getDataPages();
        this.updateView();
    }

    // Trả về người tạo
    get showRejectMakertButton(): boolean {
        return this.inputModel.reQ_NORMAL_REQ_STATUS == 'A' && this.isNullOrEmpty(this.inputModel.reQ_NORMAL_PROGRESS_EXACT_MAKER_ID);
    }
    @ViewChild('cmRejectMakerModal') cmRejectMakerModal: CMRejectModalComponent;
    onRejectMaker(){
        this.cmRejectMakerModal.rejectLogInput.trN_TYPE = 'PDE';
        this.cmRejectMakerModal.rejectLogInput.stage = 'PDE_REQ_NORMAL_REJECT_MAKER';
        this.cmRejectMakerModal.rejectLogInput.trN_ID = this.inputModel.pdE_GROUP_PRODUCT_NORMAL_ID;
        this.cmRejectMakerModal.show();
    }

    // Yêu cầu trả về người tạo
    get showReqRejectMakertButton(): boolean {
        return !this.isNullOrEmpty(this.inputModel.reQ_NORMAL_PROGRESS_EXACT_MAKER_ID);
    }
    onReqRejectMaker(){
        this.cmRejectMakerModal.rejectLogInput.trN_TYPE = 'PDE';
        this.cmRejectMakerModal.rejectLogInput.stage = 'PDE_REQ_NORMAL_REQ_REJECT_MAKER';
        this.cmRejectMakerModal.rejectLogInput.trN_ID = this.inputModel.pdE_GROUP_PRODUCT_NORMAL_ID;
        this.cmRejectMakerModal.show();
    }

    
    users: TL_USER_ENTITY[] = [];
    initCombobox(): void {
        let filter = new TL_USER_ENTITY();
        filter.maxResultCount = -1;
        filter.recorD_STATUS = RecordStatusConsts.Active;
        filter.autH_STATUS = AuthStatusConsts.Approve;
        filter.tlsubbrid = this.inputModel.reQ_NORMAL_REQ_BRANCH_ID;
        filter.deP_ID = this.inputModel.reQ_NORMAL_REQ_DEP_ID;
        filter.level = 'ALL';

        this.tlUserService.tL_USER_COMBOBOX_Search(filter).subscribe(res => {
            this.users = res.items;
            this.updateView();
        });
    }
    get showSendProgressNormal(): boolean {
        return this.statusModel.grouP_PRODUCT_SEND_PROGRESS_NORMAL == '0';
    }
    onSendProgressnormal(){
        abp.ui.setBusy();
        this.pdeGroupProductService
        .pDE_GROUP_PRODUCT_PROGRESS_NORMAL_Send(this.inputModel.pdE_GROUP_PRODUCT_NORMAL_ID, this.inputModel.grouP_PRODUCT_ID ,this.appSession.user.userName, this.inputModel.reQ_NORMAL_PROGRESS_EXACT_MAKER_ID)
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

    get showExportPYC(): boolean {
        return this.inputModel.reQ_NORMAL_REQ_STATUS == 'A';
    }
    onExportPYC(){
        abp.ui.setBusy();
		let reportInfo = new ReportInfo();
		reportInfo.typeExport = ReportTypeConsts.Excel;
        reportInfo.pathName = '/PDE/PDE_GROUP_PRODUCT_REQUEST_NORMAL_EXPORT_PYC.xlsx';
		reportInfo.storeName = 'PDE_GROUP_PRODUCT_REQUEST_NORMAL_EXPORT_PYC';

        let reportFilter = { 
            PDE_GROUP_PRODUCT_NORMAL_ID: this.inputModel.pdE_GROUP_PRODUCT_NORMAL_ID,
            GROUP_PRODUCT_ID: this.inputModel.grouP_PRODUCT_ID, 
            IS_TEMPLATE: 'Y' 
        };
        reportInfo.parameters = this.GetParamsFromFilter(reportFilter)

		this.asposeService
        .getReport(reportInfo)
        .pipe( finalize(() => { abp.ui.clearBusy();}))
        .subscribe((res) => {
			this.fileDownloadService.downloadTempFile(res);
		});
    }

//#endregion Button Flow
 
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
