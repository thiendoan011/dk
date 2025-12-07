import { Component, Injector, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PO_MODIFIED_ENTITY, PoModifiedServiceProxy, PoMasterServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { POModifiedPODelayEdittableComponent } from './edittable/po-modified-po-delay-edittable.component';
import { POModifiedPOSpeedUpEdittableComponent } from './edittable/po-modified-po-speed-up-edittable.component';

@Component({
    templateUrl: './po-modified-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class POModifiedEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<PO_MODIFIED_ENTITY> {
//#region constructor
    constructor(
        injector: Injector,
        private poMasterService      : PoMasterServiceProxy,
        private poModifiedService: PoModifiedServiceProxy
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.pO_MODIFIED_ID = this.getRouteParam('id');
    }

    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: PO_MODIFIED_ENTITY = new PO_MODIFIED_ENTITY();
    filterInput: PO_MODIFIED_ENTITY;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.appToolbar.setRole('POModified', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();

                this.inputModel.autH_STATUS = 'U'
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('POModified', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('POModified', false, false, false, false, false, false, true, false);
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
        this.navigatePassParam('/app/admin/po-modified', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.poModifiedService.pO_MODIFIED_ById(this.inputModel.pO_MODIFIED_ID).subscribe(response => {
            // set data
            if (!response) this.goBack()
            this.inputModel = response;

            this.setDataEditTables();
            // set role, view button(detail at region Status Page)
            this.setViewToolBar();

            this.updateView();
        });
    }

    onSave(): void {
        this.saveInput();
    }

    saveInput() {
        
        this.getDataEditTables();

        if(!this.inputModel.pO_MODIFIED_ID) {
            this.onAdd();
        } else {
            this.onUpdate();
        }
    }

    onAdd(): void {
        this.saving = true;
        this.poModifiedService
        .pO_MODIFIED_Ins(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.inputModel.pO_MODIFIED_ID = res['ID'];
                this.showSuccessMessage(res['ErrorDesc']);
                this.getDataPages();
                this.updateView();
            }
        })
    }

    onUpdate(): void {
        this.saving = true;
        this.poModifiedService
        .pO_MODIFIED_Upd(this.inputModel)
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

    onApprove(item: PO_MODIFIED_ENTITY): void{
        this.message.confirm(
            this.l('ApproveWarningMessage', (this.inputModel.pO_MODIFIED_ID)),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.poModifiedService
                    .pO_MODIFIED_App(this.inputModel.pO_MODIFIED_ID)
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
        // PO chậm tiến độ
        this.inputModel.pO_MODIFIED_PO_DELAYs = this.poModifiedPODelayEdittable.editTable.allData;
        // PO đẩy nhanh tiến độ
        this.inputModel.pO_MODIFIED_PO_SPEED_UPs = this.poModifiedPOSpeedUpEdittable.editTable.allData;
    }
    setDataEditTables(){
        // PO chậm tiến độ
        if (this.inputModel.pO_MODIFIED_PO_DELAYs && this.inputModel.pO_MODIFIED_PO_DELAYs.length > 0) {
            this.poModifiedPODelayEdittable.editTable.setList(this.inputModel.pO_MODIFIED_PO_DELAYs);
            this.poModifiedPODelayEdittable.refreshTable();
        }
        // PO đẩy nhanh tiến độ
        if (this.inputModel.pO_MODIFIED_PO_SPEED_UPs && this.inputModel.pO_MODIFIED_PO_SPEED_UPs.length > 0) {
            this.poModifiedPOSpeedUpEdittable.editTable.setList(this.inputModel.pO_MODIFIED_PO_SPEED_UPs);
            this.poModifiedPOSpeedUpEdittable.refreshTable();
        }
    }

    // PO chậm tiến độ
    @ViewChild('poModifiedPODelayEdittable') poModifiedPODelayEdittable: POModifiedPODelayEdittableComponent;
    // PO đẩy nhanh tiến độ
    @ViewChild('poModifiedPOSpeedUpEdittable') poModifiedPOSpeedUpEdittable: POModifiedPOSpeedUpEdittableComponent;
    
//#endregion "EditTable"

//#region Status Page
    setViewToolBar(){
        // Button lưu
        if(this.editPageState == EditPageState.viewDetail){
            this.appToolbar.setButtonSaveEnable(false);
        }
        else{
            if(this.inputModel.pO_MODIFIED_ID != AuthStatusConsts.Approve){
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

}
