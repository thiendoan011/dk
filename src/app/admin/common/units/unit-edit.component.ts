import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { UnitServiceProxy, CM_UNIT_ENTITY, UltilityServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes } from '@app/ultilities/enum/all-codes';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { IUiAction } from '@app/ultilities/ui-action';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';

@Component({
    templateUrl: './unit-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class UnitEditComponent extends DefaultComponentBase implements OnInit, IUiActionEdit<CM_UNIT_ENTITY>, AfterViewInit {
    constructor(
        injector: Injector,
        private ultilityService: UltilityServiceProxy,
        private unitService: UnitServiceProxy
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.uniT_ID = this.getRouteParam('id');
        this.initFilter();
    }
    @ViewChild('editForm') editForm: ElementRef;
    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;
    inputModel: CM_UNIT_ENTITY = new CM_UNIT_ENTITY();
    filterInput: CM_UNIT_ENTITY;
    isShowError = false;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
                this.appToolbar.setRole('Unit', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('Unit', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getUnit();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('Unit', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getUnit();
                break;
        }
        this.appToolbar.setUiActionEdit(this);
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    getUnit() {
        this.unitService.cM_UNIT_ById(this.inputModel.uniT_ID).subscribe(response => {
            this.inputModel = response;

            this.setViewToolBar();
            this.updateView();
        });
    }

    goBack() {
        this.navigatePassParam('/app/admin/unit', null, undefined);
    }

    onSave(): void {
        this.saveInput();
    }

    saveInput() {

        if ((this.editForm as any).form.invalid) {
            this.isShowError = true;
            this.showErrorMessage(this.l('FormInvalid'));
            this.updateView();
            return;
        }
        if (this.editPageState != EditPageState.viewDetail) {
            this.saving = true;
            this.inputModel.makeR_ID = this.appSession.user.userName;
            if (!this.inputModel.uniT_ID) {
                this.unitService.cM_UNIT_Ins(this.inputModel)
                .pipe(finalize(() => { this.saving = false; }))
                .subscribe((response) => {
                    if (response.result != '0') {
                        this.showErrorMessage(response.errorDesc);
                    }
                    else {
                        this.inputModel.uniT_ID = response.id;
                        this.addNewSuccess();
                        this.getUnit();
                        this.updateView();
                    }
                });
            }
            else {
                this.unitService.cM_UNIT_Upd(this.inputModel)
                .pipe(finalize(() => { this.saving = false; }))
                .subscribe((response) => {
                    if (response.result != '0') {
                        this.showErrorMessage(response.errorDesc);
                    }
                    else {
                        this.updateSuccess();
                        this.getUnit();
                        this.updateView();
                    }
                });
            }
        }
    }

    onAdd(): void {
    }

    onUpdate(item: CM_UNIT_ENTITY): void {
    }

    onApprove(item: CM_UNIT_ENTITY): void {
        if (!this.inputModel.uniT_ID) {
            return;
        }
        this.message.confirm(
            this.l('ApproveWarningMessage', this.l(this.inputModel.uniT_NAME)),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.unitService.cM_UNIT_App(this.inputModel.uniT_ID, this.appSession.user.userName)
                    .pipe(finalize(() => { this.saving = false; }))
                    .subscribe((response) => {
                        if (response.result != '0') {
                            this.showErrorMessage(response["ErrorDesc"]);
                        }
                        else {
                            this.approveSuccess();
                        }
                    });
                }
            }
        );
    }

//#region Status Page
    setViewToolBar(){
        // Button lưu
        if(this.editPageState == EditPageState.viewDetail){
            this.appToolbar.setButtonSaveEnable(false);
        }
        else{
            if(this.inputModel.uniT_ID != AuthStatusConsts.Approve){
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
