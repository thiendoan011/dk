import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { CM_BRANCH_ENTITY, BranchServiceProxy, AsposeServiceProxy, ReportInfo, PoPurchaseServiceProxy, PO_PURCHASE_ENTITY, } from "@shared/service-proxies/service-proxies";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";

@Component({
    templateUrl: './po-purchase-state-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class PoPurchaseStateListComponent extends ListComponentBase<PO_PURCHASE_ENTITY> implements IUiAction<PO_PURCHASE_ENTITY>, OnInit, AfterViewInit {
    filterInput: PO_PURCHASE_ENTITY = new PO_PURCHASE_ENTITY();
    branchName: string
    PoPurchaseParents: PO_PURCHASE_ENTITY[];
    branches: CM_BRANCH_ENTITY[];

    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private branchService: BranchServiceProxy,
        private poPurchaseService: PoPurchaseServiceProxy) {
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
        this.appToolbar.setRole('PoPurchaseState', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();

        this.branchName = this.appSession.user.branchName;
        this.filterInput.purchasE_IMPORT_PROCESS = 'C';
        this.updateView();
    }

    ngAfterViewInit(): void {
        this.onSearch();
        this.updateView()
    }

    initDefaultFilter() {
        this.filterInput.brancH_ID = this.appSession.user.subbrId;
        this.filterInput.brancH_LOGIN = this.appSession.user.subbrId;
        this.filterInput.purchasE_IMPORT_PROCESS = 'C';
		//this.filterInput.level = 'UNIT'
		//this.filterInput.removE_LIQ = '0';
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

        this.poPurchaseService.pO_Purchase_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
    }

    onAdd(): void {
        //this.navigatePassParam('/app/admin/po-purchase-state-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: PO_PURCHASE_ENTITY): void {
        this.navigatePassParam('/app/admin/po-purchase-state-edit', { id: item.purchasE_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: PO_PURCHASE_ENTITY): void {
        /*if (item.autH_STATUS == AuthStatusConsts.Approve) {
            this.showErrorMessage(this.l('DeleteFailed'));
            this.updateView()
            return
        }

        this.message.confirm(
            this.l('DeleteWarningMessage', item.purchasE_CODE),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.poPurchaseService.pO_Purchase_Del(item.purchasE_ID)
                        .pipe(finalize(() => { this.saving = false; }))
                        .subscribe((response) => {
                            if (response['Result'] != '0') {
                                this.showErrorMessage(response["ErrorDesc"]);
                            }
                            else {
                                this.showSuccessMessage(this.l('SuccessfullyDeleted'));
                                this.filterInputSearch.totalCount = 0;
                                this.reloadPage();
                            }
                            this.updateView()
                        });
                }
            }
        );*/
    }

    onApprove(item: PO_PURCHASE_ENTITY): void {

    }

    onViewDetail(item: PO_PURCHASE_ENTITY): void {
        this.navigatePassParam('/app/admin/po-purchase-state-view', { id: item.purchasE_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onSave(): void {

    }



    onResetSearch(): void {
        this.filterInput = new PO_PURCHASE_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
    }
}
