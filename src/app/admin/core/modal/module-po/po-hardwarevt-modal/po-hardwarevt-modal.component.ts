import { ViewEncapsulation, Injector, Component, ViewChild, Output, EventEmitter, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { PO_HARDWAREVT_ENTITY, PoHardwareVTServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "po-hardwarevt-modal",
    templateUrl: "./po-hardwarevt-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PoHardwareVTModalComponent extends PopupBaseComponent<PO_HARDWAREVT_ENTITY> {
    constructor(
        injector: Injector,
        private poHardwareVTService: PoHardwareVTServiceProxy
        ) {
        super(injector);
        this.filterInput = new PO_HARDWAREVT_ENTITY();
        this.keyMember = 'hardwarevT_ID';
        this.pagingClient = true;

    }
    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        var result = await this.poHardwareVTService.pO_HARDWAREVT_Search(this.filterInputSearch)
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
