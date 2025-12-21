import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { MW_GROUP_ENTITY, MWGroupServiceProxy } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { finalize } from "rxjs/operators";
import { IUiActionList } from "@app/ultilities/ui-action-list";
import { AppConsts } from "@shared/AppConsts";

@Component({
    templateUrl: './mw-group-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class MWGroupListComponent extends ListComponentBase<MW_GROUP_ENTITY> implements IUiActionList<MW_GROUP_ENTITY>, OnInit, AfterViewInit {

//#region constructor
    constructor(injector: Injector,
        private mwGroupService: MWGroupServiceProxy) {
        super(injector);
        this.remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;
        this.initDefaultFilter();
    }
    // root link
    remoteServiceBaseUrl: string;
    filterInput: MW_GROUP_ENTITY = new MW_GROUP_ENTITY();

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiActionList(this);
        // set role toolbar
        this.appToolbar.setRole('MWGroup', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();
    }

    ngAfterViewInit(): void {
        this.updateView()
    }

//#endregion constructor

//#region search and navigation
    search(): void {
        this.showTableLoading(); 

        this.setSortingForFilterModel(this.filterInputSearch);

        this.mwGroupService.mW_GROUP_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
    }

    onResetSearch(): void {
        this.filterInput = new MW_GROUP_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
    }

    onAdd(): void {
        this.navigatePassParam('/app/admin/mw-group-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: MW_GROUP_ENTITY): void {
        this.navigatePassParam('/app/admin/mw-group-edit', { id: item.mW_GROUP_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onViewDetail(item: MW_GROUP_ENTITY): void {
        this.navigatePassParam('/app/admin/mw-group-view', { id: item.mW_GROUP_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: MW_GROUP_ENTITY): void {
        this.message.confirm(
            this.l('DeleteWarningMessage', item.mW_GROUP_CODE),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.mwGroupService.mW_GROUP_Del(item.mW_GROUP_ID, this.appSession.user.userName)
                    .pipe(finalize(() => { this.saving = false; }))
                    .subscribe((response) => {
                        if (response['Result'] != '0') {
                            this.showErrorMessage(response["ErrorDesc"]);
                        }
                        else {
                            this.showSuccessMessage(this.l('SuccessfullyDeleted'));
                            this.filterInputSearch.totalCount = 0;
                            this.reloadPage();
                        }
                    });
                }
            }
        );
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
    }

// edit step 1: init variable

// edit step 2: handle event
// end combobox

//#endregion combobox and default filter

}
