import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { BranchServiceProxy, CM_BRANCH_ENTITY, VHE_VEHICLE_REQUEST_ENTITY, VHEVehicleRequestServiceProxy } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { finalize } from "rxjs/operators";
import { IUiActionList } from "@app/ultilities/ui-action-list";
import { AppConsts } from "@shared/AppConsts";

@Component({
    templateUrl: './vhe-vehicle-request-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class VHEVehicleRequestListComponent extends ListComponentBase<VHE_VEHICLE_REQUEST_ENTITY> implements IUiActionList<VHE_VEHICLE_REQUEST_ENTITY>, OnInit, AfterViewInit {

//#region constructor
    constructor(injector: Injector,
        private _branchService: BranchServiceProxy,
        private vehicleRequestService: VHEVehicleRequestServiceProxy) {
        super(injector);
        this.remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;
        this.initDefaultFilter();
    }
    // root link
    remoteServiceBaseUrl: string;
    filterInput: VHE_VEHICLE_REQUEST_ENTITY = new VHE_VEHICLE_REQUEST_ENTITY();

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiActionList(this);
        // set role toolbar
        this.appToolbar.setRole('VHEVehicleRequest', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();
        this.filterInput.brancH_ID = this.appSession.user.subbrId;
        this.filterInput.autH_STATUS = 'U';
    }

    ngAfterViewInit(): void {
        this.updateView()
    }

//#endregion constructor

//#region search and navigation
    search(): void {
        this.showTableLoading(); 

        this.setSortingForFilterModel(this.filterInputSearch);

        this.vehicleRequestService.vHE_VEHICLE_REQUEST_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
    }

    onResetSearch(): void {
        this.filterInput = new VHE_VEHICLE_REQUEST_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
    }

    onAdd(): void {
        this.navigatePassParam('/app/admin/vhe-vehicle-request-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: VHE_VEHICLE_REQUEST_ENTITY): void {
        this.navigatePassParam('/app/admin/vhe-vehicle-request-edit', { id: item.vhE_VEHICLE_REQUEST_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onViewDetail(item: VHE_VEHICLE_REQUEST_ENTITY): void {
        this.navigatePassParam('/app/admin/vhe-vehicle-request-view', { id: item.vhE_VEHICLE_REQUEST_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: VHE_VEHICLE_REQUEST_ENTITY): void {
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
