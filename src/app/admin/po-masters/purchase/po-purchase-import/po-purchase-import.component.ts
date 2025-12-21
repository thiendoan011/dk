import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { PO_PURCHASE_ENTITY, AsposeServiceProxy, ReportInfo, R_TEMPLATE_MASTER_ENTITY, RServiceProxy, R_ENTITY, PoPurchaseServiceProxy, } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { finalize } from "rxjs/operators";
import * as moment from "moment";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";

@Component({
    templateUrl: './po-purchase-import.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class POPurchaseImportComponent extends DefaultComponentBase implements OnInit, AfterViewInit {
    
    constructor(injector: Injector,
        private poPurchaseService: PoPurchaseServiceProxy,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy
        ) {
        super(injector);
        this.filterInput.brancH_ID = this.appSession.user.subbrId
    }

    filterInput: PO_PURCHASE_ENTITY = new PO_PURCHASE_ENTITY();

    ngOnInit(): void {
        this.filterInput.frmdate = moment();
        this.filterInput.todate = moment();
    }

    ngAfterViewInit(): void {
        this.updateView()
    }

    onExportTemplate(){
        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        let reportFilter =  {   FRMDATE: this.filterInput.frmdate,
                                TODATE: this.filterInput.todate, 
                                USER_LOGIN: this.appSession.user.userName
                            };
        reportInfo.parameters = this.GetParamsFromFilter(reportFilter)
		reportInfo.pathName = '/PO_MASTER/PO_PURCHASE_ORDER_TEMPLATE.xlsx';
		reportInfo.storeName = 'PO_PURCHASE_Search';
        this.asposeService.getReport(reportInfo).subscribe((res) => {
            this.fileDownloadService.downloadTempFile(res);
        });
    }

    importFilterInput: PO_PURCHASE_ENTITY = new PO_PURCHASE_ENTITY();
    xlsStructureIns = [
		'purchasE_CODE',
		'producT_CODE',
		'hardwarE_NAME',
		'uniT_NAME',
		'quantitY_ORDER',
		'uniT_PRICE',
        'purchasE_NUMBER',
        'notes'
	];

    onInsertImport(rows: any) {
        abp.ui.setBusy();
        let excelArr = this.xlsRowsToArr(rows, this.xlsStructureIns, function (obj: R_ENTITY) {
            return obj;
        })
		if (!excelArr) {
			abp.ui.clearBusy();
			return;
		}
        // phần gán data gửi về BE
        this.importFilterInput.makeR_ID = this.appSession.user.userName;
		this.importFilterInput.pO_PURCHASE_ORDERs = excelArr.map(this.excelMapping);

		if (excelArr && excelArr.length) {
			this.poPurchaseService
				.pO_PURCHASE_ORDER_Import_Multi(this.importFilterInput)
				.pipe( finalize(() => { abp.ui.clearBusy();}))
                .subscribe((res) => {
                    if(res['Result'] == '-1'){
                        this.showErrorMessage(res['ErrorDesc']);
                    }
                    else{
                        this.showSuccessMessage(this.l('ImportSuccessfully'));
                    }
                    this.updateView();
                });
		}
		this.updateView();
	}
}
