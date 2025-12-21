import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { PO_ENTITY, AsposeServiceProxy, ReportInfo, PO_TEMPLATE_ENTITY, PRODUCT_PRODUCT_IMPORT_ENTITY, ProductProductServiceProxy, PRODUCT_PRODUCT_ENTITY, } from "@shared/service-proxies/service-proxies";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { finalize } from "rxjs/operators";
import * as moment from "moment";

@Component({
    templateUrl: './product-import.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class ProductImportComponent extends ListComponentBase<PO_ENTITY> implements OnInit, AfterViewInit {
    filterInput: PO_ENTITY = new PO_ENTITY();

    constructor(injector: Injector,
        private productProductService: ProductProductServiceProxy,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy
        ) {
        super(injector);
        this.filterInput.brancH_ID = this.appSession.user.subbrId
    }

    ngOnInit(): void {
        // set role toolbar
        this.appToolbar.setRole('ProductImport', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();
        
        this.filterInput.frmdate = moment();
        this.filterInput.todate = moment();

    }

    ngAfterViewInit(): void {
        this.updateView()
    }

    onExportTemplate(type: string){
        abp.ui.setBusy();
        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        let reportFilter =  {   TYPE: type, 
                                FRMDATE: this.filterInput.frmdate,
                                TODATE: this.filterInput.todate, 
                                USER_LOGIN: this.appSession.user.userName
                            };
        reportInfo.parameters = this.GetParamsFromFilter(reportFilter)

        reportInfo.pathName = '/PRODUCT/PRODUCT_Import.xlsx';
        reportInfo.storeName = 'PRODUCT_PRODUCT_EXPORT_TEMPLATE';
        this.asposeService.
        getReport(reportInfo)
        .pipe( finalize(() => { abp.ui.clearBusy();}))
        .subscribe((res) => {
            this.fileDownloadService.downloadTempFile(res);
        });
    }

    importFilterInput: PRODUCT_PRODUCT_IMPORT_ENTITY = new PRODUCT_PRODUCT_IMPORT_ENTITY();
    xlsStructure = [
        'producT_CODE',
        'producT_NAME',
        'producT_SPECIFI_LENGTH',
        'producT_SPECIFI_WIDTH',
        'producT_SPECIFI_HEIGHT',
        'cartoN_SPECIFI_LENGTH',
        'cartoN_SPECIFI_WIDTH',
        'cartoN_SPECIFI_HEIGHT',
        'producT_CUBE',
        'cartoN_CUBE',
        'm2_PAINT',
        'materiaL_WOOD',
        'materiaL_PLANK',
        'materiaL_VENEER',
        'packinG_TEXTURE',
        'unit',
        'kG_PRODUCT',
        'kG_PHUBI',
        'surfacE_EFFECT',
        'notes',
	];

    onImportInsert(rows: any) {
        abp.ui.setBusy();
        let excelArr = this.xlsRowsToArr(rows, this.xlsStructure, function (obj: PRODUCT_PRODUCT_ENTITY) {
            return obj;
        })
		if (!excelArr) {
			abp.ui.clearBusy();
			return;
		}
        // phần gán data gửi về BE
        this.importFilterInput.makeR_ID = this.appSession.user.userName;
		this.importFilterInput.producT_PRODUCTs = excelArr.map(this.excelMapping);

		if (excelArr && excelArr.length) {
			this.productProductService
				.pRODUCT_PRODUCT_IMPORT_Ins(this.importFilterInput)
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

    onImportUpdate(rows: any) {
        abp.ui.setBusy();
        let excelArr = this.xlsRowsToArr(rows, this.xlsStructure, function (obj: PO_TEMPLATE_ENTITY) {
            return obj;
        })
		if (!excelArr) {
			abp.ui.clearBusy();
			return;
		}
        // phần gán data gửi về BE
        this.importFilterInput.makeR_ID = this.appSession.user.userName;
		this.importFilterInput.producT_PRODUCTs = excelArr.map(this.excelMapping);

		if (excelArr && excelArr.length) {
			this.productProductService
				.pRODUCT_PRODUCT_IMPORT_Upd(this.importFilterInput)
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
