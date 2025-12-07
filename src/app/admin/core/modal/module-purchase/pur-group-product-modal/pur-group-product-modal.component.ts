import { ViewEncapsulation, Injector, Component, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { PUR_GROUP_PRODUCT_ENTITY, PurSearchServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "pur-group-product-modal",
    templateUrl: "./pur-group-product-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PURGroupProductModalComponent extends PopupBaseComponent<PUR_GROUP_PRODUCT_ENTITY> {
    constructor(injector: Injector,
        private purSearchService: PurSearchServiceProxy) {
        super(injector);
        this.filterInput = new PUR_GROUP_PRODUCT_ENTITY();
        this.keyMember = 'id';
        this.pagingClient = true;

    }
    
    _title: string;
    @Input() set title(value: string) {
        this._title = value;
    }
    get title(): string {
        return this._title;
    }
    
    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        var result = await this.purSearchService.pUR_GROUP_PRODUCT_Search(this.filterInputSearch)
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
