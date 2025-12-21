import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { PO_ENTITY, AsposeServiceProxy, ReportInfo, PoMasterServiceProxy, PO_TEMPLATE_MASTER_ENTITY, PO_TEMPLATE_ENTITY, } from "@shared/service-proxies/service-proxies";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { finalize } from "rxjs/operators";
import * as moment from "moment";

@Component({
    templateUrl: './po-import.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class PoImportComponent extends ListComponentBase<PO_ENTITY> implements IUiAction<PO_ENTITY>, OnInit, AfterViewInit {
    filterInput: PO_ENTITY = new PO_ENTITY();

    constructor(injector: Injector,
        private poMasterService      : PoMasterServiceProxy,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy
        ) {
        super(injector);
        this.filterInput.brancH_ID = this.appSession.user.subbrId

        this.initFilter(); // this method will call initDefaultFilter()
    }

    initDefaultFilter() {
        this.filterInput.top = 200
        this.filterInput.brancH_ID = this.appSession.user.subbrId
    }

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiAction(this);
        // set role toolbar
        this.appToolbar.setRole('PoImport', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();
        
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

        reportInfo.pathName = '/PO_MASTER/PO_TEMPLATE.xlsx';
        reportInfo.storeName = 'PO_TEMPLATE_EXPORT';
        this.asposeService.getReport(reportInfo).subscribe((res) => {
            this.fileDownloadService.downloadTempFile(res);
        });
    }

    importFilterInput: PO_TEMPLATE_MASTER_ENTITY = new PO_TEMPLATE_MASTER_ENTITY();
    xlsStructure = [
        'STT',
        'pO_CODE',
        'pO_NAME',
        'brancH_CODE',
        'cusT_PO',
        'r_CODE',
        'silL_CODE',
        'customeR_CODE',
        'custtomeR_OF_CUSTOMER',
        'waybilL_CODE',
        'creatE_DATE',
        'exporT_DATE',
        'harbouR_FROM',
        'qtY_CONT',
        'conT_CODE',
        'harbouR_TO',
        'bookingdt',
        'trougH_CUTTING_DT',
        'sX_CONFIRM_DT',
        'etD_DT',
        'etA_DT',
        'exporT_WEEK',
        'exporT_MONTH',
        'exporT_YEAR',
        'pO_PROCESS',
        'notes',
        'grouP_PRODUCT_CODE',
        'color',
        'noteS_GROUP_PRODUCT',
        'producT_CODE',
        'quantitY_PRODUCT',
        'noteS_PRODUCT'
	];

    onInsertImport(rows: any) {
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
		this.importFilterInput.pO_TEMPLATEs = excelArr.map(this.excelMapping);

		if (excelArr && excelArr.length) {
			this.poMasterService
				.pO_INSERT_Import(this.importFilterInput)
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

    onUpdateImport(rows: any) {
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
		this.importFilterInput.pO_TEMPLATEs = excelArr.map(this.excelMapping);

		if (excelArr && excelArr.length) {
			this.poMasterService
				.pO_UPDATE_Import(this.importFilterInput)
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

    search(): void {
        /*
        this.showTableLoading();

        this.setSortingForFilterModel(this.filterInputSearch);

        this.poMasterService.pO_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
        */
    }

    onAdd(): void {
    }

    onUpdate(item: PO_ENTITY): void {
    }

    onDelete(item: PO_ENTITY): void {
        
    }

    onApprove(item: PO_ENTITY): void {
        
    }

    onViewDetail(item: PO_ENTITY): void {
    }

    onSave(): void {

    }

    onResetSearch(): void {
        this.filterInput = new PO_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
    }

    onchangeFilter(){

    }
}
