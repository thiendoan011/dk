import { Component, Injector, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AsposeServiceProxy, ReportInfo, TT_LEAVE_ENTITY, SupplierServiceProxy, LeaveServiceProxy, TL_USER_ENTITY, TlUserServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { ReportTypeConsts } from '@app/admin/core/ultils/consts/ReportTypeConsts';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { ToolbarComponent } from '@app/admin/core/controls/toolbar/toolbar.component';
import * as moment from 'moment';
import { TTHistoryModalComponent } from '@app/admin/core/modal/module-time-tracking/tt-history-modal/tt-history-modal.component';
import { TTRejectModalComponent } from '@app/admin/core/modal/module-time-tracking/tt-reject_modal/tt-reject-modal.component';

@Component({
    templateUrl: './leave-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class TTLeaveEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<TT_LEAVE_ENTITY> {
//#region constructor
    constructor(
        injector: Injector,
        private leaveService: LeaveServiceProxy,
        private tlUserService: TlUserServiceProxy,
        private asposeService: AsposeServiceProxy,
        private fileDownloadService: FileDownloadService,
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.leavE_ID = this.getRouteParam('id');
        this.initDefaultFilter();
    }

    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: TT_LEAVE_ENTITY = new TT_LEAVE_ENTITY();
    filterInput: TT_LEAVE_ENTITY;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.appToolbar.setRole('TTLeave', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.initDefaultValue();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('TTLeave', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('TTLeave', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getDataPages();
                break;
        }
        this.appToolbar.setUiActionEdit(this);
    }

    initDefaultValue(){
        this.inputModel.brancH_CREATE = this.appSession.user.subbrId;
        this.inputModel.brancH_CREATE_NAME = this.appSession.user.branch.brancH_NAME;
        this.inputModel.brancH_ID = this.appSession.user.subbrId;
        this.inputModel.brancH_NAME = this.appSession.user.branch.brancH_NAME;

        this.inputModel.deP_CREATE = this.appSession.user.deP_ID;
        this.inputModel.deP_CREATE_NAME = this.appSession.user.deP_NAME;
        this.inputModel.deP_ID = this.appSession.user.deP_ID;
        this.inputModel.deP_NAME = this.appSession.user.deP_NAME;

        this.inputModel.useR_LEAVE_ID = this.appSession.user.userName;
        this.inputModel.leavE_DT = moment();
        this.is_enable_save = 'Y';
    }

    ngAfterViewInit(): void {
        this.updateView();
    }
//#endregion constructor

//#region CRUD    
    goBack() {
        this.navigatePassParam('/app/admin/leave', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.leaveService.tT_LEAVE_ById(this.inputModel.leavE_ID).subscribe(response => {
            this.leaveService.tT_LEAVE_Permission(this.inputModel.leavE_ID, this.appSession.user.userName).subscribe(res_per => {
                // set data
                if (!response) this.goBack()
                this.inputModel = response;

                // set role, view button(detail at region Status Page)
                if(res_per['Result'] == '-1'){
                    this.showErrorMessage('Lỗi phân quyền! Vui lòng liên hệ IT để được hỗ trợ');
                }
                this.setViewToolBar(res_per['IS_ENABLE_SAVE'], res_per['IS_ENABLE_APP'], res_per['IS_ENABLE_REJECT']);

                // lịch sử xử lý
                this.history_modal.getDetail();

                this.updateView();
            });
        });
    }

    onSave(): void {
        this.saveInput();
    }

    saveInput() {
        if(this.editPageState != EditPageState.viewDetail) {
            if(!this.inputModel.leavE_ID) {
                this.onAdd();
            } else {
                this.onUpdate();
            }
        } 
    }

    onAdd(): void {
        this.saving = true;
        this.leaveService
        .tT_LEAVE_Ins(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.inputModel.leavE_ID = res['ID'];
                this.showSuccessMessage(res['ErrorDesc']);
                this.getDataPages();
                this.updateView();
            }
        })
    }

    onUpdate(): void {
        this.saving = true;
        this.leaveService
        .tT_LEAVE_Upd(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe((res) => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.updateSuccess();
                this.getDataPages();
                this.updateView();
            }
        });
    }

    onSendAppr(): void {
        this.saving = true;
        this.inputModel.iS_SEND_APPR = 'Y';
        this.leaveService
        .tT_LEAVE_Upd(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe((res) => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.showSuccessMessage(res['ErrorDesc']);
                this.getDataPages();
                this.updateView();
            }
        });
    }

    onApprove(item: TT_LEAVE_ENTITY): void{
        this.message.confirm(
            this.l('ApproveWarningMessage', ('Đơn xin nghỉ của user: ' + this.inputModel.useR_LEAVE_ID)),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.leaveService
                    .tT_LEAVE_App(this.inputModel.leavE_ID, this.appSession.user.userName)
                    .pipe(finalize(() => {this.saving = false}))
                    .subscribe((res) => {
                        if (res['Result'] != '0') {
                            this.showErrorMessage(res['ErrorDesc']);
                            this.updateView();
                        } 
                        else {
                            this.approveSuccess();
                            this.getDataPages();
                            this.updateView();
                        }
                    });
                }
            }
        );
    }

    onReject(event){
        this.getDataPages();
    }
