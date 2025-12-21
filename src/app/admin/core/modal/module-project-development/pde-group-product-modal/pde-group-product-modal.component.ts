import { ViewEncapsulation, Injector, Component } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { AllCodeServiceProxy, PO_GROUP_PRODUCT_ENTITY, PDEGroupProductServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "pde-group-product-modal",
    templateUrl: "./pde-group-product-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PDEGroupProductModalComponent extends PopupBaseComponent<PO_GROUP_PRODUCT_ENTITY> {
    constructor(injector: Injector,
        private pdeGroupProductService: PDEGroupProductServiceProxy,
        private allCodeService: AllCodeServiceProxy) {
        super(injector);
        this.filterInput = new PO_GROUP_PRODUCT_ENTITY();
        this.keyMember = 'grouP_PRODUCT_ID';
        this.pagingClient = true;

    }
    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        var result = await this.pdeGroupProductService.pDE_Group_Product_Search(this.filterInputSearch)
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
