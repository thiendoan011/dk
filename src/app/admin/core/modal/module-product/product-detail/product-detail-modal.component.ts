import { ViewEncapsulation, Injector, Component, ViewChild, Output, EventEmitter, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { PRODUCT_DETAIL_ENTITY, ProductDetailServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "product-detail-modal",
    templateUrl: "./product-detail-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class ProductDetailModalComponent extends PopupBaseComponent<PRODUCT_DETAIL_ENTITY> {
    constructor(injector: Injector,
        private productDetailService: ProductDetailServiceProxy) {
        super(injector);
        this.filterInput = new PRODUCT_DETAIL_ENTITY();
        this.keyMember = 'producT_DETAIL_ID';
        this.filterInput.useR_LOGIN = this.appSession.user.userName;
        //this.filterInput.autH_STATUS = 'A';
        //this.filterInput.level = 'ALL';
        this.pagingClient = true;

    }
    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        var result = await this.productDetailService.pRODUCT_DETAIL_Search(this.filterInputSearch)
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
