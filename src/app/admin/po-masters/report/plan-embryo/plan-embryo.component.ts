import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { PO_ENTITY, AsposeServiceProxy, ReportInfo, DASHBOARD_PLAN_DTO, PoReportServiceProxy, BranchServiceProxy, CM_BRANCH_ENTITY, PO_REPORT_ENTITY, DASHBOARD_PLAN_PARAM, } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { ModalDirective } from "ngx-bootstrap";
import { DashboardPlanEmbryoTbl1EdittableComponent } from "./edittable/dashboard-plan-embryo-tbl1-edittable.component";
import { DashboardPlanTbl2EdittableComponent } from "./edittable/dashboard-plan-tbl2-edittable.component";
import { catchError, finalize, retry } from "rxjs/operators";
import { of } from "rxjs";

@Component({
    templateUrl: './plan-embryo.component.html',
    animations: [appModuleAnimation()]
})

export class PlanEmbryoComponent extends ListComponentBase<PO_ENTITY> implements OnInit, AfterViewInit {
    constructor(injector: Injector,
        private poReportService: PoReportServiceProxy,
        private fileDownloadService: FileDownloadService,
        private _branchService: BranchServiceProxy,
        private asposeService: AsposeServiceProxy
        ) {
        super(injector);
        this.filterInput.brancH_ID = this.appSession.user.subbrId;
        this.filterInputDashboard.brancH_ID_DASH_BOARD = this.appSession.user.subbrId;

        this.initFilter(); // this method will call initDefaultFilter()
    }

    filterInput: any = {};
    filterInput_search: any = {};
    filterInputDashboard: DASHBOARD_PLAN_PARAM = new DASHBOARD_PLAN_PARAM();
    inputModel: DASHBOARD_PLAN_DTO = new DASHBOARD_PLAN_DTO();

    ngOnInit(): void {
        this.getDataPages();
        this.filterInput_search.brancH_ID = this.appSession.user.subbrId;

        this.filterInput.brancH_ID = this.appSession.user.subbrId;
        this.filterInput.TYPE = 'part_embryo';
    }

    ngAfterViewInit(): void {
        this.updateView()
    }

    getDataPages() {
        this.poReportService.pO_PLAN_DASHBOARD_ById(this.filterInputDashboard).subscribe(response => {
            this.inputModel = response;
            
            //this.setDataEditTables();
            this.updateView();
        });
    }

    exportToExcel() {
        //this.showTableLoading();

        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        let filterReport = { ...this.filterInputSearch }
        filterReport.maxResultCount = -1;

        reportInfo.parameters = this.GetParamsFromFilter({
            FRMDATE: this.filterInput.frmdate,
            TODATE: this.filterInput.todate,
            BRANCH_ID: this.filterInput.brancH_ID
        });

        if(this.filterInput.TYPE == 'part_embryo'){
            reportInfo.pathName = "/PO_MASTER/TEMP_TABLE_PRODUCTED_PART_EMBRYO.xlsx";
            reportInfo.storeName = "TEMP_TABLE_PRODUCTED_PART_EMBRYO_PROC";
        }
        else if(this.filterInput.TYPE == 'part_2'){
            reportInfo.pathName = "/PO_MASTER/TEMP_TABLE_PRODUCTED_PART_2.xlsx";
            reportInfo.storeName = "TEMP_TABLE_PRODUCTED_PART_2_PROC";
        }
        else if(this.filterInput.TYPE == 'part_3'){
            reportInfo.pathName = "/PO_MASTER/TEMP_TABLE_PRODUCTED_PART_3.xlsx";
            reportInfo.storeName = "TEMP_TABLE_PRODUCTED_PART_3_PROC";
        }
        else if(this.filterInput.TYPE == 'part_4'){
            reportInfo.pathName = "/PO_MASTER/TEMP_TABLE_PRODUCTED_PART_4.xlsx";
            reportInfo.storeName = "TEMP_TABLE_PRODUCTED_PART_4_PROC";
        }
        else if(this.filterInput.TYPE == 'part_5'){
            reportInfo.pathName = "/PO_MASTER/TEMP_TABLE_PRODUCTED_PART_5.xlsx";
            reportInfo.storeName = "TEMP_TABLE_PRODUCTED_PART_5_PROC";
        }
        else if(this.filterInput.TYPE == 'part_6'){
            reportInfo.pathName = "/PO_MASTER/TEMP_TABLE_PRODUCTED_PART_6.xlsx";
            reportInfo.storeName = "TEMP_TABLE_PRODUCTED_PART_6_PROC";
        }

        reportInfo.row_filter_index = 5;
        reportInfo.col_filter_start = 4;
        reportInfo.col_filter_end = 500;

        this.asposeService
        .getReportFromTable(reportInfo)
        //.pipe(finalize(() => this.hideTableLoading()))
        .subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }

