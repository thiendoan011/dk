import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { PO_LAYOUT_ENTITY, CM_DEPARTMENT_ENTITY, UltilityServiceProxy, PO_PURCHASE_ORDERS_ENTITY, PoLayoutServiceProxy, PO_GROUP_PRODUCT_ENTITY, CM_ATTACH_FILE_ENTITY, PO_LAYOUT_DT_ENTITY, PoGroupProductServiceProxy, PO_PRODUCT_ENTITY } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes } from '@app/ultilities/enum/all-codes';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { IUiActionRejectExt } from '@app/ultilities/ui-action-re';
import { NgForm } from '@angular/forms';
import * as moment from 'moment'
import { POLayoutDTComponent } from './po-layout-dt.component';
import { HistoryModalComponent } from '@app/admin/core/modal/history-modal/history-modal.component';
import { EditableTableComponent } from '@app/admin/core/controls/common/editable-table/editable-table.component';
import { PoPOModalComponent } from '@app/admin/core/modal/module-po/po-po-modal/po-po-modal.component';
import { ToolbarRejectExtComponent } from '@app/admin/core/controls/toolbar-reject-ext/toolbar-reject-ext.component';
import { PoGroupProductModalComponent } from '@app/admin/core/modal/module-po/po-group-product-modal/po-group-product-modal.component';

