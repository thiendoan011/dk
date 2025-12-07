import { ViewEncapsulation, Injector, Component } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { PO_PRODUCT_OUTSOURCED_DTO, PoGroupProductServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "po-product-of-r-modal",
    templateUrl: "./po-product-of-r-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PoProductOfRModalComponent extends PopupBaseComponent<PO_PRODUCT_OUTSOURCED_DTO> {
    constructor(injector: Injector,
        private poGroupProductService: PoGroupProductServiceProxy) {
        super(injector);
        this.filterInput = new PO_PRODUCT_OUTSOURCED_DTO();
        this.keyMember = 'stt';
        this.pagingClient = true;
    }

    async getResult(checkAll: boolean = false): Promise<any> {
        this.setSortingForFilterModel(this.filterInputSearch);
        
        var result = await this.poGroupProductService.pO_GET_PRODUCT_OF_R_Byid(this.filterInputSearch)
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
