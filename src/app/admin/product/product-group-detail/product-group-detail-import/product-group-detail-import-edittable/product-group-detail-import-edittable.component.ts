import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input } from "@angular/core";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { DASHBOARD_PLAN_DTO, ReportInfo, AsposeServiceProxy, CM_BRANCH_ENTITY, ProductGroupDetailServiceProxy, PRODUCT_GROUP_DETAIL_IMPORT_DTO, PRODUCT_GROUP_DETAIL_IMPORT_MASTER_DTO } from "@shared/service-proxies/service-proxies";
import { FileDownloadService } from "@shared/utils/file-download.service";
import * as moment from "moment";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'product-group-detail-import-edittable',
	templateUrl: './product-group-detail-import-edittable.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class ProductGroupDetailImportEdittabeComponent extends DefaultComponentBase implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
        private productGroupDetailService: ProductGroupDetailServiceProxy,
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
            PRODUCT_GROUP_DETAILS: this.filterInput.PRODUCT_GROUP_DETAILS
        });
        
        reportInfo.pathName = "/PRODUCT/GROUP_DETAIL/PRODUCT_GROUP_DETAIL_IMPORT_Template.xlsx";
        reportInfo.storeName = "PRODUCT_GROUP_DETAIL_IMPORT_Template";

        this.asposeService
        .getReport(reportInfo)
        .pipe(finalize(() => abp.ui.clearBusy()))
        .subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }

    importFilterInput: PRODUCT_GROUP_DETAIL_IMPORT_MASTER_DTO = new PRODUCT_GROUP_DETAIL_IMPORT_MASTER_DTO();
    xlsStructure = [
        'PRODUCT_GROUP_DETAIL_CODE',
        'PRODUCT_GROUP_DETAIL_NAME',
        'PRODUCT_GROUP_DETAIL_DESCRIPTION',

        'PRODUCT_DETAIL_CODE',
        'PRODUCT_DETAIL_NAME',
        'PRODUCT_DETAIL_DESCRIPTION',
        'PRODUCT_DETAIL_HEIGHT',
        'PRODUCT_DETAIL_WIDTH',
        'PRODUCT_DETAIL_LENGTH',
        'PRODUCT_DETAIL_QUANTITY',
        'QUALITY_REQUIREMENT',
        'MATERIAL_DESCRIPTION',
        'PRODUCT_DETAIL_TYPE',
        'NN_NOTES_WOOD',
        'NN_NOTES_PLANK',

        'MW_TYPE_CODE',
        'MW_TYPE_NAME',
        'MW_TYPE_LOAI_VAT_TU',
        'MW_TYPE_LOAI_NGUYEN_LIEU',
        'MW_TYPE_CONG_DOAN',
        'BO_PHAN',
        'MW_TYPE_QUANTITY'
	];

    onImportTemplate(rows: any) {
        this.removeMessage();
        abp.ui.setBusy();
        let excelArr = this.xlsRowsToArr(rows, this.xlsStructure, function (obj: PRODUCT_GROUP_DETAIL_IMPORT_DTO) {
            return obj;
        })
		if (!excelArr) {
			abp.ui.clearBusy();
			return;
		}
        // phần gán data gửi về BE
        this.importFilterInput.makeR_ID = this.appSession.user.userName;
		this.importFilterInput.producT_GROUP_DETAIL_IMPORTs = excelArr.map(this.excelMapping);

		if (excelArr && excelArr.length) {
			this.productGroupDetailService
				.pRODUCT_GROUP_DETAIL_Import(this.importFilterInput)
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