import { ViewEncapsulation, Injector, Component, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { TlUserServiceProxy, TL_USER_ENTITY } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "tl-user-modal",
    templateUrl: "./tl-user-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class TLUserModalComponent extends PopupBaseComponent<TL_USER_ENTITY> {
    constructor(injector: Injector,
        private tlUserService: TlUserServiceProxy,) {
        super(injector);
        this.pagingClient = true;
        this.filterInput = new TL_USER_ENTITY();
        this.keyMember = 'tlnanme';
        //default filter
        this.filterInput.useR_LOGIN = this.appSession.user.userName;

    }

    _title: string = '';
    @Input() set title(value: string) {
        this._title = value;
    }
    get title(): string {
        return this._title;
    }
        
    async getResult(checkAll: boolean = false): Promise<any> {

        this.setSortingForFilterModel(this.filterInputSearch);

        var result = await this.tlUserService.tL_USER_Search(this.filterInputSearch)
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
