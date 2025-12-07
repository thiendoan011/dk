import { ViewEncapsulation, Injector, Component, Input } from "@angular/core";
import { AuthStatusConsts } from "@app/admin/core/ultils/consts/AuthStatusConsts";
import { RecordStatusConsts } from "@app/admin/core/ultils/consts/RecordStatusConsts";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { CM_DEPARTMENT_ENTITY, DepartmentServiceProxy, BranchServiceProxy, CM_BRANCH_ENTITY } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "dep-modal",
    templateUrl: "./department-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class DepartmentModalComponent extends PopupBaseComponent<CM_DEPARTMENT_ENTITY> {
    @Input() branch_id;
    @Input() hiddenInputSearchBranch = true;
    constructor(injector: Injector,
        private departmentService: DepartmentServiceProxy,
        private branchService: BranchServiceProxy) {
        super(injector);
        this.filterInput = new CM_DEPARTMENT_ENTITY();
        this.filterInput.brancH_ID = this.branch_id;
        this.keyMember = 'deP_ID';
    }

    lstBranch: CM_BRANCH_ENTITY[];

    initComboFromApi() {
        this.branchService.cM_BRANCH_Search(this.getFillterForCombobox()).subscribe(result => {
            this.lstBranch = result.items;
            this.updateView();
        });
    }
    ngOnInit(): void {
        this.updateParentView();
    }
    async getResult(checkAll: boolean = false): Promise<any> {
        if(this.branch_id){
            this.filterInput.brancH_ID = this.branch_id;
        }
        
        this.filterInput.autH_STATUS = AuthStatusConsts.Approve;
        this.filterInputSearch = this.filterInput;
        this.setSortingForFilterModel(this.filterInputSearch);

        this.filterInputSearch.recorD_STATUS = RecordStatusConsts.Active;

        if (checkAll) {
            this.filterInputSearch.maxResultCount = -1;
        }

        var result = await this.departmentService.cM_DEPARTMENT_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading())).toPromise();

        if (checkAll) {
            this.selectedItems = result.items;
        }
        else {
            this.dataTable.records = result.items;
            this.dataTable.totalRecordsCount = result.totalCount;
            this.filterInputSearch.totalCount = result.totalCount;
        }
        return result;
    }
}
