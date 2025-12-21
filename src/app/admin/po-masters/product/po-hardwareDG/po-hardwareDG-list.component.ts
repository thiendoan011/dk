import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { AsposeServiceProxy, ReportInfo, PoHardwareDGServiceProxy, PO_HARDWAREDG_ENTITY} from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { AuthStatusConsts } from "@app/admin/core/ultils/consts/AuthStatusConsts";
import { IUiActionList } from "@app/ultilities/ui-action-list";

@Component({
    templateUrl: './po-hardwareDG-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class PoHardwareDGListComponent extends ListComponentBase<PO_HARDWAREDG_ENTITY> implements IUiActionList<PO_HARDWAREDG_ENTITY>, OnInit, AfterViewInit {
    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private poHardwareDGService: PoHardwareDGServiceProxy) {
        super(injector);
    }

    filterInput: PO_HARDWAREDG_ENTITY = new PO_HARDWAREDG_ENTITY();

    list_hardwaredg:any = [];

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiActionList(this);
        // set role toolbar
        this.appToolbar.setRole('PoHardwareDG', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();
    }

    ngAfterViewInit(): void {
        this.updateView()
    }

    search(): void {
        this.showTableLoading(); 
        this.setSortingForFilterModel(this.filterInputSearch);

        this.poHardwareDGService.pO_HARDWAREDG_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
    }

    onAdd(): void {
        this.navigatePassParam('/app/admin/po-hardwareDG-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: PO_HARDWAREDG_ENTITY): void {
        this.navigatePassParam('/app/admin/po-hardwareDG-edit', { id: item.hardwaredG_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: PO_HARDWAREDG_ENTITY): void {
        if (item.autH_STATUS == AuthStatusConsts.Approve) {
            this.showErrorMessage(this.l('DeleteFailed'));
            this.updateView()
            return
        }

        this.message.confirm(
            this.l('DeleteWarningMessage', item.hardwaredG_CODE),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.poHardwareDGService.pO_HARDWAREDG_Del(item.hardwaredG_ID)
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
                            this.updateView()
                        });
                }
            }
        );
    }

    onViewDetail(item: PO_HARDWAREDG_ENTITY): void {
        this.navigatePassParam('/app/admin/po-hardwareDG-view', { id: item.hardwaredG_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onResetSearch(): void {
        this.filterInput = new PO_HARDWAREDG_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
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
}
