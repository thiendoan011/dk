import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { PO_GROUP_PRODUCT_ENTITY, PoGroupProductServiceProxy, CM_DEPARTMENT_ENTITY, UltilityServiceProxy, PO_CUSTOMER_ENTITY, PO_PRODUCT_ENTITY, AsposeServiceProxy, ReportInfo, PoPurchaseServiceProxy, PO_ENTITY } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { IUiActionRejectExt } from '@app/ultilities/ui-action-re';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { ReportTypeConsts } from '@app/admin/core/ultils/consts/ReportTypeConsts';
import { EditableTableComponent } from '@app/admin/core/controls/common/editable-table/editable-table.component';
import { PoCustomerModalComponent } from '@app/admin/core/modal/module-po/po-customer-modal/po-customer-modal.component';
import { PoProductModalComponent } from '@app/admin/core/modal/module-po/po-product-modal/po-product-modal.component';
import { ToolbarRejectExtComponent } from '@app/admin/core/controls/toolbar-reject-ext/toolbar-reject-ext.component';
import { POGroupProductPOEdittableComponent } from './edittable/po-group-product-po-edittable.component';
import { POHistory2ModalComponent } from '@app/admin/core/modal/module-po/po-history-2-modal/po-history-2-modal.component';

@Component({
    templateUrl: './group-product-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PoGroupProductEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionRejectExt<PO_GROUP_PRODUCT_ENTITY> {

    constructor(
        injector: Injector,
        private poPurchaseService: PoPurchaseServiceProxy,
        private poGroupProductService: PoGroupProductServiceProxy,
		private asposeService: AsposeServiceProxy,
		private fileDownloadService: FileDownloadService,
    ) {
        super(injector);

        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.grouP_PRODUCT_ID = this.getRouteParam('id');
        this.initFilter();
    }

    @ViewChild('editTableProduct') editTableProduct: EditableTableComponent<PO_PRODUCT_ENTITY>;
    @ViewChild('poGroupProductPOEdittable') poGroupProductPOEdittable: POGroupProductPOEdittableComponent;
    // lịch sử xử lý
    @ViewChild('history_modal') history_modal: POHistory2ModalComponent;

    @ViewChild('poCusModal') poCusModal: PoCustomerModalComponent;
    @ViewChild('poProductModal') poProductModal: PoProductModalComponent;

    EditPageState = EditPageState;
    editPageState: EditPageState;

    inputModel: PO_GROUP_PRODUCT_ENTITY = new PO_GROUP_PRODUCT_ENTITY();
    filterInput: PO_GROUP_PRODUCT_ENTITY;
    disablePoEdit: boolean;

    get disableInput(): boolean {
        return this.editPageState == EditPageState.viewDetail || this.inputModel.autH_STATUS == 'A';
    }

    get isEditGroupProduct(): boolean {
        return this.editPageState == EditPageState.viewDetail && this.inputModel.autH_STATUS == 'A';
    }

    get showButtonAppr(): boolean {
        if((this.editPageState == EditPageState.viewDetail && this.inputModel.autH_STATUS === 'U')){
            return true;
        }
        else{
            return false;
        }
    }

    get apptoolbar(): ToolbarRejectExtComponent {
        return this.appToolbar as ToolbarRejectExtComponent;
    }

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
                this.appToolbar.setRole('PoGroupProduct', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.disablePoEdit = false;
                break;
            case EditPageState.edit:
                this.disablePoEdit = true;
                this.appToolbar.setRole('PoGroupProduct', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getPoGroupProduct();
                break;
            case EditPageState.viewDetail:
                this.disablePoEdit = true;
                this.appToolbar.setRole('PoGroupProduct', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getPoGroupProduct();
                break;
        }
        this.appToolbar.setUiAction(this);
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    getPoGroupProduct() {
        this.poGroupProductService.pO_Group_Product_ById(this.inputModel.grouP_PRODUCT_ID).subscribe(response => {
            if (!response) this.goBack()
            this.inputModel = response;

            // Danh sách sản phẩm
			if (this.inputModel.pO_PRODUCTs.length > 0) {
				this.editTableProduct.setList(this.inputModel.pO_PRODUCTs);
            }

            // Danh sách PO đã chọn hệ hàng này
			if (this.inputModel.pO_POs && this.inputModel.pO_POs.length > 0) {
				this.poGroupProductPOEdittable.editTable.setList(this.inputModel.pO_POs);
                this.poGroupProductPOEdittable.refreshTable();
            }
            
            // lịch sử xử lý
            this.history_modal.getDetail();

            if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
                this.appToolbar.setButtonApproveEnable(false);
                this.appToolbar.setButtonSaveEnable(false);
            }

            this.updateView();
        });

    }

    saveInput() {

        this.getEditTablesData();

        if(this.editPageState != EditPageState.viewDetail) {
            this.inputModel.makeR_ID = this.appSession.user.userName;
			this.saving = true;
            if(!this.inputModel.grouP_PRODUCT_ID) {
                this.onAdd();
            } else {
                this.onUpdate();
            }
        } 
    }

    getEditTablesData(): void {
        // Danh sách sản phẩm
        this.inputModel.pO_PRODUCTs = this.editTableProduct.allData;
    }

    goBack() {
        this.navigatePassParam('/app/admin/po-group-product', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    onAdd(): void {
        this.poGroupProductService
        .pO_Group_Product_Ins(this.inputModel)
        .pipe(
            finalize(() => {
                this.saving = false
            })
        )
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.inputModel.grouP_PRODUCT_ID = res['ID'];
                this.showSuccessMessage(res['ErrorDesc']);
                this.getPoGroupProduct();
                this.updateView();
            }
        })
    }

    onUpdate(): void {
        this.updateView();
        this.poGroupProductService
			.pO_Group_Product_Upd(this.inputModel)
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
                    this.getPoGroupProduct();
                    this.updateView();
				}
			});
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
    onDeleteCustomer(){
        this.inputModel.customeR_ID = '';
        this.inputModel.customeR_NAME = '';
        this.updateView();
    }

    onDelete(item: PO_GROUP_PRODUCT_ENTITY): void {

    }

    onApprove(item: PO_GROUP_PRODUCT_ENTITY): void {
        this.poGroupProductService
			.pO_GROUP_PRODUCT_Appr(this.inputModel.grouP_PRODUCT_ID, this.appSession.user.userName)
			.pipe( finalize(() => { this.saving = false; }) )
            .subscribe((res) => {
                if (res['Result'] != '0') {
                    this.showErrorMessage(res['ErrorDesc']);
                    this.updateView();
                } else {
                    this.showSuccessMessage(res['ErrorDesc']);
                    this.getPoGroupProduct();
                    this.updateView();
                }
            });
    }

    onEdit(item: PO_GROUP_PRODUCT_ENTITY): void {
        this.poGroupProductService
			.pO_GROUP_PRODUCT_Edit(this.inputModel.grouP_PRODUCT_ID, this.appSession.user.userName)
			.pipe( finalize(() => { this.saving = false; }) )
            .subscribe((res) => {
                if (res['Result'] != '0') {
                    this.showErrorMessage(res['ErrorDesc']);
                    this.updateView();
                } else {
                    this.showSuccessMessage(res['ErrorDesc']);
                    this.getPoGroupProduct();
                    this.updateView();
                }
            });
    }
    
    onViewDetail(item: PO_GROUP_PRODUCT_ENTITY): void {
    }

    onSave(): void {
        this.saveInput();
    }

    onSearch(): void {
    }

    onResetSearch(): void {
    }

    onReject(item: PO_GROUP_PRODUCT_ENTITY): void {

    }

    onReturn(notes: string) {
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

    importFilterInput: PO_GROUP_PRODUCT_ENTITY = new PO_GROUP_PRODUCT_ENTITY();
    xlsStructure = [
        'producT_CODE',
        'producT_NAME',
        'notes',
	];
    onImportExcel(rows: any) {
		var bakValidation = [ ...this.editTableProduct.validations ];
		this.editTableProduct.validations = [];

		let excelArr = this.xlsRowsToArrCheckVal<PO_PRODUCT_ENTITY>(
			this.editTableProduct,rows,this.xlsStructure,
			function(obj: PO_PRODUCT_ENTITY) {return obj;},undefined,false);

		if (!excelArr) {
			abp.ui.clearBusy();
			return;
		}
		this.importFilterInput.pO_PRODUCTs = excelArr.map(this.excelMapping);

		if (excelArr && excelArr.length) {
			this.poPurchaseService
				.pO_PRODUCT_Import(this.importFilterInput)
				.pipe(finalize(() => {abp.ui.clearBusy();}))
				.subscribe((res) => {
                    if(res && res[0].producT_ID == '-1'){
                        this.showErrorMessage(res[0].producT_CODE);
                        this.updateView();
                        return;
                    }
					else if (res.length > 0) {
						res.forEach((x) => {
                            var item = new PO_PRODUCT_ENTITY();
                            item.grouP_PRODUCT_ID = this.inputModel.grouP_PRODUCT_ID;
                            item.producT_ID = x.producT_ID;
                            item.producT_CODE = x.producT_CODE;
                            item.producT_NAME = x.producT_NAME;
                            item.notes = x.notes;
                            this.editTableProduct.allData.push(item);
						});

						this.editTableProduct.resetNoAndPage();
						this.editTableProduct.changePage(0);
						this.showSuccessMessage(this.l('ImportSuccessfully'));
						this.updateView();
					} else {
						this.showErrorMessage(this.l('Immport file excel thất bại'));
						this.updateView();
					}
				});
		}
		this.editTableProduct.validations = [ ...bakValidation ];
		abp.ui.clearBusy();
		this.updateView();
	}

    exportExcelTemplate() {
		let reportInfo = new ReportInfo();
		reportInfo.typeExport = ReportTypeConsts.Excel;
		reportInfo.pathName = '/PO_MASTER/FileImport_Product.xlsx';
		reportInfo.storeName = 'PO_PURCHASE_Search';
		this.asposeService.getReport(reportInfo).subscribe((res) => {
			this.fileDownloadService.downloadTempFile(res);
		});
	}

    onGroupProductAppr(){
        this.poGroupProductService
			.pO_GROUP_PRODUCT_Appr(this.inputModel.grouP_PRODUCT_ID, this.appSession.user.userName)
			.pipe( finalize(() => { this.saving = false; }) )
            .subscribe((res) => {
                if (res['Result'] != '0') {
                    this.showErrorMessage(res['ErrorDesc']);
                    this.updateView();
                } else {
                    this.showSuccessMessage(res['ErrorDesc']);
                    this.getPoGroupProduct();
                    this.updateView();
                }
            });
    }
}
