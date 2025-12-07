import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { PO_ENTITY, AsposeServiceProxy, ReportInfo, } from "@shared/service-proxies/service-proxies";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { finalize } from "rxjs/operators";

@Component({
    templateUrl: './capacity-balancing.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class CapacityBalancingComponent extends ListComponentBase<PO_ENTITY> implements IUiAction<PO_ENTITY>, OnInit, AfterViewInit {
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

    filterInput: any = {};

    ngOnInit(): void {

        this.filterInput.M3_PER_CONT_HT_DK = '2.1';
        this.filterInput.PERCENT_NEED_HT_DK = 90;

        this.filterInput.M3_PER_CONT_PAINT_DK = '5';
        this.filterInput.PERCENT_NEED_PAINT_DK = 90;

        this.filterInput.M3_PER_CONT_HT_HDP = '2.2';
        this.filterInput.PERCENT_NEED_HT_HDP = 90;
        
        this.filterInput.M3_PER_CONT_PAINT_HDP = '5.25';
        this.filterInput.PERCENT_NEED_PAINT_HDP = 90;

    }

    ngAfterViewInit(): void {
        this.updateView()
    }

    exportToExcel() {
        abp.ui.setBusy();

        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        let filterReport = { ...this.filterInputSearch }
        filterReport.maxResultCount = -1;

        reportInfo.parameters = this.GetParamsFromFilter({
            MAKER_ID: this.appSession.user.userName,
            YEAR_RATE: this.filterInput.YEAR_RATE,

            NUMBER_OF_EMPLOYEE_HT_DK: this.filterInput.NUMBER_OF_EMPLOYEE_HT_DK,
            M3_PER_CONT_HT_DK: this.filterInput.M3_PER_CONT_HT_DK,
            PERCENT_NEED_HT_DK: this.filterInput.PERCENT_NEED_HT_DK,
            YEAR_RATE_HT_DK: this.filterInput.YEAR_RATE_HT_DK,
            
            NUMBER_OF_EMPLOYEE_PAINT_DK: this.filterInput.NUMBER_OF_EMPLOYEE_PAINT_DK,
            M3_PER_CONT_PAINT_DK: this.filterInput.M3_PER_CONT_PAINT_DK,
            PERCENT_NEED_PAINT_DK: this.filterInput.PERCENT_NEED_PAINT_DK,
            YEAR_RATE_PAINT_DK: this.filterInput.YEAR_RATE_PAINT_DK,
            
            NUMBER_OF_EMPLOYEE_HT_HDP: this.filterInput.NUMBER_OF_EMPLOYEE_HT_HDP,
            M3_PER_CONT_HT_HDP: this.filterInput.M3_PER_CONT_HT_HDP,
            PERCENT_NEED_HT_HDP: this.filterInput.PERCENT_NEED_HT_HDP,
            YEAR_RATE_HT_HDP: this.filterInput.YEAR_RATE_HT_HDP,
            
            NUMBER_OF_EMPLOYEE_PAINT_HDP: this.filterInput.NUMBER_OF_EMPLOYEE_PAINT_HDP,
            M3_PER_CONT_PAINT_HDP: this.filterInput.M3_PER_CONT_PAINT_HDP,
            PERCENT_NEED_PAINT_HDP: this.filterInput.PERCENT_NEED_PAINT_HDP,
            YEAR_RATE_PAINT_HDP: this.filterInput.YEAR_RATE_PAINT_HDP
        });

        if(this.filterInput.YEAR_RATE == 2024){
            reportInfo.pathName = "/PLAN/REPORT/CAPACITY_BALANCING_2024.xlsx";
        }
        else if(this.filterInput.YEAR_RATE == 2025){
            reportInfo.pathName = "/PLAN/REPORT/CAPACITY_BALANCING_2025.xlsx";
        }
        reportInfo.storeName = "PL_CAPACITY_BALANCING_Export_Excel";

        this.asposeService
        .getReport(reportInfo)
        .pipe(finalize(() => abp.ui.clearBusy()))
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
