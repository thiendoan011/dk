import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from "@angular/core";
import { CM_BRANCH_ENTITY, BranchServiceProxy, AsposeServiceProxy, ReportInfo, PO_GROUP_PRODUCT_ENTITY, PoGroupProductServiceProxy, PO_CUSTOMER_ENTITY, } from "@shared/service-proxies/service-proxies";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { AuthStatusConsts } from "@app/admin/core/ultils/consts/AuthStatusConsts";
import { RecordStatusConsts } from "@app/admin/core/ultils/consts/RecordStatusConsts";
import { PoCustomerModalComponent } from "@app/admin/core/modal/module-po/po-customer-modal/po-customer-modal.component";

@Component({
    templateUrl: './group-product-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class PoGroupProductListComponent extends ListComponentBase<PO_GROUP_PRODUCT_ENTITY> implements IUiAction<PO_GROUP_PRODUCT_ENTITY>, OnInit, AfterViewInit {
    filterInput: PO_GROUP_PRODUCT_ENTITY = new PO_GROUP_PRODUCT_ENTITY();
    branchName: string
    PoGroupProductParents: PO_GROUP_PRODUCT_ENTITY[];
    branches: CM_BRANCH_ENTITY[];

    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private branchService: BranchServiceProxy,
        private poGroupProductService: PoGroupProductServiceProxy) {
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
        this.appToolbar.setRole('PoGroupProduct', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();

        this.branchName = this.appSession.user.branchName;
    }

    ngAfterViewInit(): void {
        this.updateView()
    }

    initDefaultFilter() {
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

        this.poGroupProductService.pO_Group_Product_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
    }

    onAdd(): void {
        this.navigatePassParam('/app/admin/po-group-product-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: PO_GROUP_PRODUCT_ENTITY): void {
        this.navigatePassParam('/app/admin/po-group-product-edit', { id: item.grouP_PRODUCT_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: PO_GROUP_PRODUCT_ENTITY): void {
        if (item.autH_STATUS == AuthStatusConsts.Approve) {
            this.showErrorMessage(this.l('DeleteFailed'));
            this.updateView()
            return
        }

        this.message.confirm(
            this.l('DeleteWarningMessage', item.grouP_PRODUCT_CODE),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.poGroupProductService.pO_Group_Product_Del(item.grouP_PRODUCT_ID)
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

    onApprove(item: PO_GROUP_PRODUCT_ENTITY): void {

    }

    onViewDetail(item: PO_GROUP_PRODUCT_ENTITY): void {
        this.navigatePassParam('/app/admin/po-group-product-view', { id: item.grouP_PRODUCT_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onSave(): void {

    }

    onResetSearch(): void {
        this.filterInput = new PO_GROUP_PRODUCT_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
    }

    @ViewChild('poCusModal') poCusModal: PoCustomerModalComponent;
    showCusModal(): void {
		this.poCusModal.filterInput.recorD_STATUS = RecordStatusConsts.Active;
		this.poCusModal.filterInput.top = null;
		this.poCusModal.show();
	}

	onSelectCustomer(event: PO_CUSTOMER_ENTITY): void {
		if (event) {
			this.filterInput.customeR_ID = event.customeR_ID;
			this.filterInput.customeR_NAME = event.customeR_NAME;
			this.updateView();
		}
	}
    onDeleteCustomer(){
        this.filterInput.customeR_ID = '';
        this.filterInput.customeR_NAME = '';
        this.updateView();
    }
}
