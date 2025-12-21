import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { PRODUCT_PRODUCT_ENTITY, ProductProductServiceProxy, } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { finalize } from "rxjs/operators";
import { IUiActionList } from "@app/ultilities/ui-action-list";

@Component({
    templateUrl: './product-product-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class ProductProductListComponent extends ListComponentBase<PRODUCT_PRODUCT_ENTITY> implements IUiActionList<PRODUCT_PRODUCT_ENTITY>, OnInit, AfterViewInit {
    constructor(injector: Injector,
        private productProductService: ProductProductServiceProxy) {
        super(injector);
    }

    filterInput: PRODUCT_PRODUCT_ENTITY = new PRODUCT_PRODUCT_ENTITY();

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiActionList(this);
        // set role toolbar
        this.appToolbar.setRole('ProductProduct', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();
    }

    ngAfterViewInit(): void {
        this.updateView()
    }

    search(): void {
        this.showTableLoading();
        this.setSortingForFilterModel(this.filterInputSearch);

        this.productProductService.pRODUCT_PRODUCT_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
    }

    onAdd(): void {
        //this.navigatePassParam('/app/admin/product-product-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: PRODUCT_PRODUCT_ENTITY): void {
        this.navigatePassParam('/app/admin/product-product-edit', { id: item.producT_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: PRODUCT_PRODUCT_ENTITY): void {
    }

    onViewDetail(item: PRODUCT_PRODUCT_ENTITY): void {
        this.navigatePassParam('/app/admin/product-product-view', { id: item.producT_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onResetSearch(): void {
        this.filterInput = new PRODUCT_PRODUCT_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
    }

    exportToExcel() {
    }
}
