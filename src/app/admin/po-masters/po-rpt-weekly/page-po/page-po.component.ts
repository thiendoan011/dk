import { AfterViewInit, Component, Injector, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { ListComponentBase } from "@app/ultilities/list-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { CM_BRANCH_ENTITY, PoReportServiceProxy, PO_REPORT_WEEKLY_PO_DTO, ReportInfo, AsposeServiceProxy } from "@shared/service-proxies/service-proxies";
import { FileDownloadService } from "@shared/utils/file-download.service";
import * as moment from "moment";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'page-po',
	templateUrl: './page-po.component.html',
	encapsulation: ViewEncapsulation.None,
	animations: [ appModuleAnimation() ]
})

export class PagePOComponent extends ListComponentBase<PO_REPORT_WEEKLY_PO_DTO> implements OnInit, AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private poReportService: PoReportServiceProxy
    ) {
        super(injector);
        this.initFilter();
        this.stopAutoUpdateView()
        this.setupValidationMessage()
    }

    _title: string;
    @Input() set title(value: string) {
        this._title = value;
    }
    get title(): string {
        return this._title;
    }

    _list_branch: CM_BRANCH_ENTITY[];
    @Input() set list_branch(value) {
        this._list_branch = value;
    }
//#endregion "Constructor"    

    filterInput: PO_REPORT_WEEKLY_PO_DTO = new PO_REPORT_WEEKLY_PO_DTO();

    ngOnInit(): void {
        this.filterInput.brancH_ID = this.appSession.user.subbrId;
        this.filterInput.exporT_WEEK = moment().week();
        this.filterInput.year = moment().year().toString();
        this.updateView();
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    ngOnChanges(){
        this.updateView();
    }

    refreshTable(){
        this.updateView();
    }

    search(){
        this.showTableLoading();
        this.setSortingForFilterModel(this.filterInputSearch);

        this.poReportService.pO_REPORT_WEEKLY_PO_Search(this.filterInputSearch)
        .pipe(finalize(() => this.hideTableLoading()))
        .subscribe(result => {
            this.dataTable.records = result.items;
            this.dataTable.totalRecordsCount = result.totalCount;
            this.filterInputSearch.totalCount = result.totalCount;
            this.updateView();
        });
    }
    onResetSearch(): void {
        this.filterInput = new PO_REPORT_WEEKLY_PO_DTO();
        this.initDefaultFilter()
        this.changePage(0);
    }  

    exportToExcel() {
        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        this.setSortingForFilterModel(this.filterInputSearch)
        let filterReport = { ...this.filterInputSearch }
        filterReport.maxResultCount = -1;

        //reportInfo.parameters = this.GetParamsFromFilter(filterReport);
        reportInfo.parameters = this.GetParamsFromFilter({
            FRMDATE: this.filterInput.frmdate,
            TODATE: this.filterInput.todate,
            PO_CODES: this.filterInput.pO_CODEs,
            BRANCH_ID: this.filterInput.brancH_ID,
            BRANCH_LOGIN: this.filterInput.brancH_LOGIN
        });

        reportInfo.pathName = "/PO_MASTER/PO_REPORT_WEEKLY_PO_Search.xlsx";
        reportInfo.storeName = "PO_REPORT_WEEKLY_PO_Search";

        this.asposeService.getReport(reportInfo).subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }
}