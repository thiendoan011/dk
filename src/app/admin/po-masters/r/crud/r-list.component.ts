import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from "@angular/core";
import { RServiceProxy, R_ENTITY, CM_BRANCH_ENTITY, DepartmentServiceProxy, CM_DEPARTMENT_ENTITY, BranchServiceProxy, AsposeServiceProxy, ReportInfo, GROUP_R_ENTITY} from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { finalize } from "rxjs/operators";
import { IUiActionList } from "@app/ultilities/ui-action-list";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { GroupRModalComponent } from "@app/admin/core/modal/module-po/group-r-modal/group-r-modal.component";

@Component({
    templateUrl: './r-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class RListComponent extends ListComponentBase<R_ENTITY> implements IUiActionList<R_ENTITY>, OnInit, AfterViewInit {

//#region constructor
    constructor(
        injector: Injector,
        private _departmentService: DepartmentServiceProxy,
        private _branchService: BranchServiceProxy,
		private asposeService: AsposeServiceProxy,
		private fileDownloadService: FileDownloadService,
        private _rService: RServiceProxy) {
        super(injector);
        this.initDefaultFilter();
    }

    filterInput: R_ENTITY = new R_ENTITY();

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiActionList(this);
        // set role toolbar
        this.appToolbar.setRole('R', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();
    }

    ngAfterViewInit(): void {

    }

//#endregion constructor

//#region search and navigation
    search(): void {
        this.showTableLoading();

        this.setSortingForFilterModel(this.filterInputSearch);

        this._rService.r_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView();
            });
    }

    onResetSearch(): void {
        this.filterInput = new R_ENTITY();
        this.filterInput.brancH_ID = this.appSession.user.subbrId;
        this.filterInput.autH_STATUS = 'U';
        this.changePage(0);
    }

    onAdd(): void {
        this.navigatePassParam('/app/admin/r-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: R_ENTITY): void {
        this.navigatePassParam('/app/admin/r-edit', { id: item.r_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onViewDetail(item: R_ENTITY): void {
        this.navigatePassParam('/app/admin/r-view', { id: item.r_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: R_ENTITY): void {
        this.message.confirm(
            this.l('DeleteWarningMessage', item.r_CODE),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this._rService.r_Del(item.r_ID)
                        .pipe(finalize(() => { this.saving = false; }))
                        .subscribe((response) => {
                            if (response["Result"] != '0') {
                                this.showErrorMessage(response["ErrorDesc"]);
                            }
                            else {
                                this.showSuccessMessage(response["ErrorDesc"]);
                                this.filterInputSearch.totalCount = 0;
                                this.reloadPage();
                            }
                        });
                }
            }
        );
    }
//#endregion search and navigation
    
//#region combobox and default filter

    // call in region constructor
    initDefaultFilter() {
        this.initCombobox();
        // set other filter here
    }

// edit step 3
    initCombobox() {
        let filterCombobox = this.getFillterForCombobox();
        this._branchService.cM_BRANCH_Search(filterCombobox).subscribe(response => {
            this.branches = response.items;
            this.updateView();
        });
        this.onChangeBranch(undefined);
    }

// edit step 1
    departments: CM_DEPARTMENT_ENTITY[];
    branches: CM_BRANCH_ENTITY[];

// edit step 2
    onChangeBranch(branch: CM_BRANCH_ENTITY) {
        if (!branch) {
            branch = { brancH_ID: this.appSession.user.subbrId } as any
        }
        this.filterInput.deP_ID = undefined;
        this.filterInput.deP_NAME = undefined;
        let filterCombobox = this.getFillterForCombobox();
        filterCombobox.brancH_ID = branch.brancH_ID;
        this._departmentService.cM_DEPARTMENT_Search(filterCombobox).subscribe(response => {
            this.departments = response.items;
            this.updateView();
        })
    }

//#endregion combobox and default filter

 //#region popup  
    // hệ hàng 
    @ViewChild('groupRModal') groupRModal: GroupRModalComponent;
    showGroupR():void{
        this.groupRModal.show();
    }
    onSelectGroupR(item: GROUP_R_ENTITY): void {
        this.filterInput.grouP_R_ID = item.grouP_R_ID;
        this.filterInput.grouP_R_CODE = item.grouP_R_CODE;
        this.filterInput.grouP_R_NAME = item.grouP_R_NAME;
        this.updateView();
    }
    deleteGroupR(event) {
        this.filterInput.grouP_R_ID = '';
        this.filterInput.grouP_R_CODE = '';
        this.filterInput.grouP_R_NAME = '';
        this.updateView();
    }
//#endregion popup

    exportToExcel() {
        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        let filterReport = { ...this.filterInputSearch }
        filterReport.maxResultCount = -1;

        reportInfo.parameters = this.GetParamsFromFilter(filterReport)

        reportInfo.pathName = "/PO_MASTER/R_LIST.xlsx";
        reportInfo.storeName = "R_Search";

        this.asposeService.getReport(reportInfo).subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }

    onchangeFilter(){
        this.filterInput.r_REQUEST_DT_FRMDATE = undefined;
        this.filterInput.r_REQUEST_DT_TODATE = undefined;
        this.updateView();
    }
}
