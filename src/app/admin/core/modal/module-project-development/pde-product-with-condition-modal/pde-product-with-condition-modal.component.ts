import { ViewEncapsulation, Injector, Component, ViewChild, Output, EventEmitter, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { AllCodeServiceProxy, PO_PRODUCT_ENTITY, PDEProductServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "pde-product-with-condition-modal",
    templateUrl: "./pde-product-with-condition-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PDEProductWithConditionModalComponent extends PopupBaseComponent<PO_PRODUCT_ENTITY> {
    constructor(injector: Injector,
        private pdeProductService: PDEProductServiceProxy,
        private allCodeService: AllCodeServiceProxy) {
        super(injector);
        this.filterInput = new PO_PRODUCT_ENTITY();
        this.keyMember = 'producT_ID';
        this.filterInput.top = 1000;
        this.pagingClient = true;

    }
    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        var result = await this.pdeProductService.pDE_PRODUCT_OF_GROUP_PRODUCT_Search(this.filterInputSearch)
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
