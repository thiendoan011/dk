import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input } from "@angular/core";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { DASHBOARD_PLAN_DTO, ReportInfo, AsposeServiceProxy, CM_BRANCH_ENTITY } from "@shared/service-proxies/service-proxies";
import { FileDownloadService } from "@shared/utils/file-download.service";
import * as moment from "moment";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'po-report-data-extraction-po-groupproduct-product',
	templateUrl: './po-report-data-extraction-po-groupproduct-product.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class POReportDataExtractionPOGroupproductProductComponent extends ChangeDetectionComponent implements AfterViewInit {
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

    exportToExcel(){
        this.removeMessage();
        abp.ui.setBusy();

        if(!this.isNullOrEmpty(this.filterInput.PO_CODES) && !this.isNullOrEmpty(this.filterInput.GROUP_PRODUCT_CODES)){
            this.showErrorMessage('Bạn chỉ được in báo cáo theo Danh sách mã PO cách nhau bởi dấu phẩy hoặc Danh sách mã hệ hàng cách nhau bởi dấu phẩy! Vui lòng xóa 1 trong 2 điều kiện trước khi In báo cáo');
            abp.ui.clearBusy();
            return;
        }

        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        reportInfo.parameters = this.GetParamsFromFilter({
            BRANCH_ID: this.filterInput.brancH_ID,
            PO_CODES: this.filterInput.PO_CODES,
            GROUP_PRODUCT_CODES: this.filterInput.GROUP_PRODUCT_CODES,
            PO_PROCESS: this.filterInput.PO_PROCESS,
            FRM_DATE: this.filterInput.FRM_DATE,
            TO_DATE: this.filterInput.TO_DATE,
            TYPE: 'NORMAL'
        });

        reportInfo.storeName = "PO_REPORT_DATA_EXTRACTRION_PO_GROUPPRODUCT_PRODUCT";
        reportInfo.pathName = "/PO_MASTER/REPORT/REPORT_PO/PO_REPORT_DATA_EXTRACTRION_PO_GROUPPRODUCT_PRODUCT.xlsx";

        this.asposeService
        .getReport(reportInfo)
        .pipe(finalize(() => abp.ui.clearBusy()))
        .subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }

    exportToExcelAllProcess(){
        this.removeMessage();
        abp.ui.setBusy();

        if(!this.isNullOrEmpty(this.filterInput.PO_CODES) && !this.isNullOrEmpty(this.filterInput.GROUP_PRODUCT_CODES)){
            this.showErrorMessage('Bạn chỉ được in báo cáo theo Danh sách mã PO cách nhau bởi dấu phẩy hoặc Danh sách mã hệ hàng cách nhau bởi dấu phẩy! Vui lòng xóa 1 trong 2 điều kiện trước khi In báo cáo');
            abp.ui.clearBusy();
            return;
        }

        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        reportInfo.parameters = this.GetParamsFromFilter({
            BRANCH_ID: this.filterInput.brancH_ID,
            PO_CODES: this.filterInput.PO_CODES,
            GROUP_PRODUCT_CODES: this.filterInput.GROUP_PRODUCT_CODES,
            PO_PROCESS: this.filterInput.PO_PROCESS,
            FRM_DATE: this.filterInput.FRM_DATE,
            TO_DATE: this.filterInput.TO_DATE,
            TYPE: 'ALLPROCESS'
        });
        
        reportInfo.storeName = "PO_REPORT_DATA_EXTRACTRION_PO_GROUPPRODUCT_PRODUCT";
        reportInfo.pathName = "/PO_MASTER/REPORT/REPORT_PO/PO_REPORT_DATA_EXTRACTRION_PO_GROUPPRODUCT_PRODUCT_ALL_PROCESS.xlsx";

        this.asposeService
        .getReport(reportInfo)
        .pipe(finalize(() => abp.ui.clearBusy()))
        .subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }
}