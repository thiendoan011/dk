import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from "@angular/core";
import { CM_BRANCH_ENTITY, AsposeServiceProxy, ReportInfo, PO_LAYOUT_ENTITY, PoLayoutServiceProxy, CM_ATTACH_FILE_ENTITY, } from "@shared/service-proxies/service-proxies";
import { LazyLoadEvent } from "primeng/api";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import * as moment from 'moment';
import { AuthStatusConsts } from "@app/admin/core/ultils/consts/AuthStatusConsts";
import { POLayoutDTComponent } from "./po-layout-dt.component";

@Component({
    templateUrl: './po-layout-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class POLayoutListComponent extends ListComponentBase<PO_LAYOUT_ENTITY> implements IUiAction<PO_LAYOUT_ENTITY>, OnInit, AfterViewInit {
    filterInput: PO_LAYOUT_ENTITY = new PO_LAYOUT_ENTITY();
    branchName: string
    PoPurchaseParents: PO_LAYOUT_ENTITY[];
    branches: CM_BRANCH_ENTITY[];

    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private poLayoutService: PoLayoutServiceProxy) {
        super(injector);

        this.initFilter();
        this.stopAutoUpdateView()
    }

    
    @ViewChild('polayoutdt') polayoutdt: POLayoutDTComponent;

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiAction(this);
        // set role toolbar
        this.appToolbar.setRole('POLayout', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();

        this.branchName = this.appSession.user.branchName;
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

    setSearchFinterInput() {

    }

    setFilterInputSearch() {

    }

    documenttypes: PO_LAYOUT_ENTITY[] = [];
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

    search(): void {
        this.showTableLoading();
        this.setSortingForFilterModel(this.filterInputSearch);
        this.setFilterInputSearch();
        this.poLayoutService.pO_LAYOUT_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
    }

    onAdd(): void {
        this.navigatePassParam('/app/admin/po-layout-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: PO_LAYOUT_ENTITY): void {
        this.navigatePassParam('/app/admin/po-layout-edit', { id: item.layouT_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: PO_LAYOUT_ENTITY): void {
        if (item.autH_STATUS == AuthStatusConsts.Approve) {
            this.showErrorMessage(this.l('DeleteFailed'));
            this.updateView()
            return
        }

        this.message.confirm(
            this.l('DeleteWarningMessage', item.layouT_CODE),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.poLayoutService.pO_LAYOUT_Del(item.layouT_ID, this.appSession.user.userName)
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

    onApprove(item: PO_LAYOUT_ENTITY): void {

    }

    onViewDetail(item: PO_LAYOUT_ENTITY): void {
        this.navigatePassParam('/app/admin/po-layout-view', { id: item.layouT_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onSave(): void {

    }

    onResetSearch(): void {
        this.filterInput = new PO_LAYOUT_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
    }

    async onClickRow(item: PO_LAYOUT_ENTITY){
        await this.getDetailByid(item);
        
    }

    getDetailByid(item: PO_LAYOUT_ENTITY){
        this.poLayoutService.pO_LAYOUT_DT_ById(item.layouT_ID).subscribe(res => {
            this.polayoutdt.editTableAttachFile.setList(res);
            setTimeout(() => {
                for (const item of this.polayoutdt.editTableAttachFile.allData) {
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
                    
                    this.polayoutdt.editTableAttachFile.updateParentView();
                }
                
            }, 200);
            
        });
    }
}
