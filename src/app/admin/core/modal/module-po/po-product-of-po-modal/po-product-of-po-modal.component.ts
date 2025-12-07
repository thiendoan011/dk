import { ViewEncapsulation, Injector, Component, ViewChild, Output, EventEmitter, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { PO_PRODUCT_ENTITY, PoGroupProductServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "po-product-of-po-modal",
    templateUrl: "./po-product-of-po-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PoProductOfPOModalComponent extends PopupBaseComponent<PO_PRODUCT_ENTITY> {
    constructor(injector: Injector,
        private poGroupProductService: PoGroupProductServiceProxy) {
        super(injector);
        this.filterInput = new PO_PRODUCT_ENTITY();
        this.keyMember = 'producT_ID';
        this.filterInput.top = 1000;
        this.pagingClient = true;

    }

    @Input() po_id: string;
    @Input() group_product_id: string;

    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        this.filterInputSearch.pO_ID = this.po_id;
        this.filterInputSearch.grouP_PRODUCT_ID = this.group_product_id;
        var result = await this.poGroupProductService.pO_GET_PRODUCT_OF_PO_Byid(this.filterInputSearch)
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
