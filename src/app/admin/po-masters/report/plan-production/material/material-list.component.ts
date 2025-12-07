import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { AsposeServiceProxy, BranchServiceProxy, CM_BRANCH_ENTITY, R_ENTITY, R_REPORT_DTO, R_TEMPLATE_MASTER_ENTITY, ReportInfo, RServiceProxy } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { finalize } from "rxjs/operators";
import { IUiActionList } from "@app/ultilities/ui-action-list";
import { AppConsts } from "@shared/AppConsts";
import { CoreTableComponent } from "@app/admin/core/controls/common/core-table/core-table.component";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { FileDownloadService } from "@shared/utils/file-download.service";

@Component({
    templateUrl: './material-list.component.html',
    animations: [appModuleAnimation()]
})

export class PORPPMaterialListComponent extends ListComponentBase<R_REPORT_DTO> implements IUiActionList<R_REPORT_DTO>, OnInit, AfterViewInit {

//#region constructor
    constructor(injector: Injector,
        private rService: RServiceProxy,
        private _branchService: BranchServiceProxy,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy) {
        super(injector);
        this.remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;
        this.initDefaultFilter();
    }
    // root link
    remoteServiceBaseUrl: string;
    filterInput: R_REPORT_DTO = new R_REPORT_DTO();

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiActionList(this);
        // set role toolbar
        this.appToolbar.setRole('PORPPMaterial', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();

        this.filterInput.typE_REPORT = 'MATERIAL';
        this.filterInput.brancH_ID = this.appSession.user.subbrId;
    }

    ngAfterViewInit(): void {
        this.updateView()
    }

//#endregion constructor

//#region search and navigation
    search(): void {
        this.showTableLoading(); 

        this.setSortingForFilterModel(this.filterInputSearch);

        this.rService.r_REPORT_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView();
            });
    }

    onResetSearch(): void {
        this.filterInput = new R_REPORT_DTO();
        this.initDefaultFilter()
        this.changePage(0);
    }

    onAdd(): void {
    }

    onUpdate(item: R_REPORT_DTO): void {
        this.navigatePassParam('/app/admin/porpp-material-edit', { id: item.r_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onViewDetail(item: R_REPORT_DTO): void {
        this.navigatePassParam('/app/admin/porpp-material-view', { id: item.r_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: R_REPORT_DTO): void {
        
    }

    @ViewChild("coreTable") coreTable: CoreTableComponent<R_REPORT_DTO>;
    name(fieldName: string, index: number): string {
        return `${fieldName}-${index}-${this.coreTable}`;
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
        this._branchService.cM_BRANCH_Search(filterCombobox).subscribe(response => {
            this.branches = response.items;
            this.updateView();
        });
    }

// edit step 1: init variable
    branches: CM_BRANCH_ENTITY[];

// edit step 2: handle event
// end combobox

//#endregion combobox and default filter

    onExportTemplate(type: string){
        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        let reportFilter =  {   TYPE: type, 
                                FRMDATE: this.filterInput.r_REQUEST_DT_FRMDATE,
                                TODATE: this.filterInput.r_REQUEST_DT_TODATE, 
                                BRANCH_ID: this.filterInput.brancH_ID, 
                                R_CODE: this.filterInput.r_CODE, 
                                R_NAME: this.filterInput.r_NAME, 
                                USER_LOGIN: this.appSession.user.userName
                            };
        reportInfo.parameters = this.GetParamsFromFilter(reportFilter)

        reportInfo.pathName = '/R/R_PLAN_PRODUCTION_UPD_IMPORT_MATERIAL.xlsx';
        reportInfo.storeName = 'R_PLAN_PRODUCTION_TEMPLATE_EXPORT';
        this.asposeService.getReport(reportInfo).subscribe((res) => {
            this.fileDownloadService.downloadTempFile(res);
        });
    }

    importFilterInput: R_TEMPLATE_MASTER_ENTITY = new R_TEMPLATE_MASTER_ENTITY();
    xlsStructure = [
        'STT',
        'r_CODE',
        'r_NAME',

        'warehousE_MATERIAL_EXACT_DT',
        'warehousE_MATERIAL_STATUS',
        'warehousE_MATERIAL_SUBJECTIVE_REASONS',
        'warehousE_MATERIAL_OBJECTIVE_REASONS',
        'warehousE_MATERIAL_REMEDIATION',

        'warehousE_STRUCTURE_EXACT_DT',
        'warehousE_STRUCTURE_STATUS',
        'warehousE_STRUCTURE_SUBJECTIVE_REASONS',
        'warehousE_STRUCTURE_OBJECTIVE_REASONS',
        'warehousE_STRUCTURE_REMEDIATION',

        'warehousE_ASSEMBLY_EXACT_DT',
        'warehousE_ASSEMBLY_STATUS',
        'warehousE_ASSEMBLY_SUBJECTIVE_REASONS',
        'warehousE_ASSEMBLY_OBJECTIVE_REASONS',
        'warehousE_ASSEMBLY_REMEDIATION',

        'warehousE_PAINT_EXACT_DT',
        'warehousE_PAINT_STATUS',
        'warehousE_PAINT_SUBJECTIVE_REASONS',
        'warehousE_PAINT_OBJECTIVE_REASONS',
        'warehousE_PAINT_REMEDIATION',
	];
    onUpdateImport(rows: any) {
        abp.ui.setBusy();
        let excelArr = this.xlsRowsToArr(rows, this.xlsStructure, function (obj: R_TEMPLATE_MASTER_ENTITY) {
            return obj;
        })
		if (!excelArr) {
			abp.ui.clearBusy();
			return;
		}
        // phần gán data gửi về BE
        this.importFilterInput.makeR_ID = this.appSession.user.userName;
        this.importFilterInput.type = 'MATERIAL';
		this.importFilterInput.r_TEMPLATEs = excelArr.map(this.excelMapping);

		if (excelArr && excelArr.length) {
			this.rService
				.r_PLAN_PRODUCTION_UPD_Import(this.importFilterInput)
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
