import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { BranchServiceProxy, CM_BRANCH_ENTITY, PO_MODIFIED_ENTITY, PoModifiedServiceProxy } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { finalize } from "rxjs/operators";
import { IUiActionList } from "@app/ultilities/ui-action-list";
import { AppConsts } from "@shared/AppConsts";

@Component({
    templateUrl: './po-modified-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class POModifiedListComponent extends ListComponentBase<PO_MODIFIED_ENTITY> implements IUiActionList<PO_MODIFIED_ENTITY>, OnInit, AfterViewInit {

//#region constructor
    constructor(injector: Injector,
        private _branchService: BranchServiceProxy,
        private poModifiedService: PoModifiedServiceProxy) {
        super(injector);
        this.remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;
        this.initDefaultFilter();
    }
    // root link
    remoteServiceBaseUrl: string;
    filterInput: PO_MODIFIED_ENTITY = new PO_MODIFIED_ENTITY();

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiActionList(this);
        // set role toolbar
        this.appToolbar.setRole('POModified', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();
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

        this.poModifiedService.pO_MODIFIED_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
    }

    onResetSearch(): void {
        this.filterInput = new PO_MODIFIED_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
    }

    onAdd(): void {
        this.navigatePassParam('/app/admin/po-modified-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: PO_MODIFIED_ENTITY): void {
        this.navigatePassParam('/app/admin/po-modified-edit', { id: item.pO_MODIFIED_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onViewDetail(item: PO_MODIFIED_ENTITY): void {
        this.navigatePassParam('/app/admin/po-modified-view', { id: item.pO_MODIFIED_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: PO_MODIFIED_ENTITY): void {
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
        this._branchService.cM_BRANCH_Search(filterCombobox)
        .subscribe(response => {
            this.branches = response.items;
            this.updateView();
        });
    }

// edit step 1: init variable
    branches: CM_BRANCH_ENTITY[];

// edit step 2: handle event
// end combobox

//#endregion combobox and default filter

}
