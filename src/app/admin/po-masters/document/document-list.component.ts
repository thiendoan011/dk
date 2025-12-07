import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from "@angular/core";
import { CM_BRANCH_ENTITY, BranchServiceProxy, AsposeServiceProxy, ReportInfo, DOCUMENT_ENTITY, DocumentServiceProxy, ATTACH_FILE_ENTITY, DepartmentServiceProxy, CM_DEPARTMENT_ENTITY, RoleServiceProxy, TL_ROLE_ENTITY, ProfileServiceProxy, UserListRoleDto, TL_USER_ENTITY, } from "@shared/service-proxies/service-proxies";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { AuthStatusConsts } from "@app/admin/core/ultils/consts/AuthStatusConsts";
import { DocumentAttachFileComponent } from "./document-attach-file.component";
import { Select2CustomComponent } from '@app/admin/core/controls/common/custom-select2/select2-custom.component';

@Component({
    templateUrl: './document-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class DocumentListComponent extends ListComponentBase<DOCUMENT_ENTITY> implements IUiAction<DOCUMENT_ENTITY>, OnInit, AfterViewInit {
    filterInput: DOCUMENT_ENTITY = new DOCUMENT_ENTITY();
    branchName: string
    PoPurchaseParents: DOCUMENT_ENTITY[];
    branches: CM_BRANCH_ENTITY[];

    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private branchService: BranchServiceProxy, 
        private _departmentService: DepartmentServiceProxy,
        private _profileService: ProfileServiceProxy,
        private tlRoleService: RoleServiceProxy,
        private documentService: DocumentServiceProxy) {
        super(injector);

        this.initFilter();
        //this.initCombobox()
        this.stopAutoUpdateView()
        this.setupValidationMessage()
    }

    
    @ViewChild('attachFile') attachFile: DocumentAttachFileComponent;
    @ViewChild('rolename1') rolename1: Select2CustomComponent;

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiAction(this);
        // set role toolbar
        this.appToolbar.setRole('Document', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();

        this.branchName = this.appSession.user.branchName;
        this.filterInput.useR_LOGIN = this.appSession.user.userName;
        this.initCombobox();
        this.updateView();
    }

    ngAfterViewInit(): void {
        this.onSearch();
        this.updateView();

    }

    initDefaultFilter() {
        this.filterInput.top = 200
    }

    setSearchFinterInput() {

    }

    setFilterInputSearch() {

    }

    documenttypes: DOCUMENT_ENTITY[] = [];
    initCombobox(): void {
        let branch = new CM_BRANCH_ENTITY();
        branch.brancH_ID = this.appSession.user.subbrId;
        branch.brancH_CODE = this.appSession.user.branchCode;
        branch.brancH_NAME = this.appSession.user.branchName;
        this.branchs.push(branch);

        this._profileService.getCurrentUserProfileForEdit().subscribe(response => {
            let role = new TL_ROLE_ENTITY();
                role.id = null
                this.roles.push(role);
                this.rolename1.afterViewInit();

            for (const item of response.roles) {
                let role = new TL_ROLE_ENTITY();
                role.id = item.roleId.toString();
                role.displayname = item.roleName;
                role.name = item.name;
                this.roles.push(role);
                this.rolename1.afterViewInit();
                this.updateView();
            }

            this.branchService.cM_BRANCH_Search(this.getFillterForCombobox()).subscribe(response2 => {
                if(response.roles.filter(x => x.roleName === 'Admin').length > 0){
                    this.branchs = response2.items;
                    this.updateView();
                }
            });
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

        this.documentService.dOC_DOCTYPE_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.updateView()
            });
    }

    onAdd(): void {
        this.navigatePassParam('/app/admin/document-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: DOCUMENT_ENTITY): void {
        this.navigatePassParam('/app/admin/document-edit', { id: item.documenT_TYPE_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: DOCUMENT_ENTITY): void {
        if (item.autH_STATUS == AuthStatusConsts.Approve) {
            this.showErrorMessage(this.l('DeleteFailed'));
            this.updateView()
            return
        }

        this.message.confirm(
            this.l('DeleteWarningMessage', item.documenT_TYPE_CODE),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.documentService.dOC_DOCTYPE_Del(item.documenT_TYPE_ID)
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

    onApprove(item: DOCUMENT_ENTITY): void {

    }

    onViewDetail(item: DOCUMENT_ENTITY): void {
        this.navigatePassParam('/app/admin/document-view', { id: item.documenT_TYPE_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onSave(): void {

    }

    onResetSearch(): void {
        this.filterInput = new DOCUMENT_ENTITY();
        this.initDefaultFilter()
        this.changePage(0);
    }

    async onClickRow(item: DOCUMENT_ENTITY){
        //await this.attachFile.editTableAttachFile.setList([]);
        await this.getAttachFile(item);
        await this.getTemplateAttachFile(item);
        
    }

    async getAttachFile(item: DOCUMENT_ENTITY){
        let attachInput = new ATTACH_FILE_ENTITY();
        attachInput.type = 'DOCUMENT';
        attachInput.typE_REQ = 'DOCUMENT';
        attachInput.reF_ID = item.documenT_TYPE_ID;
        attachInput.brancH_ID = this.filterInput.brancH_ID;
        attachInput.deP_ID = this.filterInput.deP_ID;
        attachInput.rolE_ID = this.filterInput.rolE_ID;
        attachInput.useR_LOGIN = this.appSession.user.userName;
        this.documentService
        .dOC_ATTACH_FILE_Byid(attachInput)
        .subscribe((res) => {
            this.attachFile.editTableAttachFile.setList(res);
            for(let i = 0; i < res.length; i++) {
                this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT'] = 
                {   
                    ...res[i]
                };
            }
        })
    }

    async getTemplateAttachFile(item: DOCUMENT_ENTITY){
        setTimeout(() => {
            let attachTempalteInput = new ATTACH_FILE_ENTITY();
            attachTempalteInput.type = 'DOCUMENT';
            attachTempalteInput.typE_REQ = 'TEMPLATE_DOCUMENT';
            attachTempalteInput.reF_ID = item.documenT_TYPE_ID;
            attachTempalteInput.brancH_ID = this.filterInput.brancH_ID;
            attachTempalteInput.deP_ID = this.filterInput.deP_ID;
            attachTempalteInput.rolE_ID = this.filterInput.rolE_ID;
            attachTempalteInput.useR_LOGIN = this.appSession.user.userName;
            this.documentService
            .dOC_ATTACH_FILE_Byid(attachTempalteInput)
            .subscribe((res2) => {
                for(let i = 0; i < res2.length; i++) {
                    this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT_TEMPLATE'] = 
                    {   
                        ...res2[i]
                    };
                }
                this.attachFile.updateView();
            })
        }, 100);
    }

    async onSearchDocument(){
        await this.getAttachFileBySeach();
        await this.getTemplateAttachFileBySeach();
    }

    async getAttachFileBySeach(){
        let attachInput = new ATTACH_FILE_ENTITY();
        attachInput.type = 'DOCUMENT';
        attachInput.typE_REQ = 'DOCUMENT';
        attachInput.documenT_CODE = this.filterInput.documenT_CODE;
        attachInput.documenT_NAME = this.filterInput.documenT_NAME;
        attachInput.brancH_ID = this.filterInput.brancH_ID;
        attachInput.deP_ID = this.filterInput.deP_ID;
        attachInput.rolE_ID = this.filterInput.rolE_ID;
        attachInput.useR_LOGIN = this.appSession.user.userName;
        this.documentService
        .dOC_ATTACH_FILE_Byid(attachInput)
        .subscribe((res) => {
            this.attachFile.editTableAttachFile.setList(res);
            for(let i = 0; i < res.length; i++) {
                this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT'] = 
                {   
                    ...res[i]
                };
            }
        })
    }

    async getTemplateAttachFileBySeach(){
        setTimeout(() => {
            let attachTempalteInput = new ATTACH_FILE_ENTITY();
            attachTempalteInput.type = 'DOCUMENT';
            attachTempalteInput.typE_REQ = 'TEMPLATE_DOCUMENT';
            attachTempalteInput.documenT_CODE = this.filterInput.documenT_CODE;
            attachTempalteInput.documenT_NAME = this.filterInput.documenT_NAME;
            attachTempalteInput.brancH_ID = this.filterInput.brancH_ID;
            attachTempalteInput.deP_ID = this.filterInput.deP_ID;
            attachTempalteInput.rolE_ID = this.filterInput.rolE_ID;
            attachTempalteInput.useR_LOGIN = this.appSession.user.userName;
            
            this.documentService
            .dOC_ATTACH_FILE_Byid(attachTempalteInput)
            .subscribe((res2) => {
                for(let i = 0; i < res2.length; i++) {
                    this.attachFile.editTableAttachFile.allData[i]['filE_ATTACHMENT_TEMPLATE'] = 
                    {   
                        ...res2[i]
                    };
                }
                this.attachFile.updateView();
            })
        }, 100);
        
    }

    // Đơn vị phòng ban combobox
    branchs: CM_BRANCH_ENTITY[] = [];
    roles: TL_ROLE_ENTITY[] = [];
    departments: CM_DEPARTMENT_ENTITY[] = [];
    onChangeBranch(branch: CM_BRANCH_ENTITY) {
        if (!branch) {
            branch = { brancH_ID: this.appSession.user.subbrId } as any
        }
        this.filterInput.deP_ID = undefined;
        this.filterInput.deP_CODE = undefined;
        this.filterInput.deP_NAME = undefined;
        let filterCombobox = this.getFillterForCombobox();
        filterCombobox.brancH_ID = branch.brancH_ID;
        this._departmentService.cM_DEPARTMENT_Search(filterCombobox).subscribe(response => {
            if(this.roles.filter(x => x.displayname === 'Admin').length > 0){
                this.departments = response.items;
                this.updateView();
            }
            else{
                this.departments = [];
                let dep = new CM_DEPARTMENT_ENTITY();
                dep.deP_ID = this.appSession.user.deP_ID;
                dep.deP_CODE = this.appSession.user.deP_CODE;
                dep.deP_NAME = this.appSession.user.deP_NAME;
                this.departments.push(dep);
                this.updateView();
            }
        })
    }
}
