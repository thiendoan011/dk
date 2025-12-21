import { Component, Injector, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PO_ENTITY, PO_LOAD_CONT_ENTITY, PoLoadContServiceProxy, PoMasterServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { PoPOModalComponent } from '@app/admin/core/modal/module-po/po-po-modal/po-po-modal.component';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { POLoadContProductEdittableComponent } from './edittable/po-load-cont-product-edittable.component';
import { POLoadContGroupProductEdittableComponent } from './edittable/po-load-cont-group-product-edittable.component';
import { POHistory2ModalComponent } from '@app/admin/core/modal/module-po/po-history-2-modal/po-history-2-modal.component';
import { POHistoryModalComponent } from '@app/admin/core/modal/module-po/po-history-modal/po-history-modal.component';

@Component({
    templateUrl: './po-load-cont-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class POLoadContEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<PO_LOAD_CONT_ENTITY> {
//#region constructor
    constructor(
        injector: Injector,
        private poMasterService      : PoMasterServiceProxy,
        private poLoadContService: PoLoadContServiceProxy
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.pO_ID = this.getRouteParam('id');
    }

    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: PO_LOAD_CONT_ENTITY = new PO_LOAD_CONT_ENTITY();
    filterInput: PO_LOAD_CONT_ENTITY;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.appToolbar.setRole('POLoadCont', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();

                this.inputModel.pO_LOAD_CONT_STATUS = 'U'
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('POLoadCont', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('POLoadCont', false, false, false, false, false, false, true, false);
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
        this.navigatePassParam('/app/admin/po-load-cont', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.poLoadContService.pO_LOAD_CONT_ById(this.inputModel.pO_ID).subscribe(response => {
            // set data
            if (!response) this.goBack()
            this.inputModel = response;
            // lịch sử xử lý
            this.history_modal.getReject();

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

        if(this.editPageState != EditPageState.viewDetail) {
            this.onUpdate();
        } 
    }

    onAdd(): void {
        // this.saving = true;
        // this.poLoadContService
        // .pO_LOAD_CONT_Ins(this.inputModel)
        // .pipe(finalize(() => {this.saving = false}))
        // .subscribe(res => {
        //     if(res['Result'] != '0'){
        //         this.showErrorMessage(res['ErrorDesc']);
        //         this.updateView();
        //     } else {
        //         this.inputModel.pO_LOAD_CONT_ID = res['ID'];
        //         this.showSuccessMessage(res['ErrorDesc']);
        //         this.getDataPages();
        //         this.updateView();
        //     }
        // })
    }

    onUpdate(): void {
        this.saving = true;
        this.poLoadContService
        .pO_LOAD_CONT_Upd(this.inputModel)
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

    onApprove(item: PO_LOAD_CONT_ENTITY): void{
        this.message.confirm(
            this.l('ApproveWarningMessage', (this.inputModel.pO_LOAD_CONT_CODE)),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.poLoadContService
                    .pO_LOAD_CONT_App(this.inputModel.pO_ID)
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
        // Hệ hàng
        this.inputModel.pO_LOAD_CONT_GROUP_PRODUCTs = this.poLoadContGroupProductEdittable.editTable.allData;
        // Sản phẩm
        this.inputModel.pO_LOAD_CONT_PRODUCTs = this.poLoadContProductEdittable.editTable.allData;
    }
    setDataEditTables(){
        // Hệ hàng
        if (this.inputModel.pO_LOAD_CONT_GROUP_PRODUCTs && this.inputModel.pO_LOAD_CONT_GROUP_PRODUCTs.length > 0) {
            this.poLoadContGroupProductEdittable.editTable.setList(this.inputModel.pO_LOAD_CONT_GROUP_PRODUCTs);
            this.poLoadContGroupProductEdittable.refreshTable();
        }
        // Sản phẩm
        if (this.inputModel.pO_LOAD_CONT_PRODUCTs && this.inputModel.pO_LOAD_CONT_PRODUCTs.length > 0) {
            this.poLoadContProductEdittable.editTable.setList(this.inputModel.pO_LOAD_CONT_PRODUCTs);
            this.poLoadContProductEdittable.refreshTable();
        }
    }

    // Hệ hàng
    @ViewChild('poLoadContGroupProductEdittable') poLoadContGroupProductEdittable: POLoadContGroupProductEdittableComponent;
    // Sản phẩm
    @ViewChild('poLoadContProductEdittable') poLoadContProductEdittable: POLoadContProductEdittableComponent;
    // lịch sử xử lý
    @ViewChild('history_modal') history_modal: POHistoryModalComponent;
    
//#endregion "EditTable"

//#region Status Page
    setViewToolBar(){
        // Button lưu
        if(this.editPageState == EditPageState.viewDetail){
            this.appToolbar.setButtonSaveEnable(false);
        }
        else{
            if(this.inputModel.pO_LOAD_CONT_ID != AuthStatusConsts.Approve){
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
