import { ViewEncapsulation, Injector, Component, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { VHE_VEHICLE_ENTITY, VHEVehicleServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "vhe-vehicle-modal",
    templateUrl: "./vhe-vehicle-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class VHEVehicleModalComponent extends PopupBaseComponent<VHE_VEHICLE_ENTITY> {
    constructor(injector: Injector,
        private vehicleService: VHEVehicleServiceProxy) {
        super(injector);
        this.pagingClient = true;
        this.filterInput = new VHE_VEHICLE_ENTITY();
        this.keyMember = 'VHE_VEHICLE_ID';
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

        var result = await this.vehicleService.vHE_VEHICLE_Search(this.filterInputSearch)
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
