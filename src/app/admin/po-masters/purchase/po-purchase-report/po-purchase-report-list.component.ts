import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { AsposeServiceProxy, ReportInfo, PO_PURCHASE_ENTITY, SupplierServiceProxy } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { IUiActionList } from "@app/ultilities/ui-action-list";
import { AppConsts } from "@shared/AppConsts";

@Component({
    templateUrl: './po-purchase-report-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class POPurchaseReportListComponent extends ListComponentBase<PO_PURCHASE_ENTITY> implements OnInit, AfterViewInit {

//#region constructor
    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private supplierService: SupplierServiceProxy) {
        super(injector);
        this.remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;
        this.initDefaultFilter();
    }
    // root link
    remoteServiceBaseUrl: string;
    filterInput: PO_PURCHASE_ENTITY = new PO_PURCHASE_ENTITY();

    ngOnInit(): void {
        
    }

    ngAfterViewInit(): void {
        this.updateView()
    }

//#endregion constructor

//#region search and navigation

    onResetSearch(): void {
        this.filterInput = new PO_PURCHASE_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
    }

    onExportReport(){
        let reportInfo = new ReportInfo();
		reportInfo.typeExport = ReportTypeConsts.Excel;

        let reportFilter =  {   FRMDATE: this.filterInput.frmdate, 
                                TODATE: this.filterInput.todate,
                                USER_LOGIN: this.appSession.user.userName
                            };
        reportInfo.parameters = this.GetParamsFromFilter(reportFilter)

		reportInfo.pathName = '/PO_MASTER/PO_PURCHASE_ORDERS_RPT.xlsx';
		reportInfo.storeName = 'PO_PURCHASE_ORDERS_RPT';
		this.asposeService.getReport(reportInfo).subscribe((res) => {
			this.fileDownloadService.downloadTempFile(res);
		});
    }
//#endregion search and navigation

//#region combobox and default filter

    // call in region constructor
    initDefaultFilter() {
        this.initCombobox();
        // set other filter here
    }
// begin combobox
// edit step 3: search
    initCombobox() {
        let filterCombobox = this.getFillterForCombobox();
    }

// edit step 1: init variable

// edit step 2: handle event
// end combobox

//#endregion combobox and default filter

}
