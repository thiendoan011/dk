import { ViewEncapsulation, Injector, Component, Input } from "@angular/core";
import { PO_IMAGE_ENTITY, BranchServiceProxy, PoImageServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { AppConsts } from "@shared/AppConsts";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";

@Component({
    selector: "po-image-modal",
    templateUrl: "./po-image-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class POImageModalComponent extends PopupBaseComponent<PO_IMAGE_ENTITY> {
    constructor(injector: Injector,
        private poImageService: PoImageServiceProxy) {
        super(injector);
        this.filterInput = new PO_IMAGE_ENTITY();
        this.filterInput.top = 300;
        this.filterInput.autH_STATUS = 'A';
        this.remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;

        this.keyMember = 'id';

    }
    remoteServiceBaseUrl: string;

    // Gắn cờ để có được search tất cả hay không : SearchAllFlag = true
    @Input() searchAllFlag: boolean = false;

    initComboFromApi(){
    }


    @Input() title: string = this.l('SearchBranchInfo')
    @Input() showColPotential: boolean = true
    @Input() showColAuthStatus: boolean = true


    lstBranch: PO_IMAGE_ENTITY[];
    async getResult(checkAll: boolean = false): Promise<any> {
        this.setSortingForFilterModel(this.filterInputSearch);

        if (checkAll) {
            this.filterInputSearch.maxResultCount = -1;
        }

        var result = await this.poImageService.pO_IMAGE_Search(this.filterInputSearch)
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

    onViewDetailImage(item: PO_IMAGE_ENTITY){
        window.open(this.remoteServiceBaseUrl + item.urls);
    }
}
