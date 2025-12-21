import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { PO_PURCHASE_ENTITY, PoPurchaseServiceProxy, R_ENTITY } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { NgForm } from '@angular/forms';
import { ToolbarRejectExtComponent } from '@app/admin/core/controls/toolbar-reject-ext/toolbar-reject-ext.component';
import { RModalComponent } from '@app/admin/core/modal/module-po/r-modal/r-modal.component';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { POPurchaseOutsourcedAttachFileComponent } from './edittable/po-purchase-outsourced-attach-file.component';
import { POPurchaseOutsourcedProductEditableComponent } from './edittable/po-purchase-outsourced-product-editable.component';

@Component({
    templateUrl: './po-purchase-outsourced-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PoPurchaseOutsourcedEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<PO_PURCHASE_ENTITY> {
//#region constructor
    constructor(
        injector: Injector,
        private poPurchaseService: PoPurchaseServiceProxy
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.purchasE_ID = this.getRouteParam('id');
        this.initFilter();
    }

    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: PO_PURCHASE_ENTITY = new PO_PURCHASE_ENTITY();
    filterInput: PO_PURCHASE_ENTITY;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
                this.inputModel.purchasE_TYPE = "O";
                this.appToolbar.setRole('PoPurchaseOutsourced', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('PoPurchaseOutsourced', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getPoPurchase();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('PoPurchaseOutsourced', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getPoPurchase();
                break;
        }
        this.appToolbar.setUiActionEdit(this);
    }
    
    ngAfterViewInit(): void {
        this.updateView();
    }
//#endregion constructor
    
//#region CRUD
    getPoPurchase() {
        this.poPurchaseService.pO_Purchase_ById(this.inputModel.purchasE_ID).subscribe(response => {
            if (!response) this.goBack()
            this.inputModel = response;

            if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
                this.appToolbar.setButtonApproveEnable(false);
                this.appToolbar.setButtonSaveEnable(true);
            }

            this.setDataEditTables();

            this.updateView();
        });

    }

    onSave(): void {
        this.saveInput();
    }

    saveInput() {
        this.getEditTablesData();
        if(this.editPageState != EditPageState.viewDetail) {
            this.inputModel.makeR_ID = this.appSession.user.userName;
			this.saving = true;
            if(!this.inputModel.purchasE_ID) {
                this.onAdd();
            } else {
                this.onUpdate();
            }
        }
    }

    goBack() {
        this.navigatePassParam('/app/admin/po-purchase-outsourced', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    onAdd(): void {
        this.poPurchaseService
        .pO_Purchase_Ins(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc'])
            } else {
                this.inputModel.purchasE_ID = res['PURCHASE_ID'];
                this.showSuccessMessage(res['ErrorDesc']);
            }
            this.updateView();
        })
    }

    onUpdate(): void {
        this.updateView();
        this.poPurchaseService
			.pO_Purchase_Upd(this.inputModel)
			.pipe(finalize(() => {this.saving = false;}))
			.subscribe((res) => {
				if (res['Result'] != '0') {
					this.showErrorMessage(res['ErrorDesc']);
                    this.inputModel.autH_STATUS = AuthStatusConsts.NotApprove;
				} else {
					this.updateSuccess();
                    this.getPoPurchase();
                    this.updateView();
				}
			});
    }

    onApprove(item: PO_PURCHASE_ENTITY): void {}
//#endregion CRUD

//#region Status Page

    get disableInput(): boolean {
        return this.editPageState == EditPageState.viewDetail || this.inputModel.autH_STATUS == 'A';
    }

    get apptoolbar(): ToolbarRejectExtComponent {
        return this.appToolbar as ToolbarRejectExtComponent;
    }
//#endregion Status Page

//#region "EditTable"

    getEditTablesData(): void {
        // Danh sách file đính kèm
        this.inputModel.pO_PURCHSE_ATTACH_FILEs = this.poPurchaseOutsourcedAttachFile.editTable.allData;
        // Danh sách sản phẩm gia công
        this.inputModel.pO_PRODUCT_OUTSOURCEDs = this.poPurchaseOutsourcedProductEditableComponent.editTable.allData;

        // Tránh lỗi The error description is 'XML document must have a top level element.'.
        this.inputModel.pO_PURCHASE_ORDERs = [];
    }

    setDataEditTables(){
        // Danh sách file đính kèm
        if (this.inputModel.pO_PURCHSE_ATTACH_FILEs && this.inputModel.pO_PURCHSE_ATTACH_FILEs.length > 0) {
            this.poPurchaseOutsourcedAttachFile.editTable.setList(this.inputModel.pO_PURCHSE_ATTACH_FILEs);
            this.poPurchaseOutsourcedAttachFile.refreshTable();
        }
        // Danh sách sản phẩm gia công
        if (this.inputModel.pO_PRODUCT_OUTSOURCEDs && this.inputModel.pO_PRODUCT_OUTSOURCEDs.length > 0) {
            this.poPurchaseOutsourcedProductEditableComponent.editTable.setList(this.inputModel.pO_PRODUCT_OUTSOURCEDs);
            this.poPurchaseOutsourcedProductEditableComponent.refreshTable();
        }
    }

    @ViewChild('editForm') editForm: NgForm;
    // Danh sách file đính kèm
    @ViewChild('poPurchaseOutsourcedAttachFile') poPurchaseOutsourcedAttachFile: POPurchaseOutsourcedAttachFileComponent;
    // Danh sách sản phẩm gia công
    @ViewChild('poPurchaseOutsourcedProductEditableComponent') poPurchaseOutsourcedProductEditableComponent: POPurchaseOutsourcedProductEditableComponent;
//#endregion "EditTable"

//#region Control
    
    //R
    @ViewChild('rRModal') rRModal : RModalComponent;
    rModal(): void {
        this.rRModal.show();
    }
    onSelectR(event: R_ENTITY): void {
        if (event) {
            this.inputModel.r_ID   = event.r_ID;
            this.inputModel.r_CODE = event.r_CODE;
            this.inputModel.r_NAME = event.r_NAME;
            this.updateView();
        }
    }
    
//#endregion Control

}
