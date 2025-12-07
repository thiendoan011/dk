import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { PO_ENTITY, PoMasterServiceProxy, UltilityServiceProxy, PO_CUSTOMER_ENTITY, PO_PRODUCTED_PART_ENTITY, PO_PRODUCT_ENTITY, PO_GROUP_PRODUCT_ENTITY, PoGroupProductServiceProxy, CM_BRANCH_ENTITY, BranchServiceProxy, R_ENTITY, AsposeServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { IUiActionRejectExt } from '@app/ultilities/ui-action-re';
import { NgForm } from '@angular/forms';
import { PoCustomerModalComponent } from '@app/admin/core/modal/module-po/po-customer-modal/po-customer-modal.component';
import { PoGroupProductModalComponent } from '@app/admin/core/modal/module-po/po-group-product-modal/po-group-product-modal.component';
import { ToolbarRejectExtComponent } from '@app/admin/core/controls/toolbar-reject-ext/toolbar-reject-ext.component';
import { RModalComponent } from '@app/admin/core/modal/module-po/r-modal/r-modal.component';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { PoProductOfPOModalComponent } from '@app/admin/core/modal/module-po/po-product-of-po-modal/po-product-of-po-modal.component';
import { POMasterAttachFileComponent } from './edittable/po-master-attach-file.component';
import { POHistoryModalComponent } from '@app/admin/core/modal/module-po/po-history-modal/po-history-modal.component';
import { POMasterBookingEdittableComponent } from './edittable/po-master-booking-edittable.component';

@Component({
    templateUrl  : './po-master-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : [appModuleAnimation()]
})
export class PoEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionRejectExt<PO_ENTITY> {
//#region constructor
    constructor(
        injector                     : Injector,
        private ultilityService      : UltilityServiceProxy,
        private poMasterService      : PoMasterServiceProxy,
        private branchService        : BranchServiceProxy,
		private asposeService        : AsposeServiceProxy,
		private fileDownloadService  : FileDownloadService,
        private poGroupProductService: PoGroupProductServiceProxy
    ) {
        super(injector);
        this.editPageState    = this.getRouteData('editPageState');
        this.inputModel.pO_ID = this.getRouteParam('id');
        this.initFilter();
        this.initIsApproveFunct();
    }
    
    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel       : PO_ENTITY = new PO_ENTITY();
    filterInput      : PO_ENTITY;
    isApproveFunct      : boolean;
    isShowError = false;
    @ViewChild('editForm') editForm                             : NgForm;

    initIsApproveFunct(): void {
        this.ultilityService.isApproveFunct(this.getCurrentFunctionId()).subscribe((res) => {
			this.isApproveFunct = res;
		});
        
        this.branchService.cM_BRANCH_GetAllChild('DV0001').subscribe(response => {
            this.list_branch = response;
            this.updateView();
        })
    }

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add: 
                this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
                this.appToolbar.setRole('PoMaster', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.inputModel.brancH_ID   = this.appSession.user.subbrId;
                this.inputModel.brancH_CREATE   = this.appSession.user.subbrId;
                this.inputModel.brancH_NAME = this.appSession.user.branchName;
                break;
            case EditPageState.edit: 
                this.appToolbar.setRole('PoMaster', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getPoMaster();
                break;
            case EditPageState.viewDetail: 
                this.appToolbar.setRole('PoMaster', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getPoMaster();
                break;
        }
        this.appToolbar.setUiAction(this);
    }

    ngAfterViewInit(): void {
        this.updateView();
    }
//#endregion constructor


//#region CRUD
    goBack() {
        this.navigatePassParam('/app/admin/po-master', null, { filterInput: JSON.stringify(this.filterInput) });
    }
    getPoMaster() {
          // try {
        this.poMasterService.pO_ById(this.inputModel.pO_ID).subscribe(response => {
            if (!response) this.goBack()
            this.inputModel = response;

            this.setDataEditTables();
            this.history.getReject();

            if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
                this.appToolbar.setButtonApproveEnable(false);
                this.appToolbar.setButtonSaveEnable(true);
            }

            this.updateParentView();
            this.updateView();
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
			this.saving              = true;
			this.isShowError         = false;
            if(!this.inputModel.pO_ID) {
                this.onAdd();
            } else {
                this.onUpdate();
            }
        } 
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
                    this.getPoMaster();
                    this.updateView();
				}
			});
    }

    onDelete(item: PO_ENTITY): void {

    }

    onApprove(item: PO_ENTITY): void {
        // this.message.confirm(
        //     this.l('ApproveWarningMessage', (this.inputModel.pO_CODE)),
        //     this.l('AreYouSure'),
        //     (isConfirmed) => {
        //         if (isConfirmed) {
        //             this.saving = true;
        //             this.poMasterService
        //             .pO_Appr(this.inputModel.pO_ID, this.appSession.user.userName)
        //             .pipe(finalize(() => {this.saving = false}))
        //             .subscribe((res) => {
        //                 if (res['Result'] != '0') {
        //                     this.showErrorMessage(res['ErrorDesc']);
        //                     this.updateView();
        //                 } 
        //                 else {
        //                     this.getPoMaster();
        //                     this.updateView();
        //                 }
        //             });
        //         }
        //     }
        // );
    }
    
    onSearch(){ }; onResetSearch(){ }; onViewDetail(item: PO_ENTITY){ }; onReject(item: PO_ENTITY){ };

    onSaveNotesFactory(){
        this.poMasterService.pO_NOTES_FACTORY_Upd(this.inputModel)
			.pipe(finalize(() => {this.saving = false;}))
			.subscribe((res) => {
				if (res['Result'] != '0') {
					this.showErrorMessage(res['ErrorDesc']);
				} else {
					this.showSuccessMessage(res['ErrorDesc']);
                    this.getPoMaster();
                    this.updateView();
				}
			});

    }
