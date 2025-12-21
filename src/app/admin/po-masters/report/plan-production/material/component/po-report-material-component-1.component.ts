import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { CM_BRANCH_ENTITY, PoReportServiceProxy, R_DASHBOARD_PLAN_DTO } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { ModalDirective } from "ngx-bootstrap";
import { RDashboardPlanEdittableComponent } from "./r-dashboard-plan-edittable.component";

@Component({
    selector: 'po-report-material-component-1',
	templateUrl: './po-report-material-component-1.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class POReportMaterialComponent1Component extends ChangeDetectionComponent implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
        private poReportService: PoReportServiceProxy
    ) {
        super(injector);
    }

    _inputModel: R_DASHBOARD_PLAN_DTO = new R_DASHBOARD_PLAN_DTO();
    @Input() set inputModel(value: R_DASHBOARD_PLAN_DTO) {
        this._inputModel = value;
    }
    get inputModel(): R_DASHBOARD_PLAN_DTO {
        return this._inputModel;
    }

    _title: string;
    @Input() set title(value: string) {
        this._title = value;
    }
    get title(): string {
        return this._title;
    }

    @Input() set branches(value) {
        this._branches = value;
    }
//#endregion "Constructor"    

    filterInput: any = {};
    _branches: CM_BRANCH_ENTITY[];

    ngOnInit(): void {
        this.filterInput.brancH_ID_DASH_BOARD = this.appSession.user.subbrId;
        this.filterInput.type = 'CD1';
        this.updateView();
    }

    ngAfterViewInit(): void {
        this.getDataPages();
        this.updateView();
    }

    ngOnChanges(){
        this.updateView();
    }

    refreshTable(){
        this.updateView();
    }

    getDataPages() {
        this.poReportService.r_PLAN_DASHBOARD_ById(this.filterInput).subscribe(response => {
            this.inputModel = response;
            
            //this.setDataEditTables();
            this.updateView();
        });
    }

//#region "Popup"
    refreshDataPopupEdittables(){
        this.rDashboardPlanEdittable1.editTable.setList([]);
        this.rDashboardPlanEdittable1.refreshTable();

        this.rDashboardPlanEdittable2.editTable.setList([]);
        this.rDashboardPlanEdittable2.refreshTable();

        this.rDashboardPlanEdittable3.editTable.setList([]);
        this.rDashboardPlanEdittable3.refreshTable();
    }
    setDataPopupEditTables(){
        // Danh sách PO sắp tới hạn
        if (this.inputModel.sooN_DASHBOARD_PLAN_EDITTABLEs && this.inputModel.sooN_DASHBOARD_PLAN_EDITTABLEs.length > 0) {
            this.rDashboardPlanEdittable1.editTable.setList(this.inputModel.sooN_DASHBOARD_PLAN_EDITTABLEs);
            this.rDashboardPlanEdittable1.refreshTable();
        }
        // Danh sách PO tới hạn
        if (this.inputModel.duE_DASHBOARD_PLAN_EDITTABLEs && this.inputModel.duE_DASHBOARD_PLAN_EDITTABLEs.length > 0) {
            this.rDashboardPlanEdittable2.editTable.setList(this.inputModel.duE_DASHBOARD_PLAN_EDITTABLEs);
            this.rDashboardPlanEdittable2.refreshTable();
        }
        // Danh sách PO quá hạn
        if (this.inputModel.expireD_DASHBOARD_PLAN_EDITTABLEs && this.inputModel.expireD_DASHBOARD_PLAN_EDITTABLEs.length > 0) {
            this.rDashboardPlanEdittable3.editTable.setList(this.inputModel.expireD_DASHBOARD_PLAN_EDITTABLEs);
            this.rDashboardPlanEdittable3.refreshTable();
        }
    }

    // Danh sách PO sắp tới hạn
    @ViewChild('rDashboardPlanEdittable1') rDashboardPlanEdittable1: RDashboardPlanEdittableComponent;
    // Danh sách PO tới hạn
    @ViewChild('rDashboardPlanEdittable2') rDashboardPlanEdittable2: RDashboardPlanEdittableComponent;
    // Danh sách PO quá hạn
    @ViewChild('rDashboardPlanEdittable3') rDashboardPlanEdittable3: RDashboardPlanEdittableComponent;
    
    @ViewChild('popupFrameModal') modal: ModalDirective;
    title_popup: string = '';
    showPopup(type: string) {
        abp.ui.setBusy();
        this.refreshDataPopupEdittables();
        this.filterInput.type = type;
        this.poReportService.r_PLAN_DASHBOARD_ById(this.filterInput)
        .pipe(finalize(() => abp.ui.clearBusy()))
        .subscribe(response => {
            this.inputModel = response;
            this.setDataPopupEditTables();
            if(type == 'CD1'){
                this.title_popup = 'Vật tư nguyên liệu';
            }
            else if(type == 'CD2'){
                this.title_popup = 'Vật tư định hình';
            }
            else if(type == 'CD3'){
                this.title_popup = 'Vật tư lắp ráp';
            }
            else if(type == 'CD4'){
                this.title_popup = 'Vật tư sơn + đóng gói';
            }
            this.modal.show();
            this.updateView();
        });
    }
    closePopup(){
        this.modal.hide();
    }
    
//#endregion "Popup"
}