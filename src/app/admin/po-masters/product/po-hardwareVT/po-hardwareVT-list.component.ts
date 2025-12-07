import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { AsposeServiceProxy, ReportInfo, PoHardwareVTServiceProxy, PO_HARDWAREVT_ENTITY, PoProductServiceProxy, } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { AuthStatusConsts } from "@app/admin/core/ultils/consts/AuthStatusConsts";
import { IUiActionList } from "@app/ultilities/ui-action-list";
import { AppConsts } from "@shared/AppConsts";

@Component({
    templateUrl: './po-hardwareVT-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class PoHardwareVTListComponent extends ListComponentBase<PO_HARDWAREVT_ENTITY> implements IUiActionList<PO_HARDWAREVT_ENTITY>, OnInit, AfterViewInit {
    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private poProductService: PoProductServiceProxy,
        private poHardwareVTService: PoHardwareVTServiceProxy) {
        super(injector);
        this.remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;
    }
    
    remoteServiceBaseUrl: string;

    filterInput: PO_HARDWAREVT_ENTITY = new PO_HARDWAREVT_ENTITY();

    list_hardwarevt:any = [];

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiActionList(this);
        // set role toolbar
        this.appToolbar.setRole('PoHardwareVT', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();
    }

    ngAfterViewInit(): void {
        this.updateView()
    }

    search(): void {
        this.showTableLoading(); 
        this.setSortingForFilterModel(this.filterInputSearch);

        this.poHardwareVTService.pO_HARDWAREVT_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
    }

    onAdd(): void {
        this.navigatePassParam('/app/admin/po-hardwareVT-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: PO_HARDWAREVT_ENTITY): void {
        this.navigatePassParam('/app/admin/po-hardwareVT-edit', { id: item.hardwarevT_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: PO_HARDWAREVT_ENTITY): void {
        if (item.autH_STATUS == AuthStatusConsts.Approve) {
            this.showErrorMessage(this.l('DeleteFailed'));
            this.updateView()
            return
        }

        this.message.confirm(
            this.l('DeleteWarningMessage', item.hardwarevT_CODE),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.poHardwareVTService.pO_HARDWAREVT_Del(item.hardwarevT_ID)
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

    onViewDetail(item: PO_HARDWAREVT_ENTITY): void {
        this.navigatePassParam('/app/admin/po-hardwareVT-view', { id: item.hardwarevT_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onResetSearch(): void {
        this.filterInput = new PO_HARDWAREVT_ENTITY();
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

    onViewDetailImage(record: PO_HARDWAREVT_ENTITY){
        window.open(this.remoteServiceBaseUrl + record.urls)
    }
}
