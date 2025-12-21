import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, AfterViewInit } from "@angular/core";
import { PO_PRODUCTED_PART_ENTITY, AsposeServiceProxy, ReportInfo, BranchServiceProxy, CM_BRANCH_ENTITY} from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { finalize } from "rxjs/operators";
import * as moment from "moment";

@Component({
    templateUrl: './plan-production-week.component.html',
    animations: [appModuleAnimation()]
})

export class PlanProductionWeekComponent extends ListComponentBase<PO_PRODUCTED_PART_ENTITY> implements OnInit, AfterViewInit {
    constructor(injector: Injector,
        private _branchService: BranchServiceProxy,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy
        ) {
        super(injector);
        this.filterInput.brancH_ID = this.appSession.user.subbrId

        this.initFilter(); // this method will call initDefaultFilter()
    }
    filterInput: any = {};

    ngOnInit(): void {
        this.filterInput.frmdate = moment().startOf('week');
        this.filterInput.todate = moment().endOf('week').add(1, 'w');
        this.filterInput.TYPE = 'part_embryo';
        this.filterInput.YEAR = moment().year().toString();
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
            BRANCH_ID: this.filterInput.brancH_ID,
            FRMDATE: this.filterInput.frmdate,
            TODATE: this.filterInput.todate,
            TYPE: this.filterInput.TYPE
        });
        
        reportInfo.pathName = "/PO_MASTER/PO_RPT_PLAN_WEEK_PRODUCTION.xlsx";
        reportInfo.storeName = "PO_RPT_PLAN_WEEK_PRODUCTION";

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
