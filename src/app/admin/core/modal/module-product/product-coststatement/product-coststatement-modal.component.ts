import { ViewEncapsulation, Injector, Component, ViewChild, Output, EventEmitter, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { PRODUCT_COSTSTATEMENT_ENTITY, ProductCoststatementServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "product-coststatement-modal",
    templateUrl: "./product-coststatement-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class ProductCoststatementModalComponent extends PopupBaseComponent<PRODUCT_COSTSTATEMENT_ENTITY> {
    constructor(injector: Injector,
        private productCoststatementService: ProductCoststatementServiceProxy) {
        super(injector);
        this.filterInput = new PRODUCT_COSTSTATEMENT_ENTITY();
        this.keyMember = 'producT_COSTSTATEMENT_ID';
        this.filterInput.useR_LOGIN = this.appSession.user.userName;
        //this.filterInput.autH_STATUS = 'A';
        //this.filterInput.level = 'ALL';
        this.pagingClient = true;

    }
    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        var result = await this.productCoststatementService.pRODUCT_COSTSTATEMENT_Search(this.filterInputSearch)
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
