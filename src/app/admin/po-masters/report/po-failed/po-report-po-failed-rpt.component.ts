import { Injector, Component, OnInit, AfterViewInit } from "@angular/core";
import { AsposeServiceProxy, ReportInfo, BranchServiceProxy, CM_BRANCH_ENTITY} from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { finalize } from "rxjs/operators";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";

@Component({
    templateUrl: './po-report-po-failed-rpt.component.html',
    animations: [appModuleAnimation()]
})

export class POReportPOFailedRptComponent extends DefaultComponentBase implements OnInit, AfterViewInit {
    constructor(injector: Injector,
        private _branchService: BranchServiceProxy,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy
        ) {
        super(injector);
        this.filterInput.brancH_ID = this.appSession.user.subbrId

        this.initDefaultFilter();
    }
    filterInput: any = {};

    ngOnInit(): void {
        
    }

    ngAfterViewInit(): void {
        this.updateView()
    }

    exportToExcel() {
        abp.ui.setBusy();

        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        let filterReport = { ...this.filterInput }
        filterReport.maxResultCount = -1;

        reportInfo.parameters = this.GetParamsFromFilter({
            BRANCH_ID: this.filterInput.brancH_ID,
            FRMDATE: this.filterInput.frmdate,
            TODATE: this.filterInput.todate
        });
        
        reportInfo.pathName = "/PO_MASTER/PO_FAILED/PO_FAILED_RPT.xlsx";
        reportInfo.storeName = "PO_FAILED_RPT";

        this.asposeService
        .getReport(reportInfo)
        .pipe(finalize(() => abp.ui.clearBusy()))
        .subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }

    onchangeFilter(){

    }

//#region combobox and default filter

    // call in region constructor
    initDefaultFilter() {
        this.initCombobox();
        this.filterInput.brancH_ID = this.appSession.user.subbrId;
        // set other filter here
    }
// begin combobox
// edit step 3: search
    initCombobox() {
        let filterCombobox = this.getFillterForCombobox();
        this._branchService.cM_BRANCH_Search(filterCombobox).subscribe(response => {
            this._branches = response.items;
            this.updateView();
        });
    }

// edit step 1: init variable
    _branches: CM_BRANCH_ENTITY[];

// edit step 2: handle event
// end combobox

//#endregion combobox and default filter
}
