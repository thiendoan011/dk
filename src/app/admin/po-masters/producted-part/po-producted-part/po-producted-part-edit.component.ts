import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { PO_ENTITY, PoMasterServiceProxy, CM_DEPARTMENT_ENTITY, UltilityServiceProxy, PO_CUSTOMER_ENTITY, PO_PURCHASE_ENTITY, PO_PRODUCTED_PART_ENTITY, PO_PRODUCT_ENTITY, PO_GROUP_PRODUCT_ENTITY, PoGroupProductServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes } from '@app/ultilities/enum/all-codes';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { IUiActionRejectExt } from '@app/ultilities/ui-action-re';
import { NgForm } from '@angular/forms';
import { PoProductModalComponent } from '@app/admin/core/modal/module-po/po-product-modal/po-product-modal.component';
import { PoCustomerModalComponent } from '@app/admin/core/modal/module-po/po-customer-modal/po-customer-modal.component';
import { PoGroupProductModalComponent } from '@app/admin/core/modal/module-po/po-group-product-modal/po-group-product-modal.component';
import { ToolbarRejectExtComponent } from '@app/admin/core/controls/toolbar-reject-ext/toolbar-reject-ext.component';

@Component({
    templateUrl: './po-producted-part-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PoProductedPartEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionRejectExt<PO_ENTITY> {
    ngAfterViewInit(): void {
        this.updateView();
    }

    constructor(
        injector: Injector,
        private ultilityService: UltilityServiceProxy,
        private poMasterService: PoMasterServiceProxy,
        private poGroupProductService: PoGroupProductServiceProxy,
    ) {
        super(injector);

        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.pO_ID = this.getRouteParam('id');
        this.initFilter();
        this.initIsApproveFunct();
    }

    isApproveFunct: boolean;
    initIsApproveFunct(): void {
        this.ultilityService.isApproveFunct(this.getCurrentFunctionId()).subscribe((res) => {
			this.isApproveFunct = res;
		});
    }

    @ViewChild('editForm') editForm: NgForm;
    @ViewChild('editTablePurchase') editTablePurchase: EditableTableComponent<PO_PURCHASE_ENTITY>;
    @ViewChild('editTableProductedPart') editTableProductedPart: EditableTableComponent<PO_PRODUCTED_PART_ENTITY>;
    @ViewChild('editTableProduct') editTableProduct: EditableTableComponent<PO_PRODUCT_ENTITY>;
    @ViewChild('editTablePurchaseState') editTablePurchaseState: EditableTableComponent<PO_PURCHASE_ENTITY>;
    
    @ViewChild('poProductModal') poProductModal: PoProductModalComponent;
    // hệ hàng
    @ViewChild('editTableGroupProduct') editTableGroupProduct: EditableTableComponent<PO_GROUP_PRODUCT_ENTITY>;
    @ViewChild('poCusModal') poCusModal: PoCustomerModalComponent;
    @ViewChild('poGroupProductModal') poGroupProductModal: PoGroupProductModalComponent;
    
    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;

    inputModel: PO_ENTITY = new PO_ENTITY();
    filterInput: PO_ENTITY;
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

    dataInTables: PO_ENTITY[] = [];

    get apptoolbar(): ToolbarRejectExtComponent {
        return this.appToolbar as ToolbarRejectExtComponent;
    }

    ngOnInit(): void {

        switch (this.editPageState) {
            case EditPageState.add:
                this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
                this.appToolbar.setRole('PoProductedPart', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.inputModel.brancH_ID = this.appSession.user.subbrId;
                this.inputModel.brancH_NAME = this.appSession.user.branchName;
                this.disablePoEdit = false;
                break;
            case EditPageState.edit:
                this.inputModel.brancH_ID = this.appSession.user.subbrId;
                this.inputModel.brancH_NAME = this.appSession.user.branchName;
                this.disablePoEdit = true;
                this.appToolbar.setRole('PoProductedPart', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getPoMaster();
                var tmp = "";
                break;
            case EditPageState.viewDetail:
                this.inputModel.brancH_ID = this.appSession.user.subbrId;
                this.inputModel.brancH_NAME = this.appSession.user.branchName;
                this.disablePoEdit = true;
                this.appToolbar.setRole('PoProductedPart', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getPoMaster();
                break;
        }
        this.appToolbar.setUiAction(this);
        this.disableAssetInput = true;
    }

    getPoMaster() {
        // try {
        this.poMasterService.pO_ById(this.inputModel.pO_ID).subscribe(response => {
            if (!response) this.goBack()
            this.inputModel = response;

            // Danh sách công đoạn
			if (this.inputModel.pO_PRODUCTED_PARTs.length > 0) {
				this.editTableProductedPart.setList(this.inputModel.pO_PRODUCTED_PARTs);
            }

            if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
                this.appToolbar.setButtonApproveEnable(false);
                this.appToolbar.setButtonSaveEnable(true);
            }

            // CM_ATTACH_FILE
			this.getFile(this.inputModel.pO_ID, this.inputModel);

            this.updateParentView();
            this.updateView();
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
            this.inputModel.makeR_ID = this.appSession.user.userName;
			this.saving = true;
			this.isShowError = false;
            if(!this.inputModel.pO_ID) {
                this.onAdd();
            } else {
                this.onUpdate();
            }
        } 
    }

    getEditTablesData(): void {

        // Danh sách công đoạn
        this.inputModel.pO_PRODUCTED_PARTs = this.editTableProductedPart.allData;

        this.updateView();
    }

    goBack() {
        this.navigatePassParam('/app/admin/po-producted-part', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    onAdd(): void {
        this.poMasterService
        .pO_Ins(this.inputModel)
        .pipe(
            finalize(() => {
                this.saving = false
            })
        )
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc'])
            } else {
                this.inputModel.pO_ID = res['ID'];
                this.showSuccessMessage(res['ErrorDesc']);
                // CM_ATTACH_FILE
                this.addFile(this.inputModel, 'po-master', undefined, res['ID']);
                this.getPoMaster();
            }
            this.updateView();
        })
    }

    onUpdate(): void {
        this.updateView();
        this.poMasterService
			.pO_Upd(this.inputModel)
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
					this.updateFile(this.inputModel, 'po-master', undefined, this.inputModel.pO_ID);
                    this.getPoMaster();
                    this.updateView();
				}
			});
    }

    onDelete(item: PO_ENTITY): void {

    }

    onApprove(item: PO_ENTITY): void {
        
    }
    
    onViewDetail(item: PO_ENTITY): void {
    }

    onSave(): void {
        this.saveInput();
    }

    onSearch(): void {
    }

    onResetSearch(): void {
    }

    onReject(item: PO_ENTITY): void {

    }

    onReturn(notes: string) {
    }
    select2Change($event) {
        var tmp = $event;
    }

    onTemp(){

    }

    showProduct(): void {
		this.poProductModal.show();
	}
	
	onSelectProduct(items: PO_PRODUCT_ENTITY[]): void {
		items.forEach(x => {
			var item = new PO_PRODUCT_ENTITY();
			item.producT_ID = x.producT_ID;
			item.producT_CODE = x.producT_CODE;
			item.producT_NAME = x.producT_NAME;
			item.quantity = 0;
			this.editTableProduct.allData.push(item);
		})

		this.editTableProduct.resetNoAndPage();
		this.editTableProduct.changePage(0);
		this.updateView();
	}

    onViewPurchase(result): void {
        window.open("/app/admin/po-purchase-view;id="+result)
    }

    onViewPurchaseState(result): void {
        window.open("/app/admin/po-purchase-state-view;id="+result)
    }

    showCusModal(): void {
		this.poCusModal.filterInput.recorD_STATUS = RecordStatusConsts.Active;
		this.poCusModal.filterInput.top = null;
		this.poCusModal.show();
	}

    onSelectCustomer(event: PO_CUSTOMER_ENTITY): void {
		if (event) {
			this.inputModel.customeR_ID = event.customeR_ID;
			this.inputModel.customeR_NAME = event.customeR_NAME;
			this.updateView();
		}
	}

//#region 
    showGroupProduct(): void {
        this.poGroupProductModal.show();
    }

    async onSelectGroupProduct(items: PO_GROUP_PRODUCT_ENTITY[]){
        for await (const x of items) {
            // Nếu đã chọn hệ hàng rồi thì không cho chọn lại
            if(this.editTableGroupProduct.allData.filter(gp_item => gp_item.grouP_PRODUCT_ID == x.grouP_PRODUCT_ID).length > 0){
                this.showErrorMessage("Hệ hàng " + x.grouP_PRODUCT_NAME + " đã được chọn trước đó");
            }
            else{
                var item = new PO_GROUP_PRODUCT_ENTITY();
                item.grouP_PRODUCT_ID = x.grouP_PRODUCT_ID;
                item.grouP_PRODUCT_CODE = x.grouP_PRODUCT_CODE;
                item.grouP_PRODUCT_NAME = x.grouP_PRODUCT_NAME;
                item.color = x.color;
                this.editTableGroupProduct.allData.push(item);
    
                // Thêm danh sách sản phẩm có trong hệ hàng vào lưới sản phẩm
                await this.poGroupProductService.pO_Group_Product_ById(x.grouP_PRODUCT_ID).subscribe(response => {
                    // Danh sách sản phẩm
                    if (response.pO_PRODUCTs.length > 0) {
                        for (const item_product of response.pO_PRODUCTs) {
                            //item_product.grouP_PRODUCT_ID = x.grouP_PRODUCT_ID; 
                            this.editTableProduct.allData.push(item_product);
                            this.editTableProduct.resetNoAndPage();
                            this.editTableProduct.changePage(0);
                            this.updateView();
                        }
                    }
                });
            }
        }
        
        this.editTableGroupProduct.resetNoAndPage();
        this.editTableGroupProduct.changePage(0);
        this.updateView();
    }

    removeGroupProduct(){
        var deletetedItems = this.editTableGroupProduct.allData.filter((x) => x['isChecked']);
        // xóa hệ hàng  
        this.editTableGroupProduct.removeAllCheckedItem();

        for (var item of deletetedItems) {
            var index = this.editTableGroupProduct.allData.findIndex((x) => x.grouP_PRODUCT_ID == item.grouP_PRODUCT_ID);
            if (index >= 0) {
                this.editTableGroupProduct.allData[index]['isChecked'] = true;
                this.editTableGroupProduct.removeAllCheckedItem();
            }
        } 
        // xóa sản phẩm của hệ hàng
        if(this.editTableProduct && this.editTableProduct.allData.length > 0) {
            this.editTableProduct
            .setList(this.editTableProduct.allData.filter((x) => x.grouP_PRODUCT_ID !== item.grouP_PRODUCT_ID));
        }
        this.updateView();
    }

    getListProductOfGroupProduct(group_prodct_id:string){
        if(this.inputModel.autH_STATUS == 'A' ){
            this.editTableProduct.setList(this.inputModel.pO_PRODUCTs.filter((x) => x.grouP_PRODUCT_ID === group_prodct_id));
            this.editTableProduct.resetNoAndPage();
            this.editTableProduct.changePage(0);
            this.updateView();
        }
    }

    getAllProduct(){
        if(this.inputModel.autH_STATUS == 'A' ){
        this.editTableProduct.setList(this.inputModel.pO_PRODUCTs);
        this.editTableProduct.resetNoAndPage();
        this.editTableProduct.changePage(0);
        this.updateView();
        }
    }
//#endregion
}
