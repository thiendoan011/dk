import { ViewEncapsulation, Injector, Component } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { PO_PRODUCT_ENTITY, PoProductServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "po-product-modal",
    templateUrl: "./po-product-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PoProductModalComponent extends PopupBaseComponent<PO_PRODUCT_ENTITY> {
    constructor(injector: Injector,
        private poProductService: PoProductServiceProxy) {
        super(injector);
        this.filterInput = new PO_PRODUCT_ENTITY();
        this.keyMember = 'producT_ID';
        this.filterInput.top = 1000;
        this.pagingClient = true;

    }
    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        var result = await this.poProductService.pO_Product_Search(this.filterInputSearch)
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
