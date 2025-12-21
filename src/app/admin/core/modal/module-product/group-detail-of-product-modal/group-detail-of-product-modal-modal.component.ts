import { ViewEncapsulation, Injector, Component, ViewChild, Output, EventEmitter, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { PRODUCT_DETAIL_ENTITY, PRODUCT_GROUP_DETAIL_ENTITY, ProductDetailServiceProxy, ProductGroupDetailServiceProxy, ProductProductServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "group-detail-of-product-modal-modal",
    templateUrl: "./group-detail-of-product-modal-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class GroupDetailOfProductModalComponent extends PopupBaseComponent<PRODUCT_GROUP_DETAIL_ENTITY> {
    constructor(injector: Injector,
        private productProductService: ProductProductServiceProxy,) {
        super(injector);
        this.filterInput = new PRODUCT_GROUP_DETAIL_ENTITY();
        this.keyMember = 'producT_GROUP_DETAIL_ID';
        this.filterInput.useR_LOGIN = this.appSession.user.userName;
        this.pagingClient = true;

    }
    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        var result = await this.productProductService.pRODUCT_GROUP_DETAIL_OF_PRODUCT_Search(this.filterInputSearch)
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
