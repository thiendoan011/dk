import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input } from "@angular/core";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { DASHBOARD_PLAN_DTO, ReportInfo, AsposeServiceProxy, CM_BRANCH_ENTITY } from "@shared/service-proxies/service-proxies";
import { FileDownloadService } from "@shared/utils/file-download.service";
import * as moment from "moment";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'po-report-data-extraction-booking',
	templateUrl: './po-report-data-extraction-booking.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class POReportDataExtractionBookingComponent extends ChangeDetectionComponent implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy
    ) {
        super(injector);
    }

    _inputModel: DASHBOARD_PLAN_DTO;
    @Input() set inputModel(value: DASHBOARD_PLAN_DTO) {
        this._inputModel = value;
    }
    get inputModel(): DASHBOARD_PLAN_DTO {
        return this._inputModel;
    }

    _title: string;
    @Input() set title(value: string) {
        this._title = value;
    }
    get title(): string {
        return this._title;
    }

    _branches: CM_BRANCH_ENTITY[];
    @Input() set branches(value) {
        this._branches = value;
    }

    filterInput: any = {};
//#endregion "Constructor"    

    ngOnInit(): void {
        this.filterInput.brancH_ID = this.appSession.user.subbrId;
        this.filterInput.YEAR = moment().year();
        this.filterInput.WEEK = moment().week();
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

    onchangeFilter(){

    }

    exportToExcel(type: string){
        abp.ui.setBusy();

        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        reportInfo.parameters = this.GetParamsFromFilter({
            BRANCH_ID: this.filterInput.brancH_ID,
            FRM_DATE: this.filterInput.FRM_DATE,
            TO_DATE: this.filterInput.TO_DATE,
            PO_PROCESS: this.filterInput.PO_PROCESS,
            PO_BOOKING_NBE: this.filterInput.PO_BOOKING_NBE,
            TYPE: type
        });
        
        reportInfo.storeName = "PO_REPORT_DATA_EXTRACTRION_BOOKING";
        reportInfo.pathName = "/PO_MASTER/REPORT/REPORT_PO/PO_REPORT_DATA_EXTRACTRION_BOOKING.xlsx";

        this.asposeService
        .getReport(reportInfo)
        .pipe(finalize(() => abp.ui.clearBusy()))
        .subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }
}