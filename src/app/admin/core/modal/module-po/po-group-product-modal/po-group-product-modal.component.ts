import { ViewEncapsulation, Injector, Component, ViewChild, Output, EventEmitter, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { AllCodeServiceProxy, PO_GROUP_PRODUCT_ENTITY, PoGroupProductServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "po-group-product-modal",
    templateUrl: "./po-group-product-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PoGroupProductModalComponent extends PopupBaseComponent<PO_GROUP_PRODUCT_ENTITY> {
    constructor(injector: Injector,
        private poGroupProductService: PoGroupProductServiceProxy,
        private allCodeService: AllCodeServiceProxy) {
        super(injector);
        this.filterInput = new PO_GROUP_PRODUCT_ENTITY();
        this.keyMember = 'grouP_PRODUCT_ID';
        //this.filterInput.brancH_LOGIN = this.appSession.user.subbrId;
        this.filterInput.autH_STATUS = 'A';
        //this.filterInput.level = 'ALL';
        this.filterInput.top = 1000;
        this.pagingClient = true;

    }
    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        var result = await this.poGroupProductService.pO_Group_Product_Search(this.filterInputSearch)
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
