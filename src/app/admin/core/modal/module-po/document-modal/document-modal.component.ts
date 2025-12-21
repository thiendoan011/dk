import { ViewEncapsulation, Injector, Component, ViewChild, Output, EventEmitter, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { AllCodeServiceProxy, ATTACH_FILE_ENTITY, DocumentServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "document-modal",
    templateUrl: "./document-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class DocumentModalComponent extends PopupBaseComponent<ATTACH_FILE_ENTITY> {
    constructor(injector: Injector,
        private documentService: DocumentServiceProxy,
        private allCodeService: AllCodeServiceProxy) {
        super(injector);
        this.filterInput = new ATTACH_FILE_ENTITY();
        this.keyMember = 'attacH_ID';
        this.filterInput.brancH_ID = this.appSession.user.subbrId;
        this.filterInput.brancH_LOGIN = this.appSession.user.subbrId;
        this.filterInput.useR_LOGIN = this.appSession.user.userName;
        this.pagingClient = true;

    }
    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        var result = await this.documentService.dOC_ATTACH_FILE_Search(this.filterInputSearch)
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
