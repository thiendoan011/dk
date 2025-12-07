import { ViewEncapsulation, Injector, Component, ViewChild, Output, EventEmitter, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { ComponentBase } from "@app/ultilities/component-base";
import { ListComponentBase } from "@app/ultilities/list-component-base";
import { CM_BRANCH_ENTITY, BranchServiceProxy, DOCUMENT_ROLE_ENTITY, DocumentServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "document-role-modal",
    templateUrl: "./document-role-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class DocumentRoleModalComponent extends PopupBaseComponent<DOCUMENT_ROLE_ENTITY> {
    constructor(injector: Injector,
        private documentService: DocumentServiceProxy) {
        super(injector);
        this.filterInput = new DOCUMENT_ROLE_ENTITY();
        this.filterInput.top = 300;

        this.keyMember = 'documenT_ROLE_ID';

    }

    // Gắn cờ để có được search tất cả hay không : SearchAllFlag = true
    @Input() searchAllFlag: boolean = false;

    initComboFromApi(){
        this.documentService.dOC_ROLE_Search(this.getFillterForCombobox()).subscribe(result => {
            this.lstBranch = result.items;
            this.updateView();
        });
    }


    @Input() branchTitle: string = this.l('Tìm kiếm nhóm quyền') 
    @Input() showColPotential: boolean = true
    @Input() showColAuthStatus: boolean = true


    lstBranch: DOCUMENT_ROLE_ENTITY[];
    async getResult(checkAll: boolean = false): Promise<any> {
        this.setSortingForFilterModel(this.filterInputSearch);

        if (checkAll) {
            this.filterInputSearch.maxResultCount = -1;
        }

        var result = await this.documentService.dOC_ROLE_Search(this.filterInputSearch)
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
