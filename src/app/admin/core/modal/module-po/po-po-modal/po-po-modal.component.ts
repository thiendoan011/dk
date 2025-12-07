import { ViewEncapsulation, Injector, Component } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { PoMasterServiceProxy, PO_ENTITY, CM_BRANCH_ENTITY, BranchServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "po-po-modal",
    templateUrl: "./po-po-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PoPOModalComponent extends PopupBaseComponent<PO_ENTITY> {
    constructor(injector: Injector,
        private poCustomerService: PoMasterServiceProxy,
        private branchService: BranchServiceProxy) {
        super(injector);
        this.filterInput = new PO_ENTITY();
        this.keyMember = 'pO_ID';
        this.filterInput.brancH_ID = this.appSession.user.subbrId;
        this.filterInput.brancH_LOGIN = this.appSession.user.subbrId;
        this.pagingClient = true;   // true --> không paging ở stored | false --> paging ở stored | nên gán ở nơi call modal
        this.initCombobox();

    }
    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        var result = await this.poCustomerService.pO_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading())).toPromise();

        if (checkAll) {
            this.selectedItems = result.items;
        }
        else {
            this.setRecords(result);
        }

        return result;
    }

    branches: CM_BRANCH_ENTITY[];
    initCombobox(): void {
        let filterCombobox = this.getFillterForCombobox();
        this.branchService.cM_BRANCH_Search(filterCombobox).subscribe(response => {
            this.branches = response.items;
            this.updateView()
        });
    }

    openPoView(item: PO_ENTITY, event: MouseEvent): void {
        // Rất quan trọng: Ngăn sự kiện click này lan ra <tr> 
        // và trigger hàm selectRow() của hàng.
        event.stopPropagation();
        
        window.open("/app/admin/po-master-view;id=" + item.pO_ID);
    }
}
