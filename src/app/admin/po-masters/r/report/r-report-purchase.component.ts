import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from "@angular/core";
import { AsposeServiceProxy, ReportInfo, SupplierServiceProxy, PO_ENTITY, CM_BRANCH_ENTITY, BranchServiceProxy, GROUP_R_ENTITY } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { IUiActionList } from "@app/ultilities/ui-action-list";
import { AppConsts } from "@shared/AppConsts";
import { GroupRModalComponent } from "@app/admin/core/modal/module-po/group-r-modal/group-r-modal.component";

@Component({
    templateUrl: './r-report-purchase.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class RReqportPurchaseComponent extends ListComponentBase<PO_ENTITY> implements OnInit, AfterViewInit {

//#region constructor
    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private branchService: BranchServiceProxy,
        private supplierService: SupplierServiceProxy) {
        super(injector);
        this.remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;
        this.initDefaultFilter();
    }
    // root link
    remoteServiceBaseUrl: string;
    filterInput: PO_ENTITY = new PO_ENTITY();

    ngOnInit(): void {
        this.filterInput.brancH_ID = this.appSession.user.subbrId;
    }

    ngAfterViewInit(): void {
        this.updateView()
    }
    

//#endregion constructor

//#region search and navigation

    search(): void {
        /*
        this.showTableLoading(); 

        this.setSortingForFilterModel(this.filterInputSearch);

        this.supplierService.cM_SUPPLIER_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
        */
    }

    onResetSearch(): void {
        this.filterInput = new PO_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
    }

    onExportReport1(){
        let reportInfo = new ReportInfo();
		reportInfo.typeExport = ReportTypeConsts.Excel;

        let reportFilter =  {   FRMDATE: this.filterInput.frmdate, 
                                TODATE: this.filterInput.todate,
                                R_CODE: this.filterInput.r_CODE,
                                GROUP_R_ID: this.filterInput.grouP_R_ID,
                                PO_CODE: this.filterInput.pO_CODE,
                                PO_PROCESS: this.filterInput.pO_PROCESS,
                                BRANCH_ID: this.filterInput.brancH_ID,
                                USER_LOGIN: this.appSession.user.userName
                            };
        reportInfo.parameters = this.GetParamsFromFilter(reportFilter)

		reportInfo.pathName = '/PO_MASTER/R_KE_HOACH_SAN_XUAT_1.xlsx';
		reportInfo.storeName = 'R_KE_HOACH_SAN_XUAT_RPT';
		this.asposeService.getReport(reportInfo).subscribe((res) => {
			this.fileDownloadService.downloadTempFile(res);
		});
    }
    onExportReport2(){
        let reportInfo = new ReportInfo();
		reportInfo.typeExport = ReportTypeConsts.Excel;

        let reportFilter =  {   FRMDATE: this.filterInput.frmdate, 
                                TODATE: this.filterInput.todate,
                                R_CODE: this.filterInput.r_CODE,
                                GROUP_R_ID: this.filterInput.grouP_R_ID,
                                PO_CODE: this.filterInput.pO_CODE,
                                PO_PROCESS: this.filterInput.pO_PROCESS,
                                BRANCH_ID: this.filterInput.brancH_ID,
                                USER_LOGIN: this.appSession.user.userName
                            };
        reportInfo.parameters = this.GetParamsFromFilter(reportFilter)

		reportInfo.pathName = '/PO_MASTER/R_KE_HOACH_SAN_XUAT_2.xlsx';
		reportInfo.storeName = 'R_KE_HOACH_SAN_XUAT_RPT';
		this.asposeService.getReport(reportInfo).subscribe((res) => {
			this.fileDownloadService.downloadTempFile(res);
		});
    }
    onExportReport3(){
        let reportInfo = new ReportInfo();
		reportInfo.typeExport = ReportTypeConsts.Excel;

        let reportFilter =  {   FRMDATE: this.filterInput.frmdate, 
                                TODATE: this.filterInput.todate,
                                R_CODE: this.filterInput.r_CODE,
                                GROUP_R_ID: this.filterInput.grouP_R_ID,
                                PO_CODE: this.filterInput.pO_CODE,
                                PO_PROCESS: this.filterInput.pO_PROCESS,
                                BRANCH_ID: this.filterInput.brancH_ID,
                                USER_LOGIN: this.appSession.user.userName
                            };
        reportInfo.parameters = this.GetParamsFromFilter(reportFilter)

		reportInfo.pathName = '/PO_MASTER/R_KE_HOACH_SAN_XUAT_3.xlsx';
		reportInfo.storeName = 'R_KE_HOACH_SAN_XUAT_RPT_3';
		this.asposeService.getReport(reportInfo).subscribe((res) => {
			this.fileDownloadService.downloadTempFile(res);
		});
    }
//#endregion search and navigation

//#region popup
    @ViewChild('groupRModal') groupRModal: GroupRModalComponent;
    showGroupR():void{
        this.groupRModal.show();
    }
    onSelectGroupR(item: GROUP_R_ENTITY): void {
        this.filterInput.grouP_R_ID = item.grouP_R_ID;
        this.filterInput.grouP_R_CODE = item.grouP_R_CODE;
        this.filterInput.grouP_R_NAME = item.grouP_R_NAME;
        this.updateView();
    }
    deleteGroupR(event) {
        this.filterInput.grouP_R_ID = '';
        this.filterInput.grouP_R_CODE = '';
        this.filterInput.grouP_R_NAME = '';
        this.updateView();
    }

//#endregion popup

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
        this.branchService.cM_BRANCH_Search(filterCombobox).subscribe(response => {
            this.branches = response.items;
            this.updateView()
        });
    }

// edit step 1: init variable
    branches: CM_BRANCH_ENTITY[];

// edit step 2: handle event
// end combobox

//#endregion combobox and default filter

}
