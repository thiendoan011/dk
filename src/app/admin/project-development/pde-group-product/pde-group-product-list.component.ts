import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { CM_BRANCH_ENTITY, BranchServiceProxy, AsposeServiceProxy, ReportInfo, PO_GROUP_PRODUCT_ENTITY, PDEGroupProductServiceProxy, } from "@shared/service-proxies/service-proxies";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { AuthStatusConsts } from "@app/admin/core/ultils/consts/AuthStatusConsts";

@Component({
    templateUrl: './pde-group-product-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class PDEGroupProductListComponent extends ListComponentBase<PO_GROUP_PRODUCT_ENTITY> implements IUiAction<PO_GROUP_PRODUCT_ENTITY>, OnInit, AfterViewInit {
    filterInput: PO_GROUP_PRODUCT_ENTITY = new PO_GROUP_PRODUCT_ENTITY();
    branchName: string
    PoGroupProductParents: PO_GROUP_PRODUCT_ENTITY[];
    branches: CM_BRANCH_ENTITY[];

    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private branchService: BranchServiceProxy,
        private pdeGroupProductService: PDEGroupProductServiceProxy) {
        super(injector);

        this.initFilter();
        this.initCombobox();

        // FROM DASHBOARD
        if(!this.isNullOrEmpty(window["reQ_PRICE_REQ_STATUS"])){
            this.filterInput.reQ_PRICE_REQ_STATUS = window["reQ_PRICE_REQ_STATUS"];
        }
        if(!this.isNullOrEmpty(window["reQ_TEMPLATE_REQ_STATUS"])){
            this.filterInput.reQ_TEMPLATE_REQ_STATUS = window["reQ_TEMPLATE_REQ_STATUS"];
        }
        if(!this.isNullOrEmpty(window["reQ_TABLEHARDWARE_REQ_STATUS"])){
            this.filterInput.reQ_TABLEHARDWARE_REQ_STATUS = window["reQ_TABLEHARDWARE_REQ_STATUS"];
        }
        if(!this.isNullOrEmpty(window["reQ_TABLECOLOR_REQ_STATUS"])){
            this.filterInput.reQ_TABLECOLOR_REQ_STATUS = window["reQ_TABLECOLOR_REQ_STATUS"];
        }
        if(!this.isNullOrEmpty(window["reQ_HARDWARE_REQ_STATUS"])){
            this.filterInput.reQ_HARDWARE_REQ_STATUS = window["reQ_HARDWARE_REQ_STATUS"];
        }
    }

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiAction(this);
        // set role toolbar
        this.appToolbar.setRole('PDEGroupProduct', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();

        this.branchName = this.appSession.user.branchName;
        // set default value
        this.filterInput.grouP_PRODUCT_STATUS = 'mau';
    }

    ngAfterViewInit(): void {
        // FROM DASHBOARD
        if(!this.isNullOrEmpty(window["reQ_PRICE_REQ_STATUS"])){
            this.filterInput.reQ_PRICE_STATUS = "";
            this.onSearch();
            window["reQ_PRICE_REQ_STATUS"] = undefined;
            this.updateView();
        }
        if(!this.isNullOrEmpty(window["reQ_TEMPLATE_REQ_STATUS"])){
            this.filterInput.reQ_TEMPLATE_STATUS = "";
            this.onSearch();
            window["reQ_TEMPLATE_REQ_STATUS"] = undefined;
            this.updateView();
        }
        if(!this.isNullOrEmpty(window["reQ_TABLEHARDWARE_REQ_STATUS"])){
            this.filterInput.reQ_TABLEHARDWARE_STATUS = "";
            this.onSearch();
            window["reQ_TABLEHARDWARE_REQ_STATUS"] = undefined;
            this.updateView();
        }
        if(!this.isNullOrEmpty(window["reQ_TABLECOLOR_REQ_STATUS"])){
            this.filterInput.reQ_TABLECOLOR_STATUS = "";
            this.onSearch();
            window["reQ_TABLECOLOR_REQ_STATUS"] = undefined;
            this.updateView();
        }
        if(!this.isNullOrEmpty(window["reQ_HARDWARE_REQ_STATUS"])){
            this.filterInput.reQ_HARDWARE_STATUS = "";
            this.onSearch();
            window["reQ_HARDWARE_REQ_STATUS"] = undefined;
            this.updateView();
        }
        
        this.updateView()
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

        this.pdeGroupProductService.pDE_Group_Product_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView();
            });
    }

    onAdd(): void {
        this.navigatePassParam('/app/admin/pde-group-product-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: PO_GROUP_PRODUCT_ENTITY): void {
        this.navigatePassParam('/app/admin/pde-group-product-edit', { id: item.grouP_PRODUCT_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
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
                    this.pdeGroupProductService.pO_Group_Product_Del(item.grouP_PRODUCT_ID)
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
        this.navigatePassParam('/app/admin/pde-group-product-view', { id: item.grouP_PRODUCT_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onSave(): void {

    }

    onResetSearch(): void {
        this.filterInput = new PO_GROUP_PRODUCT_ENTITY();
        this.changePage(0);
    }
}
