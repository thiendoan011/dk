import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { PO_GROUP_PRODUCT_ENTITY, PDEGroupProductServiceProxy, } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { finalize } from "rxjs/operators";
import { IUiActionList } from "@app/ultilities/ui-action-list";
import { AppConsts } from "@shared/AppConsts";

@Component({
    templateUrl: './pde-req-tablecolor-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class PDEReqTablecolorListComponent extends ListComponentBase<PO_GROUP_PRODUCT_ENTITY> implements IUiActionList<PO_GROUP_PRODUCT_ENTITY>, OnInit, AfterViewInit {
//#region "Constructor"
    constructor(injector: Injector,
        private pdeGroupProductService: PDEGroupProductServiceProxy) {
        super(injector);
        this.remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;
        if(!this.isNullOrEmpty(window["reQ_TABLECOLOR_REQ_STATUS"])){
            this.filterInput.reQ_TABLECOLOR_REQ_STATUS = window["reQ_TABLECOLOR_REQ_STATUS"];
        }
    }
    remoteServiceBaseUrl: string;
    filterInput: PO_GROUP_PRODUCT_ENTITY = new PO_GROUP_PRODUCT_ENTITY();

    // for detail

//#endregion "Constructor"

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiActionList(this);
        // set role toolbar
        this.appToolbar.setRole('PDEReqTablecolor', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();
        // set default value
        this.filterInput.grouP_PRODUCT_STATUS = 'mau';
        this.filterInput.reQ_TABLECOLOR_STATUS = 'U';
    }

    ngAfterViewInit(): void {
        if(!this.isNullOrEmpty(window["reQ_TABLECOLOR_REQ_STATUS"])){
            this.filterInput.reQ_TABLECOLOR_STATUS = "";
            this.onSearch();
            window["reQ_TABLECOLOR_REQ_STATUS"] = undefined;
            this.updateView();
        }
        if(!this.isNullOrEmpty(window["type_dashboard"])){
            this.filterInput.reQ_TABLECOLOR_REQ_STATUS = 'A';
            this.filterInput.reQ_TABLECOLOR_STATUS = window["reQ_TABLECOLOR_STATUS"];
            this.filterInput.iS_SEND_PROGRESS_TABLECOLOR = window["reQ_TABLECOLOR_PROGRESS_EXPECT_MAKER_ID"];
            this.filterInput.iS_CONFIRM_PROGRESS_TABLECOLOR = window["reQ_TABLECOLOR_PROGRESS_EXACT_MAKER_ID"];
            this.onSearch();
            window["type_dashboard"] = undefined;
            window["reQ_TABLECOLOR_STATUS"] = undefined;
            window["reQ_TABLECOLOR_PROGRESS_EXPECT_MAKER_ID"] = undefined;
            window["reQ_TABLECOLOR_PROGRESS_EXACT_MAKER_ID"] = undefined;
            this.updateView();
        }
        this.updateView();
    }

    search(): void {
        this.showTableLoading(); 
        this.setSortingForFilterModel(this.filterInputSearch);

        this.pdeGroupProductService.pDE_GROUP_PRODUCT_REQUEST_TABLECOLOR_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
    }

    onAdd(): void {
        this.navigatePassParam('/app/admin/pde-req-tablecolor-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: PO_GROUP_PRODUCT_ENTITY): void {
        this.navigatePassParam('/app/admin/pde-req-tablecolor-edit', { id: item.grouP_PRODUCT_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: PO_GROUP_PRODUCT_ENTITY): void {
        
    }

    onViewDetail(item: PO_GROUP_PRODUCT_ENTITY): void {
        this.navigatePassParam('/app/admin/pde-req-tablecolor-view', { id: item.grouP_PRODUCT_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onResetSearch(): void {
        this.filterInput = new PO_GROUP_PRODUCT_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
    }

    onViewDetailImage(){
        window.open(this.remoteServiceBaseUrl + '/Common/Images/PO/HardwareVT/dinh_tan.jpg')
    }
}
