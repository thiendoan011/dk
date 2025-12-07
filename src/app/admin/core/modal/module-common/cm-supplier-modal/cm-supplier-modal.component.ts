import { ViewEncapsulation, Injector, Component } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { CM_SUPPLIER_ENTITY, SupplierServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "cm-supplier-modal",
    templateUrl: "./cm-supplier-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class CMSupplierModalComponent extends PopupBaseComponent<CM_SUPPLIER_ENTITY> {
    constructor(injector: Injector,
        private supplierService: SupplierServiceProxy) {
        super(injector);
        this.filterInput = new CM_SUPPLIER_ENTITY();
        this.keyMember = 'suP_ID';
        this.filterInput.brancH_ID = this.appSession.user.subbrId;
        this.filterInput.brancH_LOGIN = this.appSession.user.subbrId;
        this.pagingClient = true;

    }
    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        var result = await this.supplierService.cM_SUPPLIER_Search(this.filterInputSearch)
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
