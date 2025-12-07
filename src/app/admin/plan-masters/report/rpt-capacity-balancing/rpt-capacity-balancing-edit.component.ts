import { Component, Injector, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AsposeServiceProxy, ReportInfo, PL_CAPACITY_BALANCING_ENTITY, SupplierServiceProxy, CapacityBalancingServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { ReportTypeConsts } from '@app/admin/core/ultils/consts/ReportTypeConsts';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { ToolbarComponent } from '@app/admin/core/controls/toolbar/toolbar.component';

@Component({
    templateUrl: './rpt-capacity-balancing-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class RptCapacityBalancingEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<PL_CAPACITY_BALANCING_ENTITY> {
//#region constructor
    constructor(
        injector: Injector,
        private capacityBalancingService: CapacityBalancingServiceProxy,
        private asposeService: AsposeServiceProxy,
        private fileDownloadService: FileDownloadService,
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.pL_CAPACITY_BALANCING_ID = this.getRouteParam('id');
    }

    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: PL_CAPACITY_BALANCING_ENTITY = new PL_CAPACITY_BALANCING_ENTITY();
    filterInput: PL_CAPACITY_BALANCING_ENTITY;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.appToolbar.setRole('RptCapacityBalancing', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('RptCapacityBalancing', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('RptCapacityBalancing', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getDataPages();
                break;
        }
        this.appToolbar.setUiActionEdit(this);
    }

    ngAfterViewInit(): void {
        this.updateView();
    }
//#endregion constructor

//#region CRUD    
    goBack() {
        this.navigatePassParam('/app/admin/rpt-capacity-balancing', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.capacityBalancingService.pL_CAPACITY_BALANCING_ById(this.inputModel.pL_CAPACITY_BALANCING_ID).subscribe(response => {
            // set data
            if (!response) this.goBack()
            this.inputModel = response;

            // set role, view button(detail at region Status Page)
            this.setViewToolBar();

            this.updateView();
        });
    }

    onSave(): void {
        this.saveInput();
    }

    saveInput() {
        if(this.editPageState != EditPageState.viewDetail) {
            if(!this.inputModel.pL_CAPACITY_BALANCING_ID) {
                this.onAdd();
            } else {
                this.onUpdate();
            }
        } 
    }

    onAdd(): void {
        this.saving = true;
        this.capacityBalancingService
        .pL_CAPACITY_BALANCING_Ins(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.inputModel.pL_CAPACITY_BALANCING_ID = res['ID'];
                this.showSuccessMessage(res['ErrorDesc']);
                this.getDataPages();
                this.updateView();
            }
        })
    }

    onUpdate(): void {
        this.saving = true;
        this.capacityBalancingService
        .pL_CAPACITY_BALANCING_Upd(this.inputModel)
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

    onApprove(item: PL_CAPACITY_BALANCING_ENTITY): void{
        this.message.confirm(
            this.l('ApproveWarningMessage', (this.inputModel.pL_CAPACITY_BALANCING_ID)),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.capacityBalancingService
                    .pL_CAPACITY_BALANCING_App(this.inputModel.pL_CAPACITY_BALANCING_ID, this.appSession.user.userName)
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
//#endregion CRUD

//#region Import excel

    exportToExcel() {
        abp.ui.setBusy();

        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        let filterReport = { ...this.inputModel }
        filterReport.maxResultCount = -1;

        reportInfo.parameters = this.GetParamsFromFilter({
            PL_CAPACITY_BALANCING_ID: this.inputModel.pL_CAPACITY_BALANCING_ID,
            YEAR_RATE: this.inputModel.yeaR_RATE,
            FACTORY: this.inputModel.factory,
            PART: this.inputModel.part
        });
        
        reportInfo.pathName = "/PLAN/REPORT/PL_CAPACITY_BALANCING.xlsx";
        reportInfo.storeName = "PL_CAPACITY_BALANCING_Byid";

        this.asposeService
        .getReport(reportInfo)
        .pipe(finalize(() => abp.ui.clearBusy()))
        .subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }
//#endregion Import excel

//#region Status Page
    setViewToolBar(){
        // Button lưu
        if(this.editPageState == EditPageState.viewDetail){
            this.appToolbar.setButtonSaveEnable(false);
        }
        else{
            if(this.inputModel.autH_STATUS != AuthStatusConsts.Approve){
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
        return this.editPageState == EditPageState.viewDetail || this.inputModel.autH_STATUS == 'A';
    }
//#endregion Status Page

}
