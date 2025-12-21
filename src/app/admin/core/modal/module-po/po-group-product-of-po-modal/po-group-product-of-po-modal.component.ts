import { ViewEncapsulation, Injector, Component, ViewChild, Output, EventEmitter, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { PoMasterServiceProxy, PO_GROUP_PRODUCT_ENTITY } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "po-group-product-of-po-modal",
    templateUrl: "./po-group-product-of-po-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PoGroupProductOfPOModalComponent extends PopupBaseComponent<PO_GROUP_PRODUCT_ENTITY> {
    constructor(injector: Injector,
        private poMasterService: PoMasterServiceProxy) {
        super(injector);
        this.filterInput = new PO_GROUP_PRODUCT_ENTITY();
        this.keyMember = 'grouP_PRODUCT_ID';
        this.filterInput.top = 1000;
        this.pagingClient = true;

    }

    @Input() po_id: string;

    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        var result = await this.poMasterService.pO_GET_GROUP_PRODUCT_OF_PO_Byid(this.filterInputSearch)
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