//#endregion CRUD  

//#region Status Page

    get apptoolbar(): ToolbarRejectExtComponent {
        return this.appToolbar as ToolbarRejectExtComponent;
    }

    get disableInput(): boolean {
        return this.editPageState == EditPageState.viewDetail || this.inputModel.autH_STATUS == 'A';
    }

//#endregion Status Page

//#region "EditTable"

    getEditTablesData(): void {
        // File đính kèm
        this.inputModel.pO_MASTER_ATTACH_FILEs = this.poMasterAttachFile.editTable.allData;
        // Danh sách hệ hàng
        this.inputModel.pO_GROUP_PRODUCTs = this.editTableGroupProduct.allData;
        // Danh sách sản phẩm
        this.inputModel.pO_PRODUCTs = this.editTableProduct.allData;
        // Danh sách công đoạn
        this.inputModel.pO_PRODUCTED_PARTs = this.editTableProductedPart.allData;

        this.updateView();
    }

    setDataEditTables(){

        // File đính kèm
        if (this.inputModel.pO_MASTER_ATTACH_FILEs && this.inputModel.pO_MASTER_ATTACH_FILEs.length > 0) {
            this.poMasterAttachFile.editTable.setList(this.inputModel.pO_MASTER_ATTACH_FILEs);
            this.poMasterAttachFile.refreshTable();
        }
        // Danh sách hệ hàng
        if (this.inputModel.pO_GROUP_PRODUCTs.length > 0) {
            this.editTableGroupProduct.setList(this.inputModel.pO_GROUP_PRODUCTs);
        }
        // Danh sách sản phẩm
        if (this.inputModel.pO_PRODUCTs.length > 0) {
            this.editTableProduct.setList(this.inputModel.pO_PRODUCTs);
        }
        // Danh sách công đoạn
        if (this.inputModel.pO_PRODUCTED_PARTs.length > 0) {
            this.editTableProductedPart.setList(this.inputModel.pO_PRODUCTED_PARTs);
        }
        // Danh sách booking
        if (this.inputModel.pO_MASTER_BOOKINGs.length > 0) {
            this.poMasterBookingEdittable.editTable.setList(this.inputModel.pO_MASTER_BOOKINGs);
        }
    }

    // Lịch sử xử lý
    @ViewChild('history') history       : POHistoryModalComponent;

    // File đính kèm
    @ViewChild('poMasterAttachFile') poMasterAttachFile: POMasterAttachFileComponent;
    // Hệ hàng
    @ViewChild('editTableGroupProduct') editTableGroupProduct   : EditableTableComponent<PO_GROUP_PRODUCT_ENTITY>;
    // Sản phẩm
    @ViewChild('editTableProduct') editTableProduct             : EditableTableComponent<PO_PRODUCT_ENTITY>;
    // Công đoạn
    @ViewChild('editTableProductedPart') editTableProductedPart : EditableTableComponent<PO_PRODUCTED_PART_ENTITY>;
    // Booking
    @ViewChild('poMasterBookingEdittable') poMasterBookingEdittable: POMasterBookingEdittableComponent;

    //popup of ViewChild
    list_branch: CM_BRANCH_ENTITY[];
    // Hệ hàng
    @ViewChild('poGroupProductModal') poGroupProductModal       : PoGroupProductModalComponent;
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
                var item                    = new PO_GROUP_PRODUCT_ENTITY();
                    item.grouP_PRODUCT_ID   = x.grouP_PRODUCT_ID;
                    item.grouP_PRODUCT_CODE = x.grouP_PRODUCT_CODE;
                    item.grouP_PRODUCT_NAME = x.grouP_PRODUCT_NAME;
                    item.color              = x.color;
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
        // Lấy danh sách hệ hàng bị xóa
        var deletetedItems = this.editTableGroupProduct.allData.filter((x) => x['isChecked'] && !x.pO_ID);
        // xóa hệ hàng  
        this.editTableGroupProduct.removeAllCheckedItemWithoutCondition("pO_ID", this.inputModel.pO_ID)
        // xóa sản phẩm của hệ hàng
        for (var item of deletetedItems) {
            // xóa sản phẩm của hệ hàng
            if(this.editTableProduct && this.editTableProduct.allData.length > 0) {
                this.editTableProduct.removeAllItemWithCondition("grouP_PRODUCT_CODE", item.grouP_PRODUCT_CODE);
                this.updateView();
            }
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

    // Sản phẩm
    @ViewChild('poProductOfPOModal') poProductOfPOModal: PoProductOfPOModalComponent;
    onAddProductOfGroupProduct(){
        this.poProductOfPOModal.po_id = this.inputModel.pO_ID;
        this.poProductOfPOModal.show();
    }
    onSelectProductOfPO(item){
        for (const item_product of item) {
            if(this.editTableProduct.allData.filter(x => x.producT_ID == item_product.producT_ID).length > 0){
                this.showErrorMessage('Mã sản phẩm ' + item_product.producT_CODE + ' đã được chọn trước đó');
            }
            else{
                this.editTableProduct.allData.push(item_product);
                this.editTableProduct.resetNoAndPage();
                this.editTableProduct.changePage(0);
                this.updateView();
            }
        }
    }
    onRemoveProductOfGroupProduct(){
        this.editTableProduct.removeAllCheckedItemWithoutCondition("pO_ID", this.inputModel.pO_ID);
		this.updateView();
    }

    onDeleteGroupProductOfPO(item: PO_GROUP_PRODUCT_ENTITY){
        this.message.confirm(
            this.l('Xác nhận xóa hệ hàng ' + item.grouP_PRODUCT_CODE),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    try {
                        this.saving = true;
                        this.poMasterService
                        .pO_DELETE_GROUP_PRODUCT_OF_PO_Byid(item.pO_ID, item.grouP_PRODUCT_ID)
                        .pipe(finalize(() => {this.saving = false}))
                        .subscribe((res) => {
                            if (res['Result'] != '0') {
                                this.showErrorMessage(res['ErrorDesc']);
                                this.updateView();
                            } 
                            else {
                                this.getPoMaster();
                                this.showSuccessMessage(res['ErrorDesc']);
                                this.updateView();
                            }
                        });
                    } catch (error) {
                        this.saving = false;
                        this.showErrorMessage(error.toString());
                    }
                }
            }
        );
    }
    
    onDeleteProductOfPO(item: PO_PRODUCT_ENTITY){
        this.message.confirm(
            this.l('Xác nhận xóa sản phẩm ' + item.producT_CODE),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    try {
                        this.saving = true;
                        this.poMasterService
                        .pO_DELETE_PRODUCT_OF_PO_Byid(item.pO_ID, item.grouP_PRODUCT_ID, item.producT_ID)
                        .pipe(finalize(() => {this.saving = false}))
                        .subscribe((res) => {
                            if (res['Result'] != '0') {
                                this.showErrorMessage(res['ErrorDesc']);
                                this.updateView();
                            } 
                            else {
                                this.getPoMaster();
                                this.showSuccessMessage(res['ErrorDesc']);
                                this.updateView();
                            }
                        });
                    } catch (error) {
                        this.saving = false;
                        this.showErrorMessage(error.toString());
                    }
                }
            }
        );
    }

//#endregion "EditTable"

//#region popup of master
    //R
    @ViewChild('rRModal') rRModal : RModalComponent;
    rModal(): void {
        this.rRModal.filterInput.customeR_ID = this.inputModel.customeR_ID;
        this.rRModal.filterInput.autH_STATUS = 'E';
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

    // Khách hàng
    @ViewChild('poCusModal') poCusModal                         : PoCustomerModalComponent;
    showCusModal(): void {
		this.poCusModal.filterInput.recorD_STATUS = RecordStatusConsts.Active;
		this.poCusModal.filterInput.top           = null;
		this.poCusModal.show();
	}
    onSelectCustomer(event: PO_CUSTOMER_ENTITY): void {
		if (event) {
			this.inputModel.customeR_ID   = event.customeR_ID;
			this.inputModel.customeR_NAME = event.customeR_NAME;
			this.updateView();
		}
	}

//#endregion popup of master

}
