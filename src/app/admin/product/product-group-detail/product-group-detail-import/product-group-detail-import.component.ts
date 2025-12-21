import { Injector, Component, AfterViewInit } from "@angular/core";
import { BranchServiceProxy, CM_BRANCH_ENTITY} from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";

@Component({
    templateUrl: './product-group-detail-import.component.html',
    animations: [appModuleAnimation()]
})

export class ProductGroupDetailImportComponent extends DefaultComponentBase implements AfterViewInit {
    constructor(injector: Injector,
        private _branchService: BranchServiceProxy
        ) {
        super(injector);
        this.filterInput.brancH_ID = this.appSession.user.subbrId

        this.initFilter(); // this method will call initDefaultFilter()
    }
    filterInput: any = {};

    ngOnInit(): void {
        this.initDefaultFilter();
    }

    ngAfterViewInit(): void {
        this.updateView()
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
