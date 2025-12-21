import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { PO_GROUP_PRODUCT_ENTITY, PDEGroupProductServiceProxy, } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { finalize } from "rxjs/operators";
import { IUiActionList } from "@app/ultilities/ui-action-list";
import { AppConsts } from "@shared/AppConsts";

@Component({
    templateUrl: './pde-progress-template-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class PDEProgressTemplateListComponent extends ListComponentBase<PO_GROUP_PRODUCT_ENTITY> implements IUiActionList<PO_GROUP_PRODUCT_ENTITY>, OnInit, AfterViewInit {
//#region "Constructor"
    constructor(injector: Injector,
        private pdeGroupProductService: PDEGroupProductServiceProxy) {
        super(injector);
        this.remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;
        if(!this.isNullOrEmpty(window["reQ_TEMPLATE_STATUS"])){
            this.filterInput.reQ_TEMPLATE_STATUS = window["reQ_TEMPLATE_STATUS"];
        }
    }
    remoteServiceBaseUrl: string;
    filterInput: PO_GROUP_PRODUCT_ENTITY = new PO_GROUP_PRODUCT_ENTITY();

    // for detail

//#endregion "Constructor"

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiActionList(this);
        // set role toolbar
        this.appToolbar.setRole('PDEProgressTemplate', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();
        // set default value
        this.filterInput.grouP_PRODUCT_STATUS = 'mau';
        this.filterInput.reQ_TEMPLATE_STATUS = 'U';
    }

    ngAfterViewInit(): void {
        if(!this.isNullOrEmpty(window["reQ_TEMPLATE_STATUS"])){
            this.filterInput.reQ_TEMPLATE_STATUS = window["reQ_TEMPLATE_STATUS"];
            this.onSearch();
            window["reQ_TEMPLATE_STATUS"] = undefined;
            this.updateView();
        }
        this.updateView();
    }

    search(): void {
        this.showTableLoading(); 
        this.setSortingForFilterModel(this.filterInputSearch);

        this.pdeGroupProductService.pDE_GROUP_PRODUCT_PROGRESS_TEMPLATE_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
    }

    onAdd(): void {
        this.navigatePassParam('/app/admin/pde-progress-template-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: PO_GROUP_PRODUCT_ENTITY): void {
        this.navigatePassParam('/app/admin/pde-progress-template-edit', { id: item.grouP_PRODUCT_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: PO_GROUP_PRODUCT_ENTITY): void {
        
    }

    onViewDetail(item: PO_GROUP_PRODUCT_ENTITY): void {
        this.navigatePassParam('/app/admin/pde-progress-template-view', { id: item.grouP_PRODUCT_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onResetSearch(): void {
        this.filterInput = new PO_GROUP_PRODUCT_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
    }
}
