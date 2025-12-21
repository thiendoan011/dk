import { Component, Injector, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AsposeServiceProxy, ReportInfo, PRODUCT_COSTSTATEMENT_ENTITY, SupplierServiceProxy, ProductCoststatementServiceProxy, PRODUCT_COSTSTATEMENT_GROUP_DETAIL_ENTITY, ProductGroupDetailServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { ReportTypeConsts } from '@app/admin/core/ultils/consts/ReportTypeConsts';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { ProductCoststatementPDEdittableComponent } from './edittable/product-coststatement-pd-edittable.component';
import { ProductCoststatementPGDEdittableComponent } from './edittable/product-coststatement-pgd-edittable.component';

@Component({
    templateUrl: './product-coststatement-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ProductCoststatementEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<PRODUCT_COSTSTATEMENT_ENTITY> {
//#region constructor
    constructor(
        injector: Injector,
        private coststatementService: ProductCoststatementServiceProxy,
        private productGroupDetailService: ProductGroupDetailServiceProxy,
        private asposeService: AsposeServiceProxy,
        private fileDownloadService: FileDownloadService,
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.producT_COSTSTATEMENT_ID = this.getRouteParam('id');
    }

    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: PRODUCT_COSTSTATEMENT_ENTITY = new PRODUCT_COSTSTATEMENT_ENTITY();
    filterInput: PRODUCT_COSTSTATEMENT_ENTITY;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.appToolbar.setRole('ProductCoststatement', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('ProductCoststatement', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('ProductCoststatement', false, false, false, false, false, false, true, false);
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
        this.navigatePassParam('/app/admin/product-coststatement', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.coststatementService.pRODUCT_COSTSTATEMENT_ById(this.inputModel.producT_COSTSTATEMENT_ID).subscribe(response => {
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
        if(this.editPageState != EditPageState.viewDetail) {
            if(!this.inputModel.producT_COSTSTATEMENT_ID) {
                this.onAdd();
            } else {
                this.onUpdate();
            }
        } 
    }

    onAdd(): void {
        this.saving = true;
        this.coststatementService
        .pRODUCT_COSTSTATEMENT_Ins(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.inputModel.producT_COSTSTATEMENT_ID = res['ID'];
                this.showSuccessMessage(res['ErrorDesc']);
                this.getDataPages();
                this.updateView();
            }
        })
    }

    onUpdate(): void {
        this.saving = true;
        this.coststatementService
        .pRODUCT_COSTSTATEMENT_Upd(this.inputModel)
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

    onApprove(item: PRODUCT_COSTSTATEMENT_ENTITY): void{
        this.message.confirm(
            this.l('ApproveWarningMessage', (this.inputModel.producT_COSTSTATEMENT_CODE)),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.coststatementService
                    .pRODUCT_COSTSTATEMENT_App(this.inputModel.producT_COSTSTATEMENT_ID, this.appSession.user.userName)
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

//#region Import excel
    importFilterInput: PRODUCT_COSTSTATEMENT_ENTITY[] = [];
    xlsStructure = [
        'producT_COSTSTATEMENT_CODE',
        'suP_NAME',
        'addr',
        'contacT_PERSON',
        'tel',
        'email',
        'notes'
	];
    onImportExcel(rows: any) {
        abp.ui.setBusy();
        let excelArr = this.xlsRowsToArr(rows, this.xlsStructure, function (obj: PRODUCT_COSTSTATEMENT_ENTITY) {
            return obj;
        })
		if (!excelArr) {
			abp.ui.clearBusy();
			return;
		}
        // phần gán data gửi về BE
		this.importFilterInput = excelArr.map(this.excelMapping);
        /*
		if (excelArr && excelArr.length) {
			this.coststatementService
				.pRODUCT_COSTSTATEMENT_IMPORT_Data(this.appSession.user.userName, this.importFilterInput)
				.pipe( finalize(() => { abp.ui.clearBusy();}))
                .subscribe((res) => {
                    if(res['Result'] == '-1'){
                        this.showErrorMessage(res['ErrorDesc']);
                    }
                    else{
                        this.showSuccessMessage(this.l('ImportSuccessfully'));
                    }
                    this.updateView();
                });
		}
        */
		this.updateView();
	}

    exportExcelTemplate() {
        abp.ui.setBusy();
		let reportInfo = new ReportInfo();
		reportInfo.typeExport = ReportTypeConsts.Excel;
        reportInfo.pathName = '/COMMON/FileImport_Supplier.xlsx';
		reportInfo.storeName = 'CM_SUPPLIER_ById';
		this.asposeService
        .getReportFromTable(reportInfo)
        .pipe( finalize(() => { abp.ui.clearBusy();}))
        .subscribe((res) => {
            this.fileDownloadService.downloadTempFile(res);
		});
	}
//#endregion Import excel

//#region "EditTable"
    getDataEditTables(){
        // Cụm chi tiết
        this.inputModel.producT_GROUP_DETAILs = this.productPGDEdittable.editTable.allData;
        // Mô tả chi tiết
        this.inputModel.producT_DETAILs = this.productPDEdittable.editTable.allData;
    }
    setDataEditTables(){
        // Cụm chi tiết
        if (this.inputModel.producT_GROUP_DETAILs && this.inputModel.producT_GROUP_DETAILs.length > 0) {
            this.productPGDEdittable.editTable.setList(this.inputModel.producT_GROUP_DETAILs);
            this.productPGDEdittable.refreshTable();
        }
        // Mô tả chi tiết
        if (this.inputModel.producT_DETAILs && this.inputModel.producT_DETAILs.length > 0) {
            this.productPDEdittable.editTable.setList(this.inputModel.producT_DETAILs);
            this.productPDEdittable.refreshTable();
        }
    }

    // Cụm chi tiết
    @ViewChild('productPGDEdittable') productPGDEdittable: ProductCoststatementPGDEdittableComponent;
    // Mô tả chi tiết
    @ViewChild('productPDEdittable') productPDEdittable: ProductCoststatementPDEdittableComponent;

//#endregion "EditTable"

//#region Status Page
    setViewToolBar(){
        // Button lưu
        if(this.editPageState == EditPageState.viewDetail){
            this.appToolbar.setButtonSaveEnable(false);
        }
        else{
            if(this.inputModel.producT_COSTSTATEMENT_ID != AuthStatusConsts.Approve){
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

//#region Event Emitter
    onSelectProductGroupDetail(id: string){
        this.productGroupDetailService.pRODUCT_GROUP_DETAIL_GET_LIST_PRODUCT_DETAIL_ById(id).subscribe(res => {
            // Danh sách mô tả chi tiết
            if (res.length > 0) {
                for (const item of res) {
                    this.productPDEdittable.editTable.allData.push(item);
                    this.productPDEdittable.editTable.resetNoAndPage();
                    this.productPDEdittable.editTable.changePage(0);
                    this.updateView();
                }
            }
        });
    }

    async onRemoveProductGroupDetail(deletetedItems: PRODUCT_COSTSTATEMENT_GROUP_DETAIL_ENTITY[]){
        for await (var item of deletetedItems) {
            // xóa danh sách mô tả chi tiết
            if(this.productPDEdittable.editTable && this.productPDEdittable.editTable.allData.length > 0) {
                this.productPDEdittable.editTable
                .setList(this.productPDEdittable.editTable.allData.filter((x) => x.producT_GROUP_DETAIL_ID !== item.producT_GROUP_DETAIL_ID));
            }
            this.updateView();
        }
    }
//#endregion Event Emitter
    /*

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
    */
}
