import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { DASHBOARD_PLAN_EDITTABLE, R_DASHBOARD_PLAN_DTO, R_DASHBOARD_PLAN_EDITTABLE } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'r-dashboard-plan-edittable',
	templateUrl: './r-dashboard-plan-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class RDashboardPlanEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
    ) {
        super(injector);
    }

    _inputModel: R_DASHBOARD_PLAN_DTO;
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
//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<R_DASHBOARD_PLAN_EDITTABLE>;

    ngOnInit(): void {
        this.updateView();
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    refreshTable(){
        this.updateView();
    }

    onViewDetailR(item: R_DASHBOARD_PLAN_EDITTABLE){
        window.open("/app/admin/r-view;id="+ item.r_ID);
    }
}