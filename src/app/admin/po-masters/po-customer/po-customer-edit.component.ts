import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { CM_DEPARTMENT_ENTITY, UltilityServiceProxy, PO_CUSTOMER_ENTITY, PoCustomerrServiceProxy, PO_GROUP_PRODUCT_ENTITY } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes } from '@app/ultilities/enum/all-codes';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { IUiActionRejectExt } from '@app/ultilities/ui-action-re';
import { ToolbarRejectExtComponent } from '@app/admin/core/controls/toolbar-reject-ext/toolbar-reject-ext.component';
import { NgForm } from '@angular/forms';
import * as moment from 'moment'
import { EditableTableComponent } from '@app/admin/core/controls/common/editable-table/editable-table.component';

@Component({
    templateUrl: './po-customer-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PoCustomerEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionRejectExt<PO_CUSTOMER_ENTITY> {
    ngAfterViewInit(): void {
        this.updateView();
    }

    constructor(
        injector: Injector,
        private ultilityService: UltilityServiceProxy,
        private poCustomerService: PoCustomerrServiceProxy
    ) {
        super(injector);
		this.editPageState = this.getRouteData('editPageState');
		this.inputModel.customeR_ID = this.getRouteParam('id');
        this.initFilter();
        this.initIsApproveFunct();

        // Danh sách hệ hàng
        this.inputModel.pO_GROUP_PRODUCTs = [];
    }

    isApproveFunct: boolean;
    initIsApproveFunct(): void {
        this.ultilityService.isApproveFunct(this.getCurrentFunctionId()).subscribe((res) => {
			this.isApproveFunct = res;
		});
    }

    @ViewChild('editForm') editForm: NgForm;
    @ViewChild('editTableGroupProduct') editTableGroupProduct: EditableTableComponent<PO_GROUP_PRODUCT_ENTITY>;

    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;

    inputModel: PO_CUSTOMER_ENTITY = new PO_CUSTOMER_ENTITY();
    filterInput: PO_CUSTOMER_ENTITY;
    disableAssetInput: boolean;
    disablePoEdit: boolean;

    isInitPoType: boolean = false

    get disableInput(): boolean {
        return this.editPageState == EditPageState.viewDetail || this.inputModel.autH_STATUS == 'A';
    }

    departments: CM_DEPARTMENT_ENTITY[];

    isShowError = false;

    totalAmt: number = 0;
    processValue: number = 0;

    dataInTables: PO_CUSTOMER_ENTITY[] = [];

    get apptoolbar(): ToolbarRejectExtComponent {
        return this.appToolbar as ToolbarRejectExtComponent;
    }

    ngOnInit(): void {

        switch (this.editPageState) {
            case EditPageState.add:
                this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
                this.appToolbar.setRole('PoCustomer', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.disablePoEdit = false;
                break;
            case EditPageState.edit:
                this.disablePoEdit = true;
                this.appToolbar.setRole('PoCustomer', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getPoCustomer();
                break;
            case EditPageState.viewDetail:
                this.disablePoEdit = true;
                this.appToolbar.setRole('PoCustomer', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getPoCustomer();
                break;
        }
        this.appToolbar.setUiAction(this);
        this.disableAssetInput = true;
    }

    getPoCustomer() {
        this.poCustomerService.pO_CUSTOMER_ById(this.inputModel.customeR_ID).subscribe(response => {
            if (!response) this.goBack()
            this.inputModel = response;
            /*
            // Danh sách hệ hàng
			if (this.inputModel.pO_GROUP_PRODUCTs.length > 0) {
				this.editTableGroupProduct.setList(this.inputModel.pO_GROUP_PRODUCTs);
            }
            */

            if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
                this.appToolbar.setButtonApproveEnable(false);
                this.appToolbar.setButtonSaveEnable(true);
            }

            // CM_ATTACH_FILE
			this.getFile(this.inputModel.customeR_ID, this.inputModel);

            this.updateView()
        });

    }

    onSave(): void {
        this.saveInput();
    }

    
    saveInput() {
        if (this.isApproveFunct == undefined) {
            this.showErrorMessage(this.l('PageLoadUndone'));
			this.updateView();
			return;
		}

        this.getEditTablesData();

        if(this.editPageState != EditPageState.viewDetail) {
            this.inputModel.makeR_ID = this.appSession.user.userName;
			this.saving = true;
			this.isShowError = false;
            if(!this.inputModel.customeR_ID) {
                this.onAdd();
            } else {
                this.onUpdate();
            }
        }  
    }

    getEditTablesData(): void {
        
    }

    goBack() {
        this.navigatePassParam('/app/admin/po-customer', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    onAdd(): void {
        this.poCustomerService
            .pO_CUSTOMER_Ins(this.inputModel)
            .pipe(
                finalize(() => {
                    this.saving = false
                })
            )
            .subscribe(res => {
                if(res['Result'] != '0'){
                    this.showErrorMessage(res['ErrorDesc'])
                } else {
                    this.inputModel.customeR_ID = res['ID'];
                    this.showSuccessMessage(res['ErrorDesc']);
                    // CM_ATTACH_FILE
					this.addFile(this.inputModel, 'po-customer', undefined, res['ID']);
                }
                this.updateView();
            })
    }

    onUpdate(): void {
        this.updateView();
        this.poCustomerService
			.pO_CUSTOMER_Upd(this.inputModel)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe((res) => {
				if (res['Result'] != '0') {
					this.showErrorMessage(res['ErrorDesc']);
                    this.inputModel.autH_STATUS = AuthStatusConsts.NotApprove;
				} else {
					this.updateSuccess();
                    // CM_ATTACH_FILE
					this.updateFile(this.inputModel, 'po-customer', undefined, this.inputModel.customeR_ID);
                    this.getPoCustomer();
                    this.updateView();
				}
			});
    }

    onDelete(item: PO_CUSTOMER_ENTITY): void {

    }

    onApprove(item: PO_CUSTOMER_ENTITY): void {
        
    }
    
    onViewDetail(item: PO_CUSTOMER_ENTITY): void {
    }

    onSearch(): void {
    }

    onResetSearch(): void {
    }

    onReject(item: PO_CUSTOMER_ENTITY): void {

    }

    onReturn(notes: string) {
    }

    select2Change($event) {
        var tmp = $event;
    }

    onTemp(){
        
    }

    sortOnClick(){

    }
}
