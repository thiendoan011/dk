import { ViewEncapsulation, Injector, Component } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { GroupRServiceProxy, GROUP_R_ENTITY } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "group-r-modal",
    templateUrl: "./group-r-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class GroupRModalComponent extends PopupBaseComponent<GROUP_R_ENTITY> {
    constructor(injector: Injector,
        private _groupRService: GroupRServiceProxy) {
        super(injector);
        this.filterInput = new GROUP_R_ENTITY();
        this.keyMember = 'grouP_R_ID';
        this.filterInput.brancH_LOGIN = this.appSession.user.subbrId;
        this.pagingClient = true;

    }
    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        var result = await this._groupRService.gROUP_R_Search(this.filterInputSearch)
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
