import { Component, Injector, OnInit, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { R_ENTITY, RServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';

@Component({
    templateUrl: './material-edit.component.html',
    animations: [appModuleAnimation()]
})
export class PORPPMaterialEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<R_ENTITY> {
//#region constructor
    constructor(
        injector: Injector,
        private rService: RServiceProxy,
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.r_ID = this.getRouteParam('id');
    }

    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: R_ENTITY = new R_ENTITY();
    filterInput: R_ENTITY;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.appToolbar.setRole('PORPPMaterial', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('PORPPMaterial', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('PORPPMaterial', false, false, false, false, false, false, true, false);
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
        this.navigatePassParam('/app/admin/porpp-material', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.rService.r_ById(this.inputModel.r_ID).subscribe(response => {
            this.inputModel = response;
            if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
                this.appToolbar.setButtonApproveEnable(false);
            }
            this.updateView();
        });
    }

    onSave(): void {
        this.saveInput();
    }

    saveInput() {
        if(this.editPageState != EditPageState.viewDetail) {
            if(!this.inputModel.r_ID) {
                this.onAdd();
            } else {
                this.onUpdate();
            }
        } 
    }

    onAdd(): void {
        
    }

    onUpdate(): void {
        this.inputModel.typE_UPDATE_PLAN_PRODUCTION = 'MATERIAL';
        this.saving = true;
        this.rService.r_PLAN_PRODUCTION_Upd(this.inputModel)
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

    onApprove(item: R_ENTITY): void{
        
    }
//#endregion CRUD

//#region Status Page
    setViewToolBar(){
        // Button lưu
        if(this.editPageState == EditPageState.viewDetail){
            this.appToolbar.setButtonSaveEnable(false);
        }
        else{
            if(this.inputModel.r_ID != AuthStatusConsts.Approve){
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
