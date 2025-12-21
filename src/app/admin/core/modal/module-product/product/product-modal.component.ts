import { ViewEncapsulation, Injector, Component, ViewChild, Output, EventEmitter, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { AllCodeServiceProxy, PO_PRODUCT_ENTITY, PRODUCT_PRODUCT_ENTITY, PoProductServiceProxy, ProductProductServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "product-modal",
    templateUrl: "./product-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class ProductModalComponent extends PopupBaseComponent<PRODUCT_PRODUCT_ENTITY> {
    constructor(injector: Injector,
        private productProductService: ProductProductServiceProxy,
        private allCodeService: AllCodeServiceProxy) {
        super(injector);
        this.filterInput = new PRODUCT_PRODUCT_ENTITY();
        this.keyMember = 'producT_ID';
        this.filterInput.top = 1000;
        this.pagingClient = true;

    }
    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        var result = await this.productProductService.pRODUCT_PRODUCT_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading())).toPromise();

        if (checkAll) {
            this.selectedItems = result.items;
        }
        else {
            this.setRecords(result);
        }

        return result;
    }
}
