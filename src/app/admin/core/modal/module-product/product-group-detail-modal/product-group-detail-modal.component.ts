import { ViewEncapsulation, Injector, Component, ViewChild, Output, EventEmitter, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { PO_CUSTOMER_ENTITY, PRODUCT_GROUP_DETAIL_ENTITY, PoCustomerrServiceProxy, ProductGroupDetailServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "product-group-detail-modal",
    templateUrl: "./product-group-detail-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class ProductGroupDetailModalComponent extends PopupBaseComponent<PRODUCT_GROUP_DETAIL_ENTITY> {
    constructor(injector: Injector,
        private productGroupDetailService: ProductGroupDetailServiceProxy) {
        super(injector);
        this.filterInput = new PRODUCT_GROUP_DETAIL_ENTITY();
        this.keyMember = 'producT_GROUP_DETAIL_ID';
        this.filterInput.useR_LOGIN = this.appSession.user.userName;
        //this.filterInput.autH_STATUS = 'A';
        //this.filterInput.level = 'ALL';
        this.pagingClient = true;

    }
    
    _title: string;
    @Input() set title(value: string) {
        this._title = value;
    }
    get title(): string {
        return this._title;
    }

    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        var result = await this.productGroupDetailService.pRODUCT_GROUP_DETAIL_Search(this.filterInputSearch)
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
