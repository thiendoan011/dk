import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { PO_ENTITY, AsposeServiceProxy, ReportInfo, R_TEMPLATE_MASTER_ENTITY, RServiceProxy, R_ENTITY, } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { finalize } from "rxjs/operators";
import * as moment from "moment";

@Component({
    templateUrl: './r-import.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class RImportComponent extends ListComponentBase<PO_ENTITY> implements OnInit, AfterViewInit {
    
    constructor(injector: Injector,
        private rService: RServiceProxy,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy
        ) {
        super(injector);
        this.filterInput.brancH_ID = this.appSession.user.subbrId
    }

    filterInput: PO_ENTITY = new PO_ENTITY();

    ngOnInit(): void {
        this.filterInput.frmdate = moment();
        this.filterInput.todate = moment();
    }

    ngAfterViewInit(): void {
        this.updateView()
    }

    onExportTemplate(type: string){
        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        let reportFilter =  {   TYPE: type, 
                                FRMDATE: this.filterInput.frmdate,
                                TODATE: this.filterInput.todate, 
                                USER_LOGIN: this.appSession.user.userName
                            };
        reportInfo.parameters = this.GetParamsFromFilter(reportFilter)

        if(type == 'INSERT'){
            reportInfo.pathName = '/PO_MASTER/R_TEMPLATE_INS.xlsx';
        }
        else{
            reportInfo.pathName = '/PO_MASTER/R_TEMPLATE_UPD.xlsx';
        }
        reportInfo.storeName = 'R_TEMPLATE_EXPORT';
        this.asposeService.getReport(reportInfo).subscribe((res) => {
            this.fileDownloadService.downloadTempFile(res);
        });
    }

    importFilterInput: R_TEMPLATE_MASTER_ENTITY = new R_TEMPLATE_MASTER_ENTITY();
    xlsStructureIns = [
        'STT',
        'r_NAME',
        'r_TYPE',
        'effectivE_DT',
        'r_REF',
        'r_VERSION',
        'brancH_CODE',
        'customeR_CODE',
        'r_REQUEST_DT',
        'numbeR_OF_DAY_REQUEST'
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
		this.importFilterInput.r_TEMPLATEs = excelArr.map(this.excelMapping);

		if (excelArr && excelArr.length) {
			this.rService
				.r_INS_Import(this.importFilterInput)
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

    xlsStructureUpd = [
        'STT',
        'r_CODE',
        'r_NAME',
        'r_TYPE',
        'effectivE_DT',
        'r_REF',
        'r_VERSION',
        'brancH_CODE',
        'customeR_CODE',
        'requesT_DT'
	];
    onUpdateImport(rows: any) {
        abp.ui.setBusy();
        let excelArr = this.xlsRowsToArr(rows, this.xlsStructureUpd, function (obj: R_ENTITY) {
            return obj;
        })
		if (!excelArr) {
			abp.ui.clearBusy();
			return;
		}
        // phần gán data gửi về BE
        this.importFilterInput.makeR_ID = this.appSession.user.userName;
		this.importFilterInput.r_TEMPLATEs = excelArr.map(this.excelMapping);

		if (excelArr && excelArr.length) {
			this.rService
				.r_UPD_Import(this.importFilterInput)
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
