import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { AsposeServiceProxy, ReportInfo, MW_TYPE_TEMPLATE_MASTER_DTO, MWTypeServiceProxy, MW_TYPE_ENTITY, } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { finalize } from "rxjs/operators";
import * as moment from "moment";

@Component({
    templateUrl: './mw-type-import.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class MWTypeImportComponent extends ListComponentBase<MW_TYPE_ENTITY> implements OnInit, AfterViewInit {
    
    constructor(injector: Injector,
        private mwTypeService: MWTypeServiceProxy,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy
        ) {
        super(injector);
        this.filterInput.brancH_ID = this.appSession.user.subbrId
    }

    filterInput: MW_TYPE_ENTITY = new MW_TYPE_ENTITY();

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
            reportInfo.pathName = '/MATERIAL/MW_TYPE/MW_TYPE_TEMPLATE_INS.xlsx';
        }
        else{
            reportInfo.pathName = '/MATERIAL/MW_TYPE/MW_TYPE_TEMPLATE_UPD.xlsx';
        }
        reportInfo.storeName = 'MW_TYPE_TEMPLATE_EXPORT';
        this.asposeService.getReport(reportInfo).subscribe((res) => {
            this.fileDownloadService.downloadTempFile(res);
        });
    }

    importFilterInput: MW_TYPE_TEMPLATE_MASTER_DTO = new MW_TYPE_TEMPLATE_MASTER_DTO();
    xlsStructureIns = [
        'STT',
        'MW_GROUP_CODE',
        'MW_TYPE_NAME',
        'MW_HEIGHT',
        'MW_WIDTH',
        'MW_LENGTH',
        'MW_TYPE_PKT_CODE',
        'MW_TYPE_PKT_NAME',
        'IS_IMPORTANT',
        'UNIT_NAME',
        'URL_IMAGE_MAIN',
        'NOTES_MASTER',
        'SUP_CODE',
        'PRICE',
        'IS_CURRENT_NAME',
        'NOTES'
	];

    onInsertImport(rows: any) {
        abp.ui.setBusy();
        let excelArr = this.xlsRowsToArr(rows, this.xlsStructureIns, function (obj: MW_TYPE_ENTITY) {
            return obj;
        })
		if (!excelArr) {
			abp.ui.clearBusy();
			return;
		}
        // phần gán data gửi về BE
        this.importFilterInput.makeR_ID = this.appSession.user.userName;
		this.importFilterInput.mW_TYPE_TEMPLATEs = excelArr.map(this.excelMapping);

		if (excelArr && excelArr.length) {
			this.mwTypeService
				.mW_TYPE_INS_Import(this.importFilterInput)
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
        'MW_SUPPLIER_PRICE_ID',
        'MW_GROUP_CODE',
        'MW_TYPE_CODE',
        'MW_TYPE_NAME',
        'MW_HEIGHT',
        'MW_WIDTH',
        'MW_LENGTH',
        'MW_TYPE_PKT_CODE',
        'MW_TYPE_PKT_NAME',
        'IS_IMPORTANT',
        'UNIT_NAME',
        'URL_IMAGE_MAIN',
        'NOTES_MASTER',
        'SUP_CODE',
        'PRICE',
        'IS_CURRENT_NAME',
        'NOTES'
	];
    onUpdateImport(rows: any) {
        abp.ui.setBusy();
        let excelArr = this.xlsRowsToArr(rows, this.xlsStructureUpd, function (obj: MW_TYPE_ENTITY) {
            return obj;
        })
		if (!excelArr) {
			abp.ui.clearBusy();
			return;
		}
        // phần gán data gửi về BE
        this.importFilterInput.makeR_ID = this.appSession.user.userName;
		this.importFilterInput.mW_TYPE_TEMPLATEs = excelArr.map(this.excelMapping);

		if (excelArr && excelArr.length) {
			this.mwTypeService
				.mW_TYPE_UPD_Import(this.importFilterInput)
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
