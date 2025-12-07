import { ViewEncapsulation, Injector, Component } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { PO_HARDWAREDG_ENTITY, PoHardwareDGServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "po-hardwaredg-modal",
    templateUrl: "./po-hardwaredg-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PoHardwareDGModalComponent extends PopupBaseComponent<PO_HARDWAREDG_ENTITY> {
    constructor(
        injector: Injector,
        private poHardwareDGService: PoHardwareDGServiceProxy
        ) {
        super(injector);
        this.filterInput = new PO_HARDWAREDG_ENTITY();
        this.keyMember = 'hardwaredG_ID';
        this.pagingClient = true;

    }
    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        var result = await this.poHardwareDGService.pO_HARDWAREDG_Search(this.filterInputSearch)
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
