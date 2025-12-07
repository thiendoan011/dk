import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { PO_CUSTOMER_ENTITY, CM_BRANCH_ENTITY, BranchServiceProxy, AsposeServiceProxy, PoCustomerrServiceProxy, } from "@shared/service-proxies/service-proxies";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { AuthStatusConsts } from "@app/admin/core/ultils/consts/AuthStatusConsts";
import { EditPageState } from "@app/ultilities/enum/edit-page-state";
@Component({
    templateUrl: './po-customer-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class PoCustomerListComponent extends ListComponentBase<PO_CUSTOMER_ENTITY> implements IUiAction<PO_CUSTOMER_ENTITY>, OnInit, AfterViewInit {
    filterInput: PO_CUSTOMER_ENTITY = new PO_CUSTOMER_ENTITY();
    branchName: string
    PoCustomerParents: PO_CUSTOMER_ENTITY[];
    branches: CM_BRANCH_ENTITY[];
    editPageState: EditPageState;
    EditPageState = EditPageState;

    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private branchService: BranchServiceProxy,
        private poCustomerService: PoCustomerrServiceProxy) {
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
        this.appToolbar.setRole('PoCustomer', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();

        this.branchName = this.appSession.user.branchName;
    }

    ngAfterViewInit(): void {
        this.updateView()
    }

    initDefaultFilter() {
        this.filterInput.top = 200;
    }

    setSearchFinterInput() {

    }

    setFilterInputSearch() {

    }

    initCombobox(): void {
        let filterCombobox = this.getFillterForCombobox();
    }

    exportToExcel() {
        /*
        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        this.setFilterInputSearch()
        let filterReport = { ...this.filterInputSearch }
        filterReport.maxResultCount = -1;

        reportInfo.parameters = this.GetParamsFromFilter(filterReport)

        reportInfo.pathName = "/PO_MASTER/rpt_po_customer.xlsx";
        reportInfo.storeName = "PO_MASTER_Search";

        this.asposeService.getReport(reportInfo).subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });*/
    }
    search(): void {

        this.showTableLoading();
        this.setSortingForFilterModel(this.filterInputSearch);
        this.setFilterInputSearch();

        this.poCustomerService.pO_CUSTOMER_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
    }

    onAdd(): void {
        this.navigatePassParam('/app/admin/po-customer-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: PO_CUSTOMER_ENTITY): void {
        this.navigatePassParam('/app/admin/po-customer-edit', { id: item.customeR_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: PO_CUSTOMER_ENTITY): void {
        if (item.autH_STATUS == AuthStatusConsts.Approve) {
            this.showErrorMessage(this.l('DeleteFailed'));
            this.updateView()
            return
        }

        this.message.confirm(
            this.l('DeleteWarningMessage', item.customeR_CODE),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.poCustomerService.pO_CUSTOMER_Del(item.customeR_ID)
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
        );
    }

    onApprove(item: PO_CUSTOMER_ENTITY): void {

    }

    onViewDetail(item: PO_CUSTOMER_ENTITY): void {
        this.navigatePassParam('/app/admin/po-customer-view', { id: item.customeR_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onSave(): void {

    }

    onResetSearch(): void {
        this.filterInput = new PO_CUSTOMER_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
    }
}
