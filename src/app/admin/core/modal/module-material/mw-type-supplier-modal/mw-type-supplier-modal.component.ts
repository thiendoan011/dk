import { ViewEncapsulation, Injector, Component, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { MWTypeServiceProxy, MW_TYPE_SUPPLIER_PRICE_ENTITY } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "mw-type-supplier-modal",
    templateUrl: "./mw-type-supplier-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class MWTypeSupplierModalComponent extends PopupBaseComponent<MW_TYPE_SUPPLIER_PRICE_ENTITY> {
    constructor(injector: Injector,
        private mwTypeService: MWTypeServiceProxy,) {
        super(injector);
        this.filterInput = new MW_TYPE_SUPPLIER_PRICE_ENTITY();
        this.keyMember = 'suP_ID';
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

        var result = await this.mwTypeService.mW_TYPE_SUPPLIER_Search(this.filterInputSearch)
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