//#endregion CRUD

//#region Status Page
    is_enable_save: string = 'N';
    is_enable_app: string = 'N';
    is_enable_reject: string = 'N';
    setViewToolBar(is_enable_save: string, is_enable_app: string, is_enable_reject: string){
        // permission
        this.is_enable_save = is_enable_save;
        this.is_enable_app = is_enable_app;
        this.is_enable_reject = is_enable_reject;

        // Button lưu
        if(is_enable_save == 'Y' && EditPageState.edit){
            this.appToolbar.setButtonSaveEnable(true);
        }
        else{
            this.appToolbar.setButtonSaveEnable(false);
        }

        // Button duyệt
        if (is_enable_app == 'Y' && this.editPageState == EditPageState.viewDetail) {
            this.appToolbar.setButtonApproveEnable(true);
        }
        else{
            this.appToolbar.setButtonApproveEnable(false);
        }
    }

    get disableInput(): boolean {
        return this.editPageState == EditPageState.viewDetail || this.is_enable_save == 'N'
    }
    get rejectInput(): boolean {
        return this.editPageState == EditPageState.viewDetail && this.is_enable_reject == 'Y'
    }
//#endregion Status Page

//#region combobox and default filter

    // call in region constructor
    initDefaultFilter() {
        this.initCombobox();
        // set other filter here
    }
// begin combobox
// edit step 3: search
    initCombobox() {
        // người nộp đơn
        let filter_user = this.getFillterForCombobox();
        filter_user.tlsubbrid = this.appSession.user.subbrId;
        filter_user.deP_ID = this.appSession.user.deP_ID;
        filter_user.level = 'ALL';
        this.tlUserService.tL_USER_COMBOBOX_Search(filter_user).subscribe(res => {
            this.users = res.items;
            this.updateView();
        });
    }

// edit step 1: init variable
    users: TL_USER_ENTITY[] = [];

// edit step 2: handle event
// end combobox

//#endregion combobox and default filter

//#region "EditTable"
    getDataEditTables(){
    }
    setDataEditTables(){
    }

    // lịch sử xử lý
    @ViewChild('history_modal') history_modal: TTHistoryModalComponent;
    // lịch sử trả về
    @ViewChild('reject_modal') reject_modal: TTRejectModalComponent;

//#endregion "EditTable"

    onChangeDate(d1: moment.Moment,d2:moment.Moment){
        this.inputModel.numbeR_OF_DAY_LEAVE = this.datediff(d2, d1) + 1;
        this.updateView();
    }
}
