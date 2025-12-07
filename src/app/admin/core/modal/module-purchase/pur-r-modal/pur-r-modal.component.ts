import { ViewEncapsulation, Injector, Component, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { PUR_R_ENTITY, PurSearchServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "pur-r-modal",
    templateUrl: "./pur-r-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PURRModalComponent extends PopupBaseComponent<PUR_R_ENTITY> {
    constructor(injector: Injector,
        private purSearchService: PurSearchServiceProxy) {
        super(injector);
        this.filterInput = new PUR_R_ENTITY();
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

        var result = await this.purSearchService.pUR_R_Search(this.filterInputSearch)
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
