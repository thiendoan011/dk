import { ViewEncapsulation, Injector, Component, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { VHEDriverServiceProxy, VHE_DRIVER_ENTITY } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "vhe-driver-modal",
    templateUrl: "./vhe-driver-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class VHEDriverModalComponent extends PopupBaseComponent<VHE_DRIVER_ENTITY> {
    constructor(injector: Injector,
        private vheDriverService: VHEDriverServiceProxy) {
        super(injector);
        this.pagingClient = true;
        this.filterInput = new VHE_DRIVER_ENTITY();
        this.keyMember = 'VHE_DRIVER_ID';
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

        var result = await this.vheDriverService.vHE_DRIVER_Search(this.filterInputSearch)
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
