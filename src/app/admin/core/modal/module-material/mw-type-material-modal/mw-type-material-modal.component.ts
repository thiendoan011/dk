import { ViewEncapsulation, Injector, Component, ViewChild, Output, EventEmitter, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { MWTypeServiceProxy, MW_TYPE_ENTITY } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "mw-type-material-modal",
    templateUrl: "./mw-type-material-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class MWTypeMaterialModalComponent extends PopupBaseComponent<MW_TYPE_ENTITY> {
    constructor(injector: Injector,
        private mwTypeService: MWTypeServiceProxy,) {
        super(injector);
        this.filterInput = new MW_TYPE_ENTITY();
        this.keyMember = 'mW_TYPE_ID';
        this.filterInput.useR_LOGIN = this.appSession.user.userName;
        //this.filterInput.autH_STATUS = 'A';
        //this.filterInput.level = 'ALL';
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

        var result = await this.mwTypeService.mW_TYPE_Search(this.filterInputSearch)
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
