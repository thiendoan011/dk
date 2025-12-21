import { ViewEncapsulation, Injector, Component } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { PUR_REQUISITION_MATERIAL_EDITTABLE, PurRequisitionServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "pur-requisition-material-modal",
    templateUrl: "./pur-requisition-material-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PURRequisitionMaterialModalComponent extends PopupBaseComponent<PUR_REQUISITION_MATERIAL_EDITTABLE> {
    constructor(injector: Injector,
        private purRequisitionService: PurRequisitionServiceProxy) {
        super(injector);
        this.filterInput = new PUR_REQUISITION_MATERIAL_EDITTABLE();
        this.keyMember = 'id';
        //this.filterInput.brancH_LOGIN = this.appSession.user.subbrId;
        this.pagingClient = true;

    }
    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        var result = await this.purRequisitionService.pUR_REQUISITION_MATERIAL_Search(this.filterInputSearch)
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