@Component({
    templateUrl: './po-layout-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class POLayoutEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionRejectExt<PO_LAYOUT_ENTITY> {

    ngAfterViewInit(): void {
        this.updateView();
    }

    constructor(
        injector: Injector,
        private ultilityService: UltilityServiceProxy,
        private poGroupProductService: PoGroupProductServiceProxy,
        private poLayoutService: PoLayoutServiceProxy,
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.layouT_ID = this.getRouteParam('id');
        this.initFilter();
        this.initInput();
        this.initIsApproveFunct();
    }

    isApproveFunct: boolean;
    initIsApproveFunct(): void {
        this.ultilityService.isApproveFunct(this.getCurrentFunctionId()).subscribe((res) => {
			this.isApproveFunct = res;
		});
    }

    initInput(){
        this.inputModel.useR_LOGIN = this.appSession.user.userName;
        this.inputModel.brancH_LOGIN = this.appSession.user.subbrId;
        this.inputModel.deP_LOGIN = this.appSession.user.deP_ID;
    }

    @ViewChild('editForm') editForm: NgForm;
    @ViewChild('poPOModal') poPOModal: PoPOModalComponent;
    @ViewChild('polayoutdt') polayoutdt: POLayoutDTComponent;
    @ViewChild('editTablePurchaseState') editTablePurchaseState: EditableTableComponent<PO_PURCHASE_ORDERS_ENTITY>;
    // lịch sử xử lý
    @ViewChild('history_modal') history_modal: HistoryModalComponent;

    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;

    inputModel: PO_LAYOUT_ENTITY = new PO_LAYOUT_ENTITY();
    filterInput: PO_LAYOUT_ENTITY;

    isInitPoType: boolean = false

    departments: CM_DEPARTMENT_ENTITY[];

    isShowError = false;

    totalAmt: number = 0;
    processValue: number = 0;

    dataInTables: PO_LAYOUT_ENTITY[] = [];

    get disableInput(): boolean {
        return this.editPageState == EditPageState.viewDetail || this.inputModel.autH_STATUS == AuthStatusConsts.Approve || this.inputModel.autH_STATUS == AuthStatusConsts.NotApprove;
    }

    get apptoolbar(): ToolbarRejectExtComponent {
        return this.appToolbar as ToolbarRejectExtComponent;
    }

    get isCreated(){
        return this.inputModel.layouT_ID;
    }

    get getButtonRejectChooseNewLayout(){
        return (this.editPageState === EditPageState.viewDetail && this.inputModel.autH_STATUS == AuthStatusConsts.Approve);
    }

    get getButtonSendAppr(){
        return  (   (this.editPageState === EditPageState.edit && this.inputModel.autH_STATUS == AuthStatusConsts.Draft)
                    || (this.editPageState === EditPageState.add && this.inputModel.autH_STATUS == AuthStatusConsts.Draft)
                );
    }

    ngOnInit(): void {

        switch (this.editPageState) {
            case EditPageState.add:
                this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
                this.appToolbar.setRole('POLayout', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('POLayout', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.history_modal.getDetail();
                this.getDetailByid();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('POLayout', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.history_modal.getDetail();
                this.getDetailByid();
                break;
        }
        this.appToolbar.setUiAction(this);
    }

    inItCombobox(id:string){
        this.poGroupProductService
        .gET_PRODUCT_OF_PO_GROUP_PRODUCT_Byid(id)
        .subscribe((res) => {
            this.polayoutdt.listProduct = [];
            for (const itemdt of res) {
                let product = new PO_PRODUCT_ENTITY();
                
                product.producT_ID = itemdt.producT_ID;
                product.producT_CODE = itemdt.producT_CODE;
                product.producT_NAME = itemdt.producT_NAME;
                this.polayoutdt.listProduct.push(product);
                this.polayoutdt.editTableAttachFile.resetNoAndPage();
                this.polayoutdt.editTableAttachFile.changePage(0);
            }
        });
    }

    getDetailByid() {

        this.polayoutdt.listProduct = [];
        this.poLayoutService.pO_LAYOUT_ById(this.inputModel.layouT_ID).subscribe(response => {
            if (!response) this.goBack()
            this.inputModel = response;
            this.initInput();
            if (this.inputModel.autH_STATUS == AuthStatusConsts.NotApprove && this.editPageState == EditPageState.viewDetail ) {
                this.appToolbar.setButtonApproveEnable(true);
            }
            else{
                this.appToolbar.setButtonApproveEnable(false);
            }
            this.appToolbar.setButtonSaveEnable(!this.disableInput);
            //CM_ATTACH_FILE
            this.getEditTablesByid(this.inputModel.layouT_ID);
            this.history_modal.getDetail();
            this.updateView();
        });
    }

    getEditTablesByid(id: string): void {
        this.poGroupProductService
        .gET_PRODUCT_OF_PO_GROUP_PRODUCT_Byid(this.inputModel.grouP_PRODUCT_ID)
        .subscribe((res1) => {
            // set list cho combobox
            this.polayoutdt.listProduct = [];
            for (const itemdt of res1) {
                let product = new PO_PRODUCT_ENTITY();
                
                product.producT_ID = itemdt.producT_ID;
                product.producT_CODE = itemdt.producT_CODE;
                product.producT_NAME = itemdt.producT_NAME;
                this.polayoutdt.listProduct.push(product);
                this.polayoutdt.editTableAttachFile.resetNoAndPage();
                this.polayoutdt.editTableAttachFile.changePage(0);
            }
            // set lưới chi tiết
            this.poLayoutService.pO_LAYOUT_DT_ById(this.inputModel.layouT_ID).subscribe(res => {
                // set list
                this.polayoutdt.editTableAttachFile.setList(res);
                // set attach for each row
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

                    this.polayoutdt.editTableAttachFile.resetNoAndPage();
                    this.polayoutdt.editTableAttachFile.changePage(0);
                    this.polayoutdt.editTableAttachFile.updateParentView();
                }
            });
        });
    }


    saveInput() {
        if (this.isApproveFunct == undefined) {
            this.showErrorMessage(this.l('PageLoadUndone'));
			this.updateView();
			return;
		}

        this.getEditTablesData();

        if(this.editPageState != EditPageState.viewDetail) {
			this.saving = true;
			this.isShowError = false;
            this.initInput();
            if(!this.inputModel.layouT_ID) {
                this.inputModel.makeR_ID = this.appSession.user.userName;
                this.onAdd();
            } else {
                this.onUpdate();
            }
        } 
    }

    getEditTablesData(): void {
        // Danh sách sản phẩm
        this.inputModel.layouT_DTs = this.polayoutdt.editTableAttachFile.allData;
        this.updateView();
    }

    goBack() {
        this.navigatePassParam('/app/admin/po-layout', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    onAdd(): void {
        this.poLayoutService
			.pO_LAYOUT_Ins(this.inputModel)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe((res) => {
				if (res['Result'] != '0') {
					this.showErrorMessage(res['ErrorDesc']);
                    this.inputModel.autH_STATUS = '';
				} else {
					this.addNewSuccess();
                    this.inputModel.layouT_ID = res['ID'];
                    this.getDetailByid();
                    this.updateView();
				}
			});
    }

    onUpdate(): void {
        this.poLayoutService
			.pO_LAYOUT_Upd(this.inputModel)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe((res) => {
				if (res['Result'] != '0') {
					this.showErrorMessage(res['ErrorDesc']);
                    this.inputModel.autH_STATUS = '';
				} else {
					this.updateSuccess();
                    this.getDetailByid();
                    this.updateView();
				}
			});
    }

    onSendAppr(){
        this.inputModel.iS_SEND_APPR = 'Y';
        this.getEditTablesData();
        this.poLayoutService
        .pO_LAYOUT_Upd(this.inputModel)
        .pipe(
            finalize(() => {
                this.saving = false;
            })
        )
        .subscribe((res) => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
                this.inputModel.autH_STATUS = AuthStatusConsts.Draft;
            } else {
                this.appToolbar.setEnableForViewDetailPage();
                this.showSuccessMessage('Gửi phê duyệt thành công');
                this.getDetailByid();
                this.updateView();
            }
        });
    }

    onDelete(item: PO_LAYOUT_ENTITY): void {

    }

    onApprove(item: PO_LAYOUT_ENTITY): void {
        this.message.confirm(
            this.l('ApproveWarningMessage', (this.inputModel.layouT_CODE)),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    abp.ui.setBusy();
                    this.poLayoutService
                        .pO_LAYOUT_Appr(this.inputModel.layouT_ID, this.appSession.user.userName)
                        .pipe(
                            finalize(() => {
                                abp.ui.clearBusy();
                            })
                        )
                        .subscribe((res) => {
                            if (res['Result'] != '0') {
                                this.showErrorMessage(res['ErrorDesc']);
                                this.inputModel.autH_STATUS = AuthStatusConsts.NotApprove;
                            } else {
                                this.approveSuccess();
                                this.getDetailByid();
                                this.updateView();
                            }
                        });
                }
            }
        );
    }
    onViewDetail(item: PO_LAYOUT_ENTITY): void {
    }

    onSave(): void {
        this.saveInput();
    }

    onSearch(): void {
    }

    onResetSearch(): void {
    }

    onReject(item: PO_LAYOUT_ENTITY): void {
        this.getDetailByid();
    }

    onReturn(notes: string) {
    }

    onClickRejectToChooseNewLayout(){
        this.message.confirm(
            this.l('Xác nhận trả về layout ' + this.inputModel.layouT_CODE),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    abp.ui.setBusy();
                    this.poLayoutService.pO_LAYOUT_Reject_To_Choose_Layout( this.inputModel.layouT_ID, this.appSession.user.userName)
                    .pipe(
                        finalize(() => {
                            abp.ui.clearBusy();
                        })
                    )
                    .subscribe((res) => {
                        if (res['Result'] != '0') {
                            this.showErrorMessage(res['ErrorDesc']);
                        } else {
                            this.showSuccessMessage('Trả về thành công');
                            this.getDetailByid();
                            this.updateView();
                        }
                    });
                }
            }
        );
    }

    select2Change($event) {
        var tmp = $event;
    }

    onChangeAMT(event): void {
        event.quantitY_REMAIN = event.quantitY_ORDER - event.quantitY_PURCHASED;
        this.updateView();
    }

    
    @ViewChild('poGroupProductModal') poGroupProductModal: PoGroupProductModalComponent;
    showGroupProduct():void{
        this.poGroupProductModal.show();
    }
    onSelectGroupProduct(item: PO_GROUP_PRODUCT_ENTITY): void {
        this.inputModel.grouP_PRODUCT_ID = item.grouP_PRODUCT_ID;
        this.inputModel.grouP_PRODUCT_CODE = item.grouP_PRODUCT_CODE;
        this.inputModel.grouP_PRODUCT_NAME = item.grouP_PRODUCT_NAME;
        this.inputModel.customeR_ID = item.customeR_ID;
        this.inputModel.customeR_NAME = item.customeR_NAME;
        this.poGroupProductService
			.gET_PRODUCT_OF_PO_GROUP_PRODUCT_Byid(item.grouP_PRODUCT_ID)
			.subscribe((res) => {
                this.polayoutdt.listProduct = [];
                this.polayoutdt.editTableAttachFile.setList([]);
				for (const itemdt of res) {
                    let product = new PO_PRODUCT_ENTITY();
                    
                    product.producT_ID = itemdt.producT_ID;
                    product.producT_CODE = itemdt.producT_CODE;
                    product.producT_NAME = itemdt.producT_NAME;
                    this.polayoutdt.listProduct.push(product);
                }
                for (const itemdt of res) {
                    let data = new PO_LAYOUT_DT_ENTITY();
                    let datas = this.polayoutdt.editTableAttachFile.allData;
                    // khách hàng
                    data.customeR_ID = itemdt.customeR_ID;
                    data.customeR_NAME = itemdt.customeR_NAME;
                    // sản phẩm
                    data.producT_ID = itemdt.producT_ID;
                    data.producT_CODE = itemdt.producT_CODE;
                    data.producT_NAME = itemdt.producT_NAME;
                    datas.push(data);
                    this.polayoutdt.editTableAttachFile.setList(datas);
                    this.polayoutdt.editTableAttachFile.updateParentView();
                }
			});
        this.updateView();
    }
    deleteGroupProduct(event) {
        this.inputModel.grouP_PRODUCT_ID = '';
        this.inputModel.grouP_PRODUCT_CODE = '';
        this.inputModel.grouP_PRODUCT_NAME = '';
        this.inputModel.customeR_ID = '';
        this.inputModel.customeR_NAME = '';
        this.updateView();
    }
}
