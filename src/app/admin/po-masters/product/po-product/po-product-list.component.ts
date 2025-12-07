import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { CM_BRANCH_ENTITY, AsposeServiceProxy, ReportInfo, PoProductServiceProxy, PO_PRODUCT_ENTITY, } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { AuthStatusConsts } from "@app/admin/core/ultils/consts/AuthStatusConsts";
import { IUiActionList } from "@app/ultilities/ui-action-list";

@Component({
    templateUrl: './po-product-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class PoProductListComponent extends ListComponentBase<PO_PRODUCT_ENTITY> implements IUiActionList<PO_PRODUCT_ENTITY>, OnInit, AfterViewInit {
    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private poProductService: PoProductServiceProxy) {
        super(injector);
    }

    filterInput: PO_PRODUCT_ENTITY = new PO_PRODUCT_ENTITY();

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiActionList(this);
        // set role toolbar
        this.appToolbar.setRole('PoProduct', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();
    }

    ngAfterViewInit(): void {
        this.updateView()
    }

    search(): void {

        this.showTableLoading();
        this.setSortingForFilterModel(this.filterInputSearch);

        this.poProductService.pO_Product_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
    }

    onAdd(): void {
        this.navigatePassParam('/app/admin/po-product-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: PO_PRODUCT_ENTITY): void {
        this.navigatePassParam('/app/admin/po-product-edit', { id: item.producT_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: PO_PRODUCT_ENTITY): void {
        if (item.autH_STATUS == AuthStatusConsts.Approve) {
            this.showErrorMessage(this.l('DeleteFailed'));
            this.updateView()
            return
        }

        this.message.confirm(
            this.l('DeleteWarningMessage', item.producT_CODE),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.poProductService.pO_Product_Del(item.producT_ID)
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

    onViewDetail(item: PO_PRODUCT_ENTITY): void {
        this.navigatePassParam('/app/admin/po-product-view', { id: item.producT_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onResetSearch(): void {
        this.filterInput = new PO_PRODUCT_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
    }

    exportToExcel() {
        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        let filterReport = { ...this.filterInputSearch }
        filterReport.maxResultCount = -1;

        reportInfo.parameters = this.GetParamsFromFilter(filterReport)

        reportInfo.pathName = "/PO_MASTER/rpt_po_master.xlsx";
        reportInfo.storeName = "PO_MASTER_Search";

        this.asposeService.getReport(reportInfo).subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }
}
