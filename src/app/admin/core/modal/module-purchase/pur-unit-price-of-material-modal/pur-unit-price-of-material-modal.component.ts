import { ViewEncapsulation, Injector, Component, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { PUR_MATERIAL_ENTITY, PurSearchServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "pur-unit-price-of-material-modal",
    templateUrl: "./pur-unit-price-of-material-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PURUnitPriceOfMaterialModalComponent extends PopupBaseComponent<PUR_MATERIAL_ENTITY> {
    constructor(injector: Injector,
        private purSearchService: PurSearchServiceProxy) {
        super(injector);
        this.filterInput = new PUR_MATERIAL_ENTITY();
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

        var result = await this.purSearchService.pUR_UNIT_PRICE_OR_MATERIAL_Search(this.filterInputSearch)
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
