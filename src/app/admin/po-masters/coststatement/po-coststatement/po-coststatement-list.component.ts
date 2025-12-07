import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from "@angular/core";
import { CM_BRANCH_ENTITY, AsposeServiceProxy, ReportInfo, PO_COSTSTATEMENT_ENTITY, PoCoststatementServiceProxy, CM_ATTACH_FILE_ENTITY, } from "@shared/service-proxies/service-proxies";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { AuthStatusConsts } from "@app/admin/core/ultils/consts/AuthStatusConsts";
import { POCoststatementDTComponent } from "./po-coststatement-dt.component";

@Component({
    templateUrl: './po-coststatement-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class POCoststatementListComponent extends ListComponentBase<PO_COSTSTATEMENT_ENTITY> implements IUiAction<PO_COSTSTATEMENT_ENTITY>, OnInit, AfterViewInit {
    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private poCoststatementService: PoCoststatementServiceProxy) {
        super(injector);

        this.initFilter();
        this.stopAutoUpdateView()
    }

    filterInput: PO_COSTSTATEMENT_ENTITY = new PO_COSTSTATEMENT_ENTITY();

    @ViewChild('pocoststatementdt') pocoststatementdt: POCoststatementDTComponent;

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiAction(this);
        // set role toolbar
        this.appToolbar.setRole('POCoststatement', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();
        
        this.initCombobox();
        this.updateView();
    }

    ngAfterViewInit(): void {
        this.onSearch();
        this.updateView();
    }

    initDefaultFilter() {
        this.filterInput.top = 200;
        this.filterInput.useR_LOGIN = this.appSession.user.userName;
    }

    search(): void {
        this.showTableLoading();
        this.setSortingForFilterModel(this.filterInputSearch);
        this.setFilterInputSearch();
        this.poCoststatementService.pO_COSTSTATEMENT_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
    }

    onResetSearch(): void {
        this.filterInput = new PO_COSTSTATEMENT_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
    }

    onAdd(): void {
        this.navigatePassParam('/app/admin/po-coststatement-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: PO_COSTSTATEMENT_ENTITY): void {
        this.navigatePassParam('/app/admin/po-coststatement-edit', { id: item.coststatemenT_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onViewDetail(item: PO_COSTSTATEMENT_ENTITY): void {
        this.navigatePassParam('/app/admin/po-coststatement-view', { id: item.coststatemenT_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: PO_COSTSTATEMENT_ENTITY): void {
        if (item.autH_STATUS == AuthStatusConsts.Approve) {
            this.showErrorMessage(this.l('DeleteFailed'));
            this.updateView()
            return
        }

        this.message.confirm(
            this.l('DeleteWarningMessage', item.coststatemenT_CODE),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.poCoststatementService.pO_COSTSTATEMENT_Del(item.coststatemenT_ID, this.appSession.user.userName)
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

    async onClickRow(item: PO_COSTSTATEMENT_ENTITY){
        await this.getDetailByid(item);
        
    }

    getDetailByid(item: PO_COSTSTATEMENT_ENTITY){
        this.poCoststatementService.pO_COSTSTATEMENT_DT_ById(item.coststatemenT_ID).subscribe(res => {
            this.pocoststatementdt.group_name = !this.isNullOrEmpty(item.grouP_PRODUCT_NAME) ? ' - ' + item.grouP_PRODUCT_NAME : '';
            this.pocoststatementdt.editTableAttachFile.setList(res.filter(x => x.coststatemenT_DT_STATUS == 'Y'));
            setTimeout(() => {
                for (const item of this.pocoststatementdt.editTableAttachFile.allData) {
                    item.filE_ATTACHMENT = new CM_ATTACH_FILE_ENTITY();
                    item.filE_ATTACHMENT.filE_NAME_OLD = item.filE_NAME_OLD;
                    item.filE_ATTACHMENT.filE_NAME_NEW = item.filE_NAME_NEW;
                    item.filE_ATTACHMENT.patH_NEW = item.patH_NEW;
                    item.filE_ATTACHMENT.filE_SIZE = item.filE_SIZE;
                    item.filE_ATTACHMENT.filE_TYPE = item.filE_TYPE;
    
                    item.filE_ATTACHMENT_TEMPLATE = new CM_ATTACH_FILE_ENTITY();
                    item.filE_ATTACHMENT_TEMPLATE.filE_NAME_OLD = item.filE_NAME_OLD_TEMPLATE;
                    item.filE_ATTACHMENT_TEMPLATE.filE_NAME_NEW = item.filE_NAME_NEW_TEMPLATE;
                    item.filE_ATTACHMENT_TEMPLATE.patH_NEW = item.patH_NEW_TEMPLATE;
                    item.filE_ATTACHMENT_TEMPLATE.filE_SIZE = item.filE_SIZE_TEMPLATE;
                    item.filE_ATTACHMENT_TEMPLATE.filE_TYPE = item.filE_TYPE_TEMPLATE;
                    
                    this.pocoststatementdt.editTableAttachFile.updateParentView();
                    this.pocoststatementdt.updateView();
                }
                
            }, 200);
            
        });
    }

//#region ETC
    onApprove(item: PO_COSTSTATEMENT_ENTITY): void {

    }

    onSave(): void {

    }

    setSearchFinterInput() {

    }

    setFilterInputSearch() {

    }

    initCombobox(): void {
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
//#endregion ETC
}
