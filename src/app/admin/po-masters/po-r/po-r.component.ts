import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { PO_ENTITY, AsposeServiceProxy, ReportInfo, } from "@shared/service-proxies/service-proxies";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";

@Component({
    templateUrl: './po-r.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class PoRComponent extends ListComponentBase<PO_ENTITY> implements IUiAction<PO_ENTITY>, OnInit, AfterViewInit {
    filterInput: PO_ENTITY = new PO_ENTITY();

    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy
        ) {
        super(injector);
        this.filterInput.brancH_ID = this.appSession.user.subbrId

        this.initFilter(); // this method will call initDefaultFilter()
    }

    initDefaultFilter() {
        this.filterInput.top = 200
        this.filterInput.brancH_ID = this.appSession.user.subbrId
    }

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiAction(this);
        // set role toolbar
        this.appToolbar.setRole('PoR', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();

    }

    ngAfterViewInit(): void {
        this.updateView()
    }

    exportToExcel() {
        //this.showTableLoading();

        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        let filterReport = { ...this.filterInputSearch }
        filterReport.maxResultCount = -1;

        reportInfo.parameters = this.GetParamsFromFilter({
            MONTH: this.filterInput.exporT_MONTH,
            YEAR: this.filterInput.exporT_YEAR
        });

        reportInfo.pathName = "/PO_MASTER/rpt_R.xlsx";
        reportInfo.storeName = "PO_Gen_R";

        this.asposeService
        .getReportFromTable(reportInfo)
        //.pipe(finalize(() => this.hideTableLoading()))
        .subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }
    search(): void {
        /*
        this.showTableLoading();

        this.setSortingForFilterModel(this.filterInputSearch);

        this.poMasterService.pO_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
        */
    }

    onAdd(): void {
    }

    onUpdate(item: PO_ENTITY): void {
    }

    onDelete(item: PO_ENTITY): void {
        
    }

    onApprove(item: PO_ENTITY): void {
        
    }

    onViewDetail(item: PO_ENTITY): void {
    }

    onSave(): void {

    }

    onResetSearch(): void {
        this.filterInput = new PO_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
    }

    onchangeFilter(){

    }
}
