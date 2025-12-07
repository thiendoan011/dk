import { ViewEncapsulation, Injector, Component, ViewChild, Output, EventEmitter, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { PO_CUSTOMER_ENTITY, PoCustomerrServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "po-customer-modal",
    templateUrl: "./po-customer-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PoCustomerModalComponent extends PopupBaseComponent<PO_CUSTOMER_ENTITY> {
    constructor(injector: Injector,
        private poCustomerService: PoCustomerrServiceProxy) {
        super(injector);
        this.filterInput = new PO_CUSTOMER_ENTITY();
        this.keyMember = 'customeR_ID';
        this.filterInput.useR_LOGIN = this.appSession.user.userName;
        //this.filterInput.autH_STATUS = 'A';
        //this.filterInput.level = 'ALL';
        this.pagingClient = true;

    }
    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        var result = await this.poCustomerService.pO_CUSTOMER_Search(this.filterInputSearch)
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
