import { ViewEncapsulation, Injector, Component } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { RServiceProxy, R_ENTITY } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "r-modal",
    templateUrl: "./r-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class RModalComponent extends PopupBaseComponent<R_ENTITY> {
    constructor(injector: Injector,
        private _rService: RServiceProxy) {
        super(injector);
        this.filterInput = new R_ENTITY();
        this.keyMember = 'r_ID';
        this.filterInput.brancH_LOGIN = this.appSession.user.subbrId;
        this.pagingClient = true;

    }
    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        var result = await this._rService.r_Search(this.filterInputSearch)
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
