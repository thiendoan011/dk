import { Component, Injector, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { GROUP_R_ENTITY, GroupRServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { GroupRGroupProductEdittableComponent } from './edittable/group-r-group-product-edittable.component';
import { GroupRLSXEdittableComponent } from './edittable/group-r-lsx-edittable.component';
import { POHistory2ModalComponent } from '@app/admin/core/modal/module-po/po-history-2-modal/po-history-2-modal.component';

@Component({
    templateUrl: './group-r-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class GroupREditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<GROUP_R_ENTITY> {
//#region constructor
    constructor(
        injector: Injector,
        private groupRService: GroupRServiceProxy
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.grouP_R_ID = this.getRouteParam('id');
    }

    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: GROUP_R_ENTITY = new GROUP_R_ENTITY();
    filterInput: GROUP_R_ENTITY;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.appToolbar.setRole('GroupR', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();

                this.inputModel.autH_STATUS = 'U'
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('GroupR', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('GroupR', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getDataPages();
                break;
        }
        this.appToolbar.setUiActionEdit(this);
    }

    ngAfterViewInit(): void {
        this.updateView();
    }
//#endregion constructor

//#region CRUD    
    goBack() {
        this.navigatePassParam('/app/admin/group-r', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.groupRService.gROUP_R_ById(this.inputModel.grouP_R_ID).subscribe(response => {
            // set data
            if (!response) this.goBack()
            this.inputModel = response;

            this.setDataEditTables();
            // set role, view button(detail at region Status Page)
            this.setViewToolBar();
            // lịch sử xử lý
            this.history_modal.getDetail();

            this.updateView();
        });
    }

    onSave(): void {
        this.saveInput();
    }

    saveInput() {
        
        this.getDataEditTables();

        if(!this.inputModel.grouP_R_ID) {
            this.onAdd();
        } else {
            this.onUpdate();
        }
    }

    onAdd(): void {
        this.saving = true;
        this.groupRService
        .gROUP_R_Ins(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.inputModel.grouP_R_ID = res['ID'];
                this.showSuccessMessage(res['ErrorDesc']);
                this.getDataPages();
                this.updateView();
            }
        })
    }

    onUpdate(): void {
        this.saving = true;
        this.groupRService
        .gROUP_R_Upd(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe((res) => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.updateSuccess();
                this.getDataPages();
                this.updateView();
            }
        });
    }

    onApprove(item: GROUP_R_ENTITY): void{
        this.message.confirm(
            this.l('ApproveWarningMessage', (this.inputModel.grouP_R_CODE)),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.groupRService
                    .gROUP_R_App(this.inputModel.grouP_R_ID)
                    .pipe(finalize(() => {this.saving = false}))
                    .subscribe((res) => {
                        if (res['Result'] != '0') {
                            this.showErrorMessage(res['ErrorDesc']);
                            this.updateView();
                        } 
                        else {
                            this.approveSuccess();
                            this.getDataPages();
                            this.updateView();
                        }
                    });
                }
            }
        );
    }
//#endregion CRUD

//#region "EditTable"
    getDataEditTables(){
        // Danh sách thông tin triển khai lệnh sản xuất theo R
        this.inputModel.grouP_R_GROUP_PRODUCTs = this.groupRGroupProductEdittable.editTable.allData;
        // Triển khai R
        this.inputModel.grouP_R_LSXs = this.groupRLSXEdittable.editTable.allData;
    }
    setDataEditTables(){
        // Danh sách thông tin triển khai lệnh sản xuất theo R
        if (this.inputModel.grouP_R_GROUP_PRODUCTs && this.inputModel.grouP_R_GROUP_PRODUCTs.length > 0) {
            this.groupRGroupProductEdittable.editTable.setList(this.inputModel.grouP_R_GROUP_PRODUCTs);
            this.groupRGroupProductEdittable.refreshTable();
        }
        // Triển khai R
        if (this.inputModel.grouP_R_LSXs && this.inputModel.grouP_R_LSXs.length > 0) {
            this.groupRLSXEdittable.editTable.setList(this.inputModel.grouP_R_LSXs);
            this.groupRLSXEdittable.refreshTable();
        }
    }

    // Danh sách thông tin triển khai lệnh sản xuất theo R
    @ViewChild('groupRGroupProductEdittable') groupRGroupProductEdittable: GroupRGroupProductEdittableComponent;
    // Triển khai R
    @ViewChild('groupRLSXEdittable') groupRLSXEdittable: GroupRLSXEdittableComponent;
    // lịch sử xử lý
    @ViewChild('history_modal') history_modal: POHistory2ModalComponent;
    
//#endregion "EditTable"

//#region Status Page
    setViewToolBar(){
        // Button lưu
        if(this.editPageState == EditPageState.viewDetail){
            this.appToolbar.setButtonSaveEnable(false);
        }
        else{
            if(this.inputModel.grouP_R_ID != AuthStatusConsts.Approve){
                this.appToolbar.setButtonSaveEnable(true);
            }
            else{
                this.appToolbar.setButtonSaveEnable(false);
            }
        }

        // Button duyệt
        if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
            this.appToolbar.setButtonApproveEnable(false);
            this.appToolbar.setButtonSaveEnable(false);
        }
    }

    get disableInput(): boolean {
        return this.editPageState == EditPageState.viewDetail || this.inputModel.autH_STATUS == 'A';
    }
//#endregion Status Page

    _disableEditColumn: boolean = true;
    get disableEditColumn(): boolean {
        return this._disableEditColumn;
    }
    
    get isHiddenEditButton(): boolean {
        return this.inputModel.makeR_ID != this.appSession.user.userName || this.inputModel.autH_STATUS != 'A';
    }
    onOpenEdit(){
        this._disableEditColumn = false;
        this.updateView();
    }

    onEdit(){
        
        this.inputModel.grouP_R_LSXs = this.groupRLSXEdittable.editTable.allData;

        abp.ui.setBusy();
        this.groupRService
        .gROUP_R_Edit(this.inputModel)
        .pipe(finalize(() => {abp.ui.clearBusy();}))
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.getDataPages();
                this.showSuccessMessage(res['ErrorDesc']);
                this.updateView();
            }
        })
    }

}
