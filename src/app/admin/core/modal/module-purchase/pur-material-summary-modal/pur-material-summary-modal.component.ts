import { ViewEncapsulation, Injector, Component } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { PUR_REQUISITION_MATERIAL_SUMMARY_EDITTABLE, PurRequisitionProcessServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "pur-material-summary-modal",
    templateUrl: "./pur-material-summary-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PURMaterialSummaryModalComponent extends PopupBaseComponent<PUR_REQUISITION_MATERIAL_SUMMARY_EDITTABLE> {
    constructor(injector: Injector,
        private purRequisitionProcessService: PurRequisitionProcessServiceProxy) {
        super(injector);
        this.filterInput = new PUR_REQUISITION_MATERIAL_SUMMARY_EDITTABLE();
        this.keyMember = 'puR_REQUISITION_MATERIAL_SUMMARY_ID';
        //this.filterInput.brancH_LOGIN = this.appSession.user.subbrId;
        this.pagingClient = true;

    }
    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        var result = await this.purRequisitionProcessService.pUR_REQUISITION_MATERIAL_SUMMARY_Search(this.filterInputSearch)
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
