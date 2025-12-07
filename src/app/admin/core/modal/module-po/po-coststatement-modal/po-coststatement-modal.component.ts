import { ViewEncapsulation, Injector, Component, ViewChild, Output, EventEmitter, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { PO_COSTSTATEMENT_ENTITY, PRODUCT_DETAIL_ENTITY, PoCoststatementServiceProxy, ProductDetailServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "po-coststatement-modal",
    templateUrl: "./po-coststatement-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PoCoststatementModalComponent extends PopupBaseComponent<PO_COSTSTATEMENT_ENTITY> {
    constructor(injector: Injector,
        private poCoststatementService: PoCoststatementServiceProxy,) {
        super(injector);
        this.filterInput = new PO_COSTSTATEMENT_ENTITY();
        this.keyMember = 'coststatemenT_ID';
        this.filterInput.useR_LOGIN = this.appSession.user.userName;
        this.pagingClient = true;

    }
    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        var result = await this.poCoststatementService.pO_COSTSTATEMENT_Search(this.filterInputSearch)
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