    onchangeFilter(){

    }

//#region "EditTable"
    getDataEditTables(){

    }
    setDataEditTables(){

    }
    // Danh sách PO sắp tới hạn
    @ViewChild('dashboardPlanTbl2Edittable') dashboardPlanTbl2Edittable: DashboardPlanTbl2EdittableComponent;
    
//#endregion "EditTable"

//#region "Popup"
    refreshDataPopupEdittables(){
        this.dashboardPlanEmbryoTbl1Edittable.editTable.setList([]);
        this.dashboardPlanEmbryoTbl1Edittable.refreshTable();

        this.dashboardPlanEmbryoTbl2Edittable.editTable.setList([]);
        this.dashboardPlanEmbryoTbl2Edittable.refreshTable();

        this.dashboardPlanEmbryoTbl3Edittable.editTable.setList([]);
        this.dashboardPlanEmbryoTbl3Edittable.refreshTable();
    }
    setDataPopupEditTables(){
        // Danh sách PO sắp tới hạn
        if (this.inputModel.sooN_DASHBOARD_PLAN_EDITTABLEs && this.inputModel.sooN_DASHBOARD_PLAN_EDITTABLEs.length > 0) {
            this.dashboardPlanEmbryoTbl1Edittable.editTable.setList(this.inputModel.sooN_DASHBOARD_PLAN_EDITTABLEs);
            this.dashboardPlanEmbryoTbl1Edittable.refreshTable();
        }
        // Danh sách PO tới hạn
        if (this.inputModel.duE_DASHBOARD_PLAN_EDITTABLEs && this.inputModel.duE_DASHBOARD_PLAN_EDITTABLEs.length > 0) {
            this.dashboardPlanEmbryoTbl2Edittable.editTable.setList(this.inputModel.duE_DASHBOARD_PLAN_EDITTABLEs);
            this.dashboardPlanEmbryoTbl2Edittable.refreshTable();
        }
        // Danh sách PO quá hạn
        if (this.inputModel.expireD_DASHBOARD_PLAN_EDITTABLEs && this.inputModel.expireD_DASHBOARD_PLAN_EDITTABLEs.length > 0) {
            this.dashboardPlanEmbryoTbl3Edittable.editTable.setList(this.inputModel.expireD_DASHBOARD_PLAN_EDITTABLEs);
            this.dashboardPlanEmbryoTbl3Edittable.refreshTable();
        }
    }

    // Danh sách PO sắp tới hạn
    @ViewChild('dashboardPlanEmbryoTbl1Edittable') dashboardPlanEmbryoTbl1Edittable: DashboardPlanEmbryoTbl1EdittableComponent;
    // Danh sách PO tới hạn
    @ViewChild('dashboardPlanEmbryoTbl2Edittable') dashboardPlanEmbryoTbl2Edittable: DashboardPlanEmbryoTbl1EdittableComponent;
    // Danh sách PO quá hạn
    @ViewChild('dashboardPlanEmbryoTbl3Edittable') dashboardPlanEmbryoTbl3Edittable: DashboardPlanEmbryoTbl1EdittableComponent;
    
    @ViewChild('popupFrameModal') modal: ModalDirective;
    title_popup: string = '';
    showPopup(type: string) {
        abp.ui.setBusy();
        this.refreshDataPopupEdittables();
        this.filterInputDashboard.type = type;
        this.poReportService.pO_PLAN_DASHBOARD_ById(this.filterInputDashboard)
        .pipe(finalize(() => abp.ui.clearBusy()))
        .subscribe(response => {
            this.inputModel = response;
            this.setDataPopupEditTables();
            if(type == 'EMBRYO'){
                this.title_popup = 'Công đoạn phôi';
            }
            else if(type == 'STRUCT'){
                this.title_popup = 'Công đoạn định hình';
            }
            else if(type == 'ASSEMBLY'){
                this.title_popup = 'Công đoạn lắp ráp';
            }
            else if(type == 'PAINT'){
                this.title_popup = 'Công đoạn sơn';
            }
            else if(type == 'WRAP'){
                this.title_popup = 'Công đoạn đóng gói';
            }
            this.modal.show();
            this.updateView();
        });
    }
    closePopup(){
        this.modal.hide();
    }
    
//#endregion "Popup"

//#region combobox and default filter

    // call in region constructor
    initDefaultFilter() {
        this.initCombobox();
        // set other filter here
    }

// edit step 3
    initCombobox() {
        let filterCombobox = this.getFillterForCombobox();
        this._branchService.cM_BRANCH_Search(filterCombobox)
        .pipe(
            retry(3)
          )
        .subscribe(response => {
            this.branches = response.items;
            this.updateView();
        });
    }

// edit step 1
    branches: CM_BRANCH_ENTITY[];

// edit step 2

//#endregion combobox and default filter

    search_plan(){
        abp.ui.setBusy();
        this.poReportService.pO_REPORT_PLAN_Search(this.filterInput_search)
        .pipe(finalize(() => abp.ui.clearBusy()))
        .subscribe(res => {
            if (res.length > 0) {
                this.dashboardPlanTbl2Edittable.editTable.setList(res);
                this.dashboardPlanTbl2Edittable.refreshTable();
            }
            else{
                this.dashboardPlanTbl2Edittable.editTable.setList([]);
                this.dashboardPlanTbl2Edittable.refreshTable();
            }
        });
    }
}
