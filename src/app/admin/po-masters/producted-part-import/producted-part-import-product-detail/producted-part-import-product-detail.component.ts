import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input } from "@angular/core";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { DASHBOARD_PLAN_DTO, ReportInfo, AsposeServiceProxy, CM_BRANCH_ENTITY, PO_PRODUCTED_PART_DETAIL_PRODUCT_IMPORT_DTO, PO_PRODUCT_PRODUCTED_PART_ENTITY, PoProductedPartDetailServiceProxy } from "@shared/service-proxies/service-proxies";
import { FileDownloadService } from "@shared/utils/file-download.service";
import * as moment from "moment";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'producted-part-import-product-detail',
	templateUrl: './producted-part-import-product-detail.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class ProductedPartImportProductDetailComponent extends DefaultComponentBase implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
        private poProductedPartDetailService: PoProductedPartDetailServiceProxy,
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
        this.filterInput.PRODUCT_STATUS = 'N';
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

    onExportTemplate(){
        this.removeMessage();
        abp.ui.setBusy();
        
        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        reportInfo.parameters = this.GetParamsFromFilter({
            BRANCH_ID: this.filterInput.brancH_ID,
            PRODUCTED_PART_CODE: this.filterInput.PRODUCTED_PART_CODE,
            GROUP_PRODUCT_CODES: this.filterInput.GROUP_PRODUCT_CODES,
            PRODUCT_STATUS: this.filterInput.PRODUCT_STATUS,
            PO_CODES: this.filterInput.PO_CODES
        });
        
        reportInfo.pathName = "/PO_MASTER/PRODUCTED_PART/PO_PRODUCTED_PART_DETAIL_PRODUCT_LOG_IMPORT_Template.xlsx";
        reportInfo.storeName = "PO_PRODUCTED_PART_DETAIL_PRODUCT_LOG_IMPORT_Template";

        this.asposeService
        .getReport(reportInfo)
        .pipe(finalize(() => abp.ui.clearBusy()))
        .subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }

    importFilterInput: PO_PRODUCTED_PART_DETAIL_PRODUCT_IMPORT_DTO = new PO_PRODUCTED_PART_DETAIL_PRODUCT_IMPORT_DTO();
    xlsStructure = [
        'STT',
        'pO_CODE',
        'grouP_PRODUCT_CODE',
        'producT_CODE',
        'producT_NAME',
        'producteD_PART_CODE',
        'producteD_PART_NAME',
        'quantitY_TOTAL',
        'quantitY_USED',
        'quantitY_REMAIN',
        'quantitY_USE',
        'updatE_DT',
        'factory',
        'notes'
	];

    onImportTemplate(rows: any) {
        this.removeMessage();
        abp.ui.setBusy();
        let excelArr = this.xlsRowsToArr(rows, this.xlsStructure, function (obj: PO_PRODUCT_PRODUCTED_PART_ENTITY) {
            return obj;
        })
		if (!excelArr) {
			abp.ui.clearBusy();
			return;
		}
        // phần gán data gửi về BE
        this.importFilterInput.makeR_ID = this.appSession.user.userName;
		this.importFilterInput.pO_PRODUCT_PRODUCTED_PARTs = excelArr.map(this.excelMapping);

		if (excelArr && excelArr.length) {
			this.poProductedPartDetailService
				.pO_PRODUCTED_PART_DETAIL_PRODUCT_LOG_Import(this.importFilterInput)
				.pipe( finalize(() => { abp.ui.clearBusy();}))
                .subscribe((res) => {
                    if(res['Result'] == '-1'){
                        this.showErrorMessage(res['ErrorDesc']);
                    }
                    else{
                        this.showSuccessMessage(res['ErrorDesc']);
                    }
                    this.updateView();
                });
		}
	}
}