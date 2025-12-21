import { ViewEncapsulation, Injector, Component, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { FRE_LOCATION_ENTITY, LocationServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "fre-location-modal",
    templateUrl: "./fre-location-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class FRELocationModalComponent extends PopupBaseComponent<FRE_LOCATION_ENTITY> {
    constructor(injector: Injector,
        private locationService: LocationServiceProxy) {
        super(injector);
        this.pagingClient = true;
        this.filterInput = new FRE_LOCATION_ENTITY();
        this.keyMember = 'FRE_LOCATION_ID';
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

        var result = await this.locationService.fRE_LOCATION_Search(this.filterInputSearch)
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
