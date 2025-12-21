import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { CM_BRANCH_ENTITY, BranchServiceProxy, AsposeServiceProxy, ReportInfo, PO_ENTITY, PoProductedPartDetailServiceProxy, } from "@shared/service-proxies/service-proxies";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";

@Component({
    templateUrl: './po-producted-part-embryo-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class PoProductedPartEmbryoListComponent extends ListComponentBase<PO_ENTITY> implements IUiAction<PO_ENTITY>, OnInit, AfterViewInit {
    filterInput: PO_ENTITY = new PO_ENTITY();
    branchName: string
    PoProductParents: PO_ENTITY[];
    branches: CM_BRANCH_ENTITY[];

    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private branchService: BranchServiceProxy,
        private poProductedPartDetailService: PoProductedPartDetailServiceProxy) {
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
        this.appToolbar.setRole('PoProductedPartDetail', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();

        this.branchName = this.appSession.user.branchName;
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

        this.filterInputSearch.pO_PRODUCTED_PART_CODE = 'CD1'
        this.poProductedPartDetailService.pO_Producted_Part_Detail_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
    }

    onStartProductedPart(record: PO_ENTITY){
        abp.ui.setBusy()
        this.poProductedPartDetailService
			.pO_PRODUCTED_PART_DETAIL_Start(record.pO_ID, "CD1", "Công đoạn phôi")
			.pipe(finalize(() => {abp.ui.clearBusy();}))
			.subscribe((res) => {
				if (res['Result'] != '0') {
					this.showErrorMessage(res['ErrorDesc']);
				} else {
					this.showSuccessMessage(res['ErrorDesc']);
                    record.iS_START = '1';
                    this.updateView();
				}
			});
    }

    onAdd(): void {
        //this.navigatePassParam('/app/admin/po-producted-part-embryo-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: PO_ENTITY): void {
        this.navigatePassParam('/app/admin/po-producted-part-embryo-edit', { po_id: item.pO_ID, producted_part_code: item.pO_PRODUCTED_PART_CODE }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: PO_ENTITY): void {
        
    }

    onApprove(item: PO_ENTITY): void {

    }

    onViewDetail(item: PO_ENTITY): void {
        this.navigatePassParam('/app/admin/po-producted-part-embryo-view', { po_id: item.pO_ID, producted_part_code: item.pO_PRODUCTED_PART_CODE }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onSave(): void {

    }



    onResetSearch(): void {
        this.filterInput = new PO_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
    }
}
