import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { UltilityServiceProxy, PDE_GROUP_PRODUCT_NORMAL_ENTITY, PDEGroupProductServiceProxy, TL_USER_ENTITY, TlUserServiceProxy, PDE_GROUP_PRODUCT_STATUS_ENTITY, AsposeServiceProxy, ReportInfo, PO_GROUP_PRODUCT_ENTITY } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { NgForm } from '@angular/forms';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { ToolbarComponent } from '@app/admin/core/controls/toolbar/toolbar.component';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { PDEReqNormalProductEditTableComponent } from '../pde-req-normal/pde-req-normal-product-edittable.component';
import { ReportTypeConsts } from '@app/admin/core/ultils/consts/ReportTypeConsts';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { History2ModalComponent } from '@app/admin/core/modal/history-2-modal/history-2-modal.component';
import { PDEGroupProductModalComponent } from '@app/admin/core/modal/module-project-development/pde-group-product-modal/pde-group-product-modal.component';

@Component({
    templateUrl: './pde-req-normal-create-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PDEReqNormalCreateEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<PDE_GROUP_PRODUCT_NORMAL_ENTITY> {
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
        this.initCombobox();
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

    is_send: boolean = false;

    get apptoolbar(): ToolbarComponent {
        return this.appToolbar as ToolbarComponent;
    }

    get isSend(){
        return this.isDraftOrReject(this.inputModel.reQ_NORMAL_REQ_STATUS) && this.inputModel.pdE_GROUP_PRODUCT_NORMAL_ID;
    }
    // End Change when clone component
//#endregion "Constructor"

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.appToolbar.setRole('PDEReqNormalCreate', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('PDEReqNormalCreate', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('PDEReqNormalCreate', false, false, false, false, false, false, true, false);
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
        this.navigatePassParam('/app/admin/pde-req-normal-create', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.pdeGroupProductService.pDE_GROUP_PRODUCT_NORMAL_CREATE_Byid(this.inputModel.pdE_GROUP_PRODUCT_NORMAL_ID).subscribe(res => {
            this.pdeGroupProductService.cHECK_STATUS_PDE_GROUP_PRODUCT_ById(this.inputModel.grouP_PRODUCT_ID, 'GROUP_PRODUCT_REQ_NORMAL', this.appSession.user.userName).subscribe(res_status => {
                // set data
                if (!res) this.goBack()
                this.inputModel = res;

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

        this.getDataEditTables();

        if(this.editPageState != EditPageState.viewDetail) {
            if(!this.inputModel.pdE_GROUP_PRODUCT_NORMAL_ID) {
                this.onAdd();
            } else {
                this.onUpdate();
            }
        } 
    }

    onAdd(): void {
        this.saving = true;
        this.pdeGroupProductService
        .pDE_GROUP_PRODUCT_NORMAL_Ins(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.inputModel.pdE_GROUP_PRODUCT_NORMAL_ID = res['ID'];
                if(this.is_send){
                    this.sendReq();
                }
                else{
                    this.showSuccessMessage(res['ErrorDesc']);
                    this.getDataPages();
                    this.updateView();
                }
            }
        })
    }

    onUpdate(): void {
        this.saving = true;
        this.pdeGroupProductService
			.pDE_GROUP_PRODUCT_NORMAL_Upd(this.inputModel)
			.pipe(finalize(() => {this.saving = false;}))
			.subscribe((res) => {
				if (res['Result'] != '0') {
					this.showErrorMessage(res['ErrorDesc']);
                    this.updateView();
				} else {
                    if(this.is_send){
                        this.sendReq();
                    }
                    else{
                        this.updateSuccess();
                        this.getDataPages();
                        this.updateView();
                    }
				}
			});
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
        this.inputModel.pdE_NORMAL_PRODUCTs = this.pdeProductEditTable.editTable.allData;
    }
    setDataEditTables(){
        // Thông tin yêu cầu
        if (this.inputModel.pdE_NORMAL_PRODUCTs && this.inputModel.pdE_NORMAL_PRODUCTs.length > 0) {
            this.pdeProductEditTable.editTable.setList(this.inputModel.pdE_NORMAL_PRODUCTs);
        }
    }
    // Thông tin yêu cầu
    @ViewChild('pdeProductEditTable') pdeProductEditTable: PDEReqNormalProductEditTableComponent;

//#endregion "EditTable"

//#region Button Flow

    // lịch sử xử lý
    @ViewChild('history_modal') history_modal: History2ModalComponent;
    
    users: TL_USER_ENTITY[] = [];
    initCombobox(): void {
        let filter = new TL_USER_ENTITY();
        filter.maxResultCount = -1;
        filter.recorD_STATUS = RecordStatusConsts.Active;
        filter.autH_STATUS = AuthStatusConsts.Approve;
        filter.tlsubbrid = this.appSession.user.subbrId;
        filter.deP_ID = this.appSession.user.deP_ID;
        filter.level = 'ALL';

        this.tlUserService.tL_USER_COMBOBOX_Search(filter).subscribe(res => {
            this.users = res.items;
            this.updateView();
        });
    }
    get showSendProgressNormal(): boolean {
        return this.statusModel.grouP_PRODUCT_SEND_PROGRESS_NORMAL == '0';
    }
    onSend(){
        this.is_send = true;
        this.saveInput();
    }

    sendReq(){
        abp.ui.setBusy();
        this.pdeGroupProductService
        .pDE_GROUP_PRODUCT_REQUEST_NORMAL_Send(this.inputModel.pdE_GROUP_PRODUCT_NORMAL_ID, this.inputModel.grouP_PRODUCT_ID ,this.appSession.user.userName)
        .pipe( finalize(() => { abp.ui.clearBusy(); this.is_send = false }) )
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

//#endregion Button Flow
 
//#region Status Page
    statusModel: PDE_GROUP_PRODUCT_STATUS_ENTITY = new PDE_GROUP_PRODUCT_STATUS_ENTITY();
    setViewToolBar(){
        // Button lưu
        if(this.editPageState == EditPageState.viewDetail){
            this.appToolbar.setButtonSaveEnable(false);
        }
        else{
            if(this.isNullOrEmptyOrDraftOrReject(this.inputModel.reQ_NORMAL_REQ_STATUS)){
                this.appToolbar.setButtonSaveEnable(true);
            }
            else{
                this.appToolbar.setButtonSaveEnable(false);
            }
        }
        // Button duyệt

        if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
            this.appToolbar.setButtonApproveEnable(false);
            this.appToolbar.setButtonSaveEnable(false);
        }
    }
    
    get disableInput(): boolean {
        return !this.isNullOrEmptyOrDraftOrReject(this.inputModel.reQ_NORMAL_REQ_STATUS);
    }
//#endregion Status Page

//#region Hyperlink
    onViewDetailGroupProduct(){
        window.open("/app/admin/pde-group-product-view;id="+ this.inputModel.grouP_PRODUCT_ID);
    }
//#endregion Hyperlink

//#region popup
    // Hệ hàng 
    @ViewChild('pdeGroupProductModal') pdeGroupProductModal    : PDEGroupProductModalComponent;
    showGroupProduct(): void {
        this.pdeGroupProductModal.show();
    }

    onSelectGroupProduct(item: PO_GROUP_PRODUCT_ENTITY){
        this.inputModel.grouP_PRODUCT_ID   = item.grouP_PRODUCT_ID;
        this.inputModel.grouP_PRODUCT_NAME = item.grouP_PRODUCT_NAME;
        this.inputModel.grouP_PRODUCT_CODE = item.grouP_PRODUCT_CODE;
        this.inputModel.cuS_VIEW_TEMPLATE_DT = item.cuS_VIEW_TEMPLATE_DT;
        this.inputModel.reQ_NORMAL_REQ_STATUS = 'E';
    }

    // Phòng ban
    @ViewChild('depModal') depModal    : PDEGroupProductModalComponent;
    showDep(): void {
        this.depModal.show();
    }

    onSelectDep(item: PO_GROUP_PRODUCT_ENTITY){
        this.inputModel.reQ_NORMAL_REQ_DEP_ID   = item.deP_ID;
        this.inputModel.reQ_NORMAL_REQ_DEP_CODE = item.deP_CODE;
        this.inputModel.reQ_NORMAL_REQ_DEP_NAME = item.deP_NAME;
    }
//#endregion popup
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


}
