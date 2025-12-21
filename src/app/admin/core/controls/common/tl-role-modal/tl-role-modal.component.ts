import { ViewEncapsulation, Injector, Component, ViewChild, Output, EventEmitter, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { CM_BRANCH_ENTITY, BranchServiceProxy, DOCUMENT_ROLE_ENTITY, DocumentServiceProxy, TL_ROLE_ENTITY, RoleServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "tl-role-modal",
    templateUrl: "./tl-role-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class TLRoleModalComponent extends PopupBaseComponent<TL_ROLE_ENTITY> {
    constructor(injector: Injector,
        private tlRoleService: RoleServiceProxy) {
        super(injector);
        this.filterInput = new TL_ROLE_ENTITY();
        this.filterInput.top = 300;

        this.keyMember = 'ID';

    }

    // Gắn cờ để có được search tất cả hay không : SearchAllFlag = true
    @Input() searchAllFlag: boolean = false;

    initComboFromApi(){
        this.tlRoleService.tL_ROLE_Search(this.getFillterForCombobox()).subscribe(result => {
            this.lstRole = result.items;
            this.updateView();
        });
    }


    @Input() Title: string = this.l('Tìm kiếm nhóm quyền') 
    @Input() showColPotential: boolean = true
    @Input() showColAuthStatus: boolean = true


    lstRole: TL_ROLE_ENTITY[];
    async getResult(checkAll: boolean = false): Promise<any> {
        this.setSortingForFilterModel(this.filterInputSearch);

        if (checkAll) {
            this.filterInputSearch.maxResultCount = -1;
        }

        var result = await this.tlRoleService.tL_ROLE_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading())).toPromise();

        if (checkAll) {
            var item = "";
            this.selectedItems = result.items;
        }
        else {
            this.dataTable.records = result.items;
            this.dataTable.totalRecordsCount = result.totalCount;
            this.filterInputSearch.totalCount = result.totalCount;
        }

        return result;
    }
}
