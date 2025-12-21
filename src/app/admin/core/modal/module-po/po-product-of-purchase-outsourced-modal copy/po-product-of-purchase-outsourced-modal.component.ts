import { ViewEncapsulation, Injector, Component } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { PO_PRODUCT_OUTSOURCED_RECEIPT_DTO, PoPurchaseServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "po-product-of-purchase-outsourced-modal",
    templateUrl: "./po-product-of-purchase-outsourced-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PoProductOfPurchaseOutsourcedModalComponent extends PopupBaseComponent<PO_PRODUCT_OUTSOURCED_RECEIPT_DTO> {
    constructor(injector: Injector,
        private poPurchaseService: PoPurchaseServiceProxy) {
        super(injector);
        this.filterInput = new PO_PRODUCT_OUTSOURCED_RECEIPT_DTO();
        this.keyMember = 'pO_PURCHASE_PRODUCT_OUTSOURCED_ID';
        this.pagingClient = true;
    }

    async getResult(checkAll: boolean = false): Promise<any> {
        this.setSortingForFilterModel(this.filterInputSearch);
        
        var result = await this.poPurchaseService.pO_PRODUCT_OF_PURCHASE_OUTSOURCED_Search(this.filterInputSearch)
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
