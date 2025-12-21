import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input } from "@angular/core";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { DASHBOARD_PLAN_DTO, ReportInfo, AsposeServiceProxy, CM_BRANCH_ENTITY } from "@shared/service-proxies/service-proxies";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'plan-production-year-modified-edittable',
	templateUrl: './plan-production-year-modified-edittable.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class PlanProductionYearModifiedEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
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
        this.filterInput.YEAR = '2024';
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

    exportToExcel_Week_Of_Year(){
        abp.ui.setBusy();

        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        reportInfo.parameters = this.GetParamsFromFilter({
            BRANCH_ID: this.filterInput.brancH_ID,
            PO_PROCESS: this.filterInput.pO_PROCESS,
            FRMDATE: this.filterInput.frmdate,
            TODATE: this.filterInput.todate,
            YEAR: this.filterInput.YEAR,
            WEEK: this.filterInput.WEEK
        });

        reportInfo.pathName = "/PO_MASTER/REPORT/PO_RPT_PLAN_WEEK_OF_YEAR_MODIFIED.xlsx";
        reportInfo.storeName = "PO_RPT_PLAN_WEEK_OF_YEAR_MODIFIED";

        this.asposeService
        .getReport(reportInfo)
        .pipe(finalize(() => abp.ui.clearBusy()))
        .subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }
}