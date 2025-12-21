import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { PO_PRODUCTED_PART_VENEER_ENTITY, CM_BRANCH_ENTITY, BranchServiceProxy, AsposeServiceProxy, ReportInfo, PoProductedPartVeneerServiceProxy, } from "@shared/service-proxies/service-proxies";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";

@Component({
    templateUrl: './po-producted-part-veneer-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class PoProductedPartVeneerListComponent extends ListComponentBase<PO_PRODUCTED_PART_VENEER_ENTITY> implements IUiAction<PO_PRODUCTED_PART_VENEER_ENTITY>, OnInit, AfterViewInit {
    filterInput: PO_PRODUCTED_PART_VENEER_ENTITY = new PO_PRODUCTED_PART_VENEER_ENTITY();
    branchName: string
    PoMasterParents: PO_PRODUCTED_PART_VENEER_ENTITY[];
    branches: CM_BRANCH_ENTITY[];

    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private branchService: BranchServiceProxy,
        private poProductedPartVeneerService: PoProductedPartVeneerServiceProxy) {
        super(injector);

        this.initFilter();
        this.initCombobox()
        this.stopAutoUpdateView()
        this.setupValidationMessage()
    }

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiAction(this);
        // set role toolbar
        this.appToolbar.setRole('PoProductedPartVeneer', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();

        this.branchName = this.appSession.user.branchName;
        this.filterInput.typE_SEARCH = 'PRODUCTED_PART';
    }

    ngAfterViewInit(): void {
        this.updateView()
    }

    initDefaultFilter() {
        this.filterInput.brancH_ID = this.appSession.user.subbrId;
        this.filterInput.brancH_LOGIN = this.appSession.user.subbrId;
    }

    setSearchFinterInput() {

    }

    setFilterInputSearch() {
    }

    initCombobox(): void {
        let filterCombobox = this.getFillterForCombobox();
        this.branchService.cM_BRANCH_Search(filterCombobox).subscribe(response => {
            this.branches = response.items;
            this.updateView()
        });
    }

    exportToExcel() {
        // this.filterInput.n_PLATE = 'nasdsd';
        // this.updateView();
        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        this.setFilterInputSearch()
        let filterReport = { ...this.filterInputSearch }
        filterReport.maxResultCount = -1;

        reportInfo.parameters = this.GetParamsFromFilter(filterReport)

        reportInfo.pathName = "/PO_MASTER/rpt_po_master.xlsx";
        reportInfo.storeName = "PO_MASTER_Search";

        this.asposeService.getReport(reportInfo).subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }
    search(): void {

        this.showTableLoading();

        this.setSortingForFilterModel(this.filterInputSearch);
        this.setFilterInputSearch();

        this.poProductedPartVeneerService.pO_PRODUCTED_PART_VENEER_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
    }

    onAdd(): void {
    }

    onUpdate(item: PO_PRODUCTED_PART_VENEER_ENTITY): void {
        this.navigatePassParam('/app/admin/po-producted-part-veneer-edit', { id: item.pO_PRODUCTED_PART_VENEER_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: PO_PRODUCTED_PART_VENEER_ENTITY): void {
    }

    onApprove(item: PO_PRODUCTED_PART_VENEER_ENTITY): void {
        
    }

    onViewDetail(item: PO_PRODUCTED_PART_VENEER_ENTITY): void {
        this.navigatePassParam('/app/admin/po-producted-part-veneer-view', { id: item.pO_PRODUCTED_PART_VENEER_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onSave(): void {

    }

    onResetSearch(): void {
        this.filterInput = new PO_PRODUCTED_PART_VENEER_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
    }

    onchangeFilterPO(){
        this.updateView();
    }
}
