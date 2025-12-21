import { AfterViewInit, Component, Injector, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { ListComponentBase } from "@app/ultilities/list-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { CM_BRANCH_ENTITY, PoReportServiceProxy, PO_REPORT_WEEKLY_HISTORY_PRODUCTED_PART_EDITTABLE } from "@shared/service-proxies/service-proxies";
import * as moment from "moment";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'po-rpt-weekly-page-2',
	templateUrl: './po-rpt-weekly-page-2.component.html',
	encapsulation: ViewEncapsulation.None,
	animations: [ appModuleAnimation() ]
})

export class POReportWeeklyPage2Component extends ListComponentBase<PO_REPORT_WEEKLY_HISTORY_PRODUCTED_PART_EDITTABLE> implements OnInit, AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
        private poReportService: PoReportServiceProxy
    ) {
        super(injector);
        this.initFilter();
        this.stopAutoUpdateView()
        this.setupValidationMessage()
    }

    _title: string;
    @Input() set title(value: string) {
        this._title = value;
    }
    get title(): string {
        return this._title;
    }

    _list_branch: CM_BRANCH_ENTITY[];
    @Input() set list_branch(value) {
        this._list_branch = value;
    }
//#endregion "Constructor"    

    filterInput: PO_REPORT_WEEKLY_HISTORY_PRODUCTED_PART_EDITTABLE = new PO_REPORT_WEEKLY_HISTORY_PRODUCTED_PART_EDITTABLE();

    ngOnInit(): void {
        this.updateView();
    }

    ngAfterViewInit(): void {
        this.onSearch();
        this.updateView();
    }

    ngOnChanges(){
        this.updateView();
    }

    setFilterInputSearch() {

    }

    initDefaultFilter() {
        this.filterInput.brancH_ID = this.appSession.user.subbrId;
        this.filterInput.frmdate = moment();
        this.filterInput.todate = moment();
    }

    search(){
        this.showTableLoading();
        this.setSortingForFilterModel(this.filterInputSearch);

        this.poReportService.pO_REPORT_WEEKLY_HISTORY_PRODUCTED_PART_Search(this.filterInputSearch)
        .pipe(finalize(() => this.hideTableLoading()))
        .subscribe(result => {
            this.dataTable.records = result.items;
            this.dataTable.totalRecordsCount = result.totalCount;
            this.filterInputSearch.totalCount = result.totalCount;
            this.updateView();
        });
    }
    onResetSearch(): void {
        this.filterInput = new PO_REPORT_WEEKLY_HISTORY_PRODUCTED_PART_EDITTABLE();
        this.initDefaultFilter()
        this.changePage(0);
    }

//#region Hyperlink
    // PO
    onViewDetailPO(item: PO_REPORT_WEEKLY_HISTORY_PRODUCTED_PART_EDITTABLE){
        window.open("/app/admin/po-master-view;id="+ item.pO_ID);
    }
    // Hệ hàng
    onViewDetailGroupProduct(item: PO_REPORT_WEEKLY_HISTORY_PRODUCTED_PART_EDITTABLE){
        window.open("/app/admin/po-group-product-view;id="+ item.grouP_PRODUCT_ID);
    }

    // Sản phẩm
    onViewDetailProduct(item: PO_REPORT_WEEKLY_HISTORY_PRODUCTED_PART_EDITTABLE){
        window.open("/app/admin/product-product-view;id="+ item.producT_ID);
    }
//#endregion Hyperlink  
}