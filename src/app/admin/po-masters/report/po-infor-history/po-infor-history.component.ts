import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, AfterViewInit } from "@angular/core";
import { AsposeServiceProxy, BranchServiceProxy, CM_BRANCH_ENTITY, PO_INFOR_HISTORY_ENTITY, PoMasterServiceProxy, ReportInfo } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { finalize } from "rxjs/operators";
import { IUiActionList } from "@app/ultilities/ui-action-list";
import { AppConsts } from "@shared/AppConsts";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { FileDownloadService } from "@shared/utils/file-download.service";

@Component({
    templateUrl: './po-infor-history.component.html',
    animations: [appModuleAnimation()]
})

export class POInforHistoryComponent extends ListComponentBase<PO_INFOR_HISTORY_ENTITY> implements IUiActionList<PO_INFOR_HISTORY_ENTITY>, OnInit, AfterViewInit {

//#region constructor
    constructor(injector: Injector,
        private _branchService: BranchServiceProxy,
        private poMasterService      : PoMasterServiceProxy,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy) {
        super(injector);
        this.remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;
        this.initDefaultFilter();
    }
    // root link
    remoteServiceBaseUrl: string;
    filterInput: PO_INFOR_HISTORY_ENTITY = new PO_INFOR_HISTORY_ENTITY();

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiActionList(this);
        // set role toolbar
        this.appToolbar.setRole('POInforHistory', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();
        this.filterInput.brancH_ID = this.appSession.user.subbrId;
    }

    ngAfterViewInit(): void {
        this.updateView()
    }

//#endregion constructor

//#region search and navigation
    search(): void {
        this.showTableLoading(); 

        this.setSortingForFilterModel(this.filterInputSearch);

        this.poMasterService.pO_INFOR_HISTORY_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
    }

    onResetSearch(): void {
        this.filterInput = new PO_INFOR_HISTORY_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
    }

    onAdd(): void {
    }

    onUpdate(item: PO_INFOR_HISTORY_ENTITY): void {
    }

    onViewDetail(item: PO_INFOR_HISTORY_ENTITY): void {
    }

    onDelete(item: PO_INFOR_HISTORY_ENTITY): void {
    }

    exportToExcel(){
        abp.ui.setBusy();

        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        reportInfo.parameters = this.GetParamsFromFilter({
            pO_CODE: this.filterInput.pO_CODE,
            pO_NAME: this.filterInput.pO_NAME,
            brancH_ID: this.filterInput.brancH_ID,
            frM_DATE: this.filterInput.frM_DATE,
            tO_DATE: this.filterInput.tO_DATE
        });
        
        reportInfo.pathName = "/PO_MASTER/REPORT/PO_INFOR_HISTORY_Search.xlsx";
        reportInfo.storeName = "PO_INFOR_HISTORY_Search";

        this.asposeService
        .getReport(reportInfo)
        .pipe(finalize(() => abp.ui.clearBusy()))
        .subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }
//#endregion search and navigation

//#region combobox and default filter

    // call in region constructor
    initDefaultFilter() {
        this.initCombobox();
        // set other filter here
    }
// begin combobox
// edit step 3: search
    initCombobox() {
        let filterCombobox = this.getFillterForCombobox();
        this._branchService.cM_BRANCH_Search(filterCombobox)
        .subscribe(response => {
            this.branches = response.items;
            this.updateView();
        });
    }

// edit step 1: init variable
    branches: CM_BRANCH_ENTITY[];

// edit step 2: handle event
// end combobox

//#endregion combobox and default filter

}
