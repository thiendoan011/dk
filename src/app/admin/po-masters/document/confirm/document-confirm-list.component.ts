import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { DOCUMENT_CONFIRM_ENTITY, DocumentServiceProxy, PoCoststatementServiceProxy } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { finalize } from "rxjs/operators";
import { IUiActionList } from "@app/ultilities/ui-action-list";
import { AppConsts } from "@shared/AppConsts";

@Component({
    templateUrl: './document-confirm-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class DocumentConfirmListComponent extends ListComponentBase<DOCUMENT_CONFIRM_ENTITY> implements IUiActionList<DOCUMENT_CONFIRM_ENTITY>, OnInit, AfterViewInit {

//#region constructor
    constructor(injector: Injector,
        private documentService: DocumentServiceProxy,) {
        super(injector);
        this.remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;
        this.initDefaultFilter();
    }
    // root link
    remoteServiceBaseUrl: string;
    filterInput: DOCUMENT_CONFIRM_ENTITY = new DOCUMENT_CONFIRM_ENTITY();

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiActionList(this);
        // set role toolbar
        this.appToolbar.setRole('DocumentConfirm', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();
        
        this.filterInput.autH_STATUS = 'ME_U';
    }

    ngAfterViewInit(): void {
        this.updateView()
    }

//#endregion constructor

//#region search and navigation
    search(): void {
        this.showTableLoading(); 

        this.setSortingForFilterModel(this.filterInputSearch);

        this.documentService.dOC_CONFIRM_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
    }

    onResetSearch(): void {
        this.filterInput = new DOCUMENT_CONFIRM_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
    }

    onAdd(): void {
        this.navigatePassParam('/app/admin/document-confirm-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: DOCUMENT_CONFIRM_ENTITY): void {
        this.navigatePassParam('/app/admin/document-confirm-edit', { id: item.doC_CONFIRM_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onViewDetail(item: DOCUMENT_CONFIRM_ENTITY): void {
        this.navigatePassParam('/app/admin/document-confirm-view', { id: item.doC_CONFIRM_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: DOCUMENT_CONFIRM_ENTITY): void {
        /*
        this.message.confirm(
            this.l('DeleteWarningMessage', item.doC_CONFIRM_ID),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.poCoststatementService.cM_SUPPLIER_Del(item.doC_CONFIRM_ID, this.appSession.user.userName)
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
                    });
                }
            }
        );
        */
    }

    exportToExcel() {
    }
//#endregion search and navigation

//#region combobox and default filter

    // call in region constructor
    initDefaultFilter() {
        this.initCombobox();
        // set other filter here
    }
// begin combobox
// edit step 3: search
    initCombobox() {
        let filterCombobox = this.getFillterForCombobox();
    }

// edit step 1: init variable

// edit step 2: handle event
// end combobox

//#endregion combobox and default filter

}
