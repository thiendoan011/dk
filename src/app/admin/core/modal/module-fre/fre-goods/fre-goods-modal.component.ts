import { ViewEncapsulation, Injector, Component, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { FRE_GOODS_ENTITY, GoodsServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "fre-goods-modal",
    templateUrl: "./fre-goods-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class FREGoodsModalComponent extends PopupBaseComponent<FRE_GOODS_ENTITY> {
    constructor(injector: Injector,
        private goodsService: GoodsServiceProxy) {
        super(injector);
        this.filterInput = new FRE_GOODS_ENTITY();
        this.keyMember = 'frE_GOODS_ID';
        this.pagingClient = true;
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

        var result = await this.goodsService.fRE_GOODS_Search(this.filterInputSearch)
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
