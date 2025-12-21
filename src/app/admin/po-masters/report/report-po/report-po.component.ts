import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, AfterViewInit } from "@angular/core";
import { PO_PRODUCTED_PART_ENTITY, BranchServiceProxy, CM_BRANCH_ENTITY} from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";

@Component({
    templateUrl: './report-po.component.html',
    animations: [appModuleAnimation()]
})

export class ReportPOComponent extends ListComponentBase<PO_PRODUCTED_PART_ENTITY> implements OnInit, AfterViewInit {
    constructor(injector: Injector,
        private _branchService: BranchServiceProxy
        ) {
        super(injector);
        this.filterInput.brancH_ID = this.appSession.user.subbrId

        this.initFilter(); // this method will call initDefaultFilter()
    }
    filterInput: any = {};

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.updateView();
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
