import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { PDE_GROUP_PRODUCT_NORMAL_ENTITY, PDEGroupProductServiceProxy, } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { finalize } from "rxjs/operators";
import { IUiActionList } from "@app/ultilities/ui-action-list";
import { AppConsts } from "@shared/AppConsts";

@Component({
    templateUrl: './pde-progress-normal-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class PDEProgressNormalListComponent extends ListComponentBase<PDE_GROUP_PRODUCT_NORMAL_ENTITY> implements IUiActionList<PDE_GROUP_PRODUCT_NORMAL_ENTITY>, OnInit, AfterViewInit {
//#region "Constructor"
    constructor(injector: Injector,
        private pdeGroupProductService: PDEGroupProductServiceProxy) {
        super(injector);
        this.remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;
        if(!this.isNullOrEmpty(window["reQ_NORMAL_STATUS"])){
            this.filterInput.reQ_NORMAL_STATUS = window["reQ_NORMAL_STATUS"];
        }
    }
    remoteServiceBaseUrl: string;
    filterInput: PDE_GROUP_PRODUCT_NORMAL_ENTITY = new PDE_GROUP_PRODUCT_NORMAL_ENTITY();

    // for detail

//#endregion "Constructor"

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiActionList(this);
        // set role toolbar
        this.appToolbar.setRole('PDEProgressNormal', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();
        // set default value
        this.filterInput.brancH_LOGIN = this.appSession.user.subbrId;
        this.filterInput.deP_LOGIN = this.appSession.user.deP_ID;
        this.filterInput.useR_LOGIN = this.appSession.user.userName;
        this.filterInput.grouP_PRODUCT_STATUS = 'mau';
        this.filterInput.reQ_NORMAL_STATUS = 'U';
    }

    ngAfterViewInit(): void {
        if(!this.isNullOrEmpty(window["reQ_NORMAL_STATUS"])){
            this.filterInput.reQ_NORMAL_STATUS = window["reQ_NORMAL_STATUS"];
            this.onSearch();
            window["reQ_NORMAL_STATUS"] = undefined;
            this.updateView();
        }
        this.updateView();
    }

    search(): void {
        this.showTableLoading(); 
        this.setSortingForFilterModel(this.filterInputSearch);

        this.pdeGroupProductService.pDE_GROUP_PRODUCT_PROGRESS_NORMAL_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
    }

    onAdd(): void {
        this.navigatePassParam('/app/admin/pde-progress-normal-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: PDE_GROUP_PRODUCT_NORMAL_ENTITY): void {
        this.navigatePassParam('/app/admin/pde-progress-normal-edit', { id: item.pdE_GROUP_PRODUCT_NORMAL_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: PDE_GROUP_PRODUCT_NORMAL_ENTITY): void {
        
    }

    onViewDetail(item: PDE_GROUP_PRODUCT_NORMAL_ENTITY): void {
        this.navigatePassParam('/app/admin/pde-progress-normal-view', { id: item.pdE_GROUP_PRODUCT_NORMAL_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onResetSearch(): void {
        this.filterInput = new PDE_GROUP_PRODUCT_NORMAL_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
    }

    onViewDetailImage(){
        window.open(this.remoteServiceBaseUrl + '/Common/Images/PO/HardwareVT/dinh_tan.jpg')
    }
}
