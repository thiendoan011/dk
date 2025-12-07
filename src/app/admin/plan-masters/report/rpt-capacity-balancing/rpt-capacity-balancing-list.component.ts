import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { AsposeServiceProxy, ReportInfo, PL_CAPACITY_BALANCING_ENTITY, SupplierServiceProxy, CapacityBalancingServiceProxy } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { IUiActionList } from "@app/ultilities/ui-action-list";
import { AppConsts } from "@shared/AppConsts";

@Component({
    templateUrl: './rpt-capacity-balancing-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class RptCapacityBalancingListComponent extends ListComponentBase<PL_CAPACITY_BALANCING_ENTITY> implements IUiActionList<PL_CAPACITY_BALANCING_ENTITY>, OnInit, AfterViewInit {

//#region constructor
    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private capacityBalancingService: CapacityBalancingServiceProxy) {
        super(injector);
        this.remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;
        this.initDefaultFilter();
    }
    // root link
    remoteServiceBaseUrl: string;
    filterInput: PL_CAPACITY_BALANCING_ENTITY = new PL_CAPACITY_BALANCING_ENTITY();

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiActionList(this);
        // set role toolbar
        this.appToolbar.setRole('RptCapacityBalancing', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();
    }

    ngAfterViewInit(): void {
        this.updateView()
    }

//#endregion constructor

//#region search and navigation
    search(): void {
        this.showTableLoading(); 

        this.setSortingForFilterModel(this.filterInputSearch);

        this.capacityBalancingService.pL_CAPACITY_BALANCING_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
    }

    onResetSearch(): void {
        this.filterInput = new PL_CAPACITY_BALANCING_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
    }

    onAdd(): void {
        this.navigatePassParam('/app/admin/rpt-capacity-balancing-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: PL_CAPACITY_BALANCING_ENTITY): void {
        this.navigatePassParam('/app/admin/rpt-capacity-balancing-edit', { id: item.pL_CAPACITY_BALANCING_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onViewDetail(item: PL_CAPACITY_BALANCING_ENTITY): void {
        this.navigatePassParam('/app/admin/rpt-capacity-balancing-view', { id: item.pL_CAPACITY_BALANCING_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: PL_CAPACITY_BALANCING_ENTITY): void {
        this.message.confirm(
            this.l('DeleteWarningMessage', item.pL_CAPACITY_BALANCING_ID),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.capacityBalancingService.pL_CAPACITY_BALANCING_Del(item.pL_CAPACITY_BALANCING_ID, this.appSession.user.userName)
                    .pipe(finalize(() => { this.saving = false; }))
                    .subscribe((response) => {
                        if (response['Result'] != '0') {
                            this.showErrorMessage(response["ErrorDesc"]);
                        }
                        else {
                            this.showSuccessMessage(this.l('SuccessfullyDeleted'));
                            this.filterInputSearch.totalCount = 0;
                            this.reloadPage();
                        }
                    });
                }
            }
        );
    }

    exportToExcel() {
        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        let filterReport = { ...this.filterInputSearch }
        filterReport.maxResultCount = -1;

        reportInfo.parameters = this.GetParamsFromFilter(filterReport)

        reportInfo.pathName = "/PO_MASTER/rpt_po_master.xlsx";
        reportInfo.storeName = "PO_MASTER_Search";

        this.asposeService.getReport(reportInfo).subscribe(x => {
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
    }

// edit step 1: init variable

// edit step 2: handle event
// end combobox

//#endregion combobox and default filter

}
