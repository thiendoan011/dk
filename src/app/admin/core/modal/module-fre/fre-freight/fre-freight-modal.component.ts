import { ViewEncapsulation, Injector, Component, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { FRE_FREIGHT_ENTITY, FreightServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "fre-freight-modal",
    templateUrl: "./fre-freight-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class FREFreightModalComponent extends PopupBaseComponent<FRE_FREIGHT_ENTITY> {
    constructor(injector: Injector,
        private freightService: FreightServiceProxy) {
        super(injector);
        this.pagingClient = true;
        this.filterInput = new FRE_FREIGHT_ENTITY();
        this.keyMember = 'FRE_FREIGHT_ID';
        //default filter
        this.filterInput.useR_LOGIN = this.appSession.user.userName;

    }

    _title: string = '';
    @Input() set title(value: string) {
        this._title = value;
    }
    get title(): string {
        return this._title;
    }
        
    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        var result = await this.freightService.fRE_FREIGHT_Search(this.filterInputSearch)
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
