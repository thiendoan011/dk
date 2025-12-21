import { ViewEncapsulation, Injector, Component, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { VHE_VEHICLE_REQUEST_ENTITY, VHEVehicleRequestServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "vhe-vehicle-request-modal",
    templateUrl: "./vhe-vehicle-request-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class VHEVehicleRequestModalComponent extends PopupBaseComponent<VHE_VEHICLE_REQUEST_ENTITY> {
    constructor(injector: Injector,
        private vehicleRequestService: VHEVehicleRequestServiceProxy) {
        super(injector);
        this.pagingClient = true;
        this.filterInput = new VHE_VEHICLE_REQUEST_ENTITY();
        this.keyMember = 'VHE_VEHICLE_REQUEST_ID';
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

        var result = await this.vehicleRequestService.vHE_VEHICLE_REQUEST_Search(this.filterInputSearch)
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
