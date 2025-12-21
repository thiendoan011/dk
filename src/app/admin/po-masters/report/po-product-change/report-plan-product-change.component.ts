import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input, ViewChild } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { DASHBOARD_PLAN_DTO, CM_BRANCH_ENTITY, PoReportServiceProxy, PO_REPORT_PLAN_PRODUCT_CHANGE_EDITTABLE, BranchServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'report-plan-product-change',
	templateUrl: './report-plan-product-change.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class ReportPlanProductChangeComponent extends ChangeDetectionComponent implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
        private _branchService: BranchServiceProxy,
        private poReportService: PoReportServiceProxy
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

    @Input() set list_branch(value) {
        this._list_branch = value;
    }

    get status(): string {
        return this.have_change;
    }
//#endregion "Constructor"    

    have_change: string = 'N';
    filterInput: any = {};
    _list_branch: CM_BRANCH_ENTITY[];
    @ViewChild('editTable') editTable: EditableTableComponent<PO_REPORT_PLAN_PRODUCT_CHANGE_EDITTABLE>;

    ngOnInit(): void {
        this.filterInput.confirM_STATUS = 'U';
        this.filterInput.brancH_ID = this.appSession.user.subbrId;
        this.initDefaultFilter();
        this.updateView();
    }

    ngAfterViewInit(): void {
        this.search();
        this.updateView();
    }

    ngOnChanges(){
        this.updateView();
    }

    refreshTable(){
        this.updateView();
    }

    search(){
        abp.ui.setBusy();
        this.poReportService.pO_REPORT_PLAN_PRODUCT_Status()
        .subscribe(res => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
                abp.ui.clearBusy();
                this.editTable.setList([]);
                this.refreshTable();
            } else {
                this.have_change = res['HAVE_CHANGE'];

                this.poReportService.pO_REPORT_PLAN_PRODUCT_CHANGE_Search(this.filterInput)
                .pipe(finalize(() => abp.ui.clearBusy()))
                .subscribe(res => {
                    if (res.length > 0) {
                        this.editTable.setList(res);
                        this.refreshTable();
                    }
                    else{
                        this.editTable.setList([]);
                        this.refreshTable();
                    }
                });
            }
        });
    }

    onConfirm(item: PO_REPORT_PLAN_PRODUCT_CHANGE_EDITTABLE){
        abp.ui.setBusy();
        this.poReportService.pO_REPORT_PLAN_PRODUCT_Confirm(item)
        .pipe(finalize(() => abp.ui.clearBusy()))
        .subscribe(res => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
                this.refreshTable();
            } else {
                this.showSuccessMessage(res['ErrorDesc']);
                this.search();
            }
        });
    }

    rootPage() {
        return '/app/admin/dashboard';
    }

//#region combobox and default filter

    // call in region constructor
    initDefaultFilter() {
        this.initCombobox();
        this.filterInput.brancH_ID = this.appSession.user.subbrId;
        // set other filter here
    }
// begin combobox
// edit step 3: search
    initCombobox() {
        let filterCombobox = this.getFillterForCombobox();
        this._branchService.cM_BRANCH_Search(filterCombobox).subscribe(response => {
            this._branches = response.items;
            this.updateView();
        });
    }

// edit step 1: init variable
    _branches: CM_BRANCH_ENTITY[];

// edit step 2: handle event
// end combobox

//#endregion combobox and default filter
}