import { AfterViewInit, Component, Injector, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { ListComponentBase } from "@app/ultilities/list-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { CM_BRANCH_ENTITY, PoReportServiceProxy, PO_REPORT_WEEKLY_DAILYKPI_DTO } from "@shared/service-proxies/service-proxies";
import * as moment from "moment";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'page-dailykpi',
	templateUrl: './page-dailykpi.component.html',
	encapsulation: ViewEncapsulation.None,
	animations: [ appModuleAnimation() ]
})

export class PageDailyKPIComponent extends ListComponentBase<PO_REPORT_WEEKLY_DAILYKPI_DTO> implements OnInit, AfterViewInit {
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

    filterInput: PO_REPORT_WEEKLY_DAILYKPI_DTO = new PO_REPORT_WEEKLY_DAILYKPI_DTO();

    ngOnInit(): void {
        this.filterInput.brancH_ID = this.appSession.user.subbrId;
        this.filterInput.week = moment().week().toString();
        this.filterInput.year = moment().year().toString();
        this.updateView();
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    ngOnChanges(){
        this.updateView();
    }

    refreshTable(){
        this.updateView();
    }

    search(){
        this.showTableLoading();
        this.setSortingForFilterModel(this.filterInputSearch);

        this.poReportService.pO_REPORT_WEEKLY_DAILYKPI_Search(this.filterInputSearch)
        .pipe(finalize(() => this.hideTableLoading()))
        .subscribe(result => {
            this.dataTable.records = result.items;
            this.dataTable.totalRecordsCount = result.totalCount;
            this.filterInputSearch.totalCount = result.totalCount;
            this.updateView();
        });
    }
    onResetSearch(): void {
        this.filterInput = new PO_REPORT_WEEKLY_DAILYKPI_DTO();
        this.initDefaultFilter()
        this.changePage(0);
    }  
}