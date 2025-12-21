import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { AsposeServiceProxy, PRODUCT_PRODUCT_ENTITY, ProductProductServiceProxy, ReportInfo } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { NgForm } from '@angular/forms';
import { ToolbarComponent } from '@app/admin/core/controls/toolbar/toolbar.component';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { ProductGroupDetailEdittableComponent } from '../product-group-detail/edittable-out/product-group-detail-edittable.component';
import { WebConsts } from '@app/ultilities/enum/consts';
import { ReportTypeConsts } from '@app/admin/core/ultils/consts/ReportTypeConsts';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { ProductHistoryModalComponent } from '@app/admin/core/modal/module-product/product-history-modal/product-history-modal.component';

@Component({
    templateUrl: './product-product-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ProductProductEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<PRODUCT_PRODUCT_ENTITY> {
//#region "Constructor"
    constructor(
        injector: Injector,
        private productProductService: ProductProductServiceProxy,
		private asposeService: AsposeServiceProxy,
		private fileDownloadService: FileDownloadService,
    ) {
        super(injector);

        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.producT_ID = this.getRouteParam('id');
        this.initFilter();
    }
    
    EditPageState = EditPageState;
    editPageState: EditPageState;
    @ViewChild('editForm') editForm: NgForm;

    // Begin Change when clone component
    inputModel: PRODUCT_PRODUCT_ENTITY = new PRODUCT_PRODUCT_ENTITY();
    filterInput: PRODUCT_PRODUCT_ENTITY;
    get apptoolbar(): ToolbarComponent {
        return this.appToolbar as ToolbarComponent;
    }
    // End Change when clone component

//#endregion "Constructor"

    ngOnInit(): void {

        switch (this.editPageState) {
            case EditPageState.add:
                this.appToolbar.setRole('ProductProduct', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('ProductProduct', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPage();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('ProductProduct', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getDataPage();
                break;
        }
        this.appToolbar.setUiActionEdit(this);
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    goBack() {
        this.navigatePassParam('/app/admin/product-product', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPage() {
        abp.ui.setBusy();
        this.productProductService.pRODUCT_PRODUCT_ById(this.inputModel.producT_ID)
        .pipe(finalize(() => {abp.ui.clearBusy();}))
        .subscribe(response => {
            // set data
            if (!response) this.goBack()
            this.inputModel = response;

            this.setDataEditTables();

            this.setViewToolBar();

            this.onChaneNumber();

            // lịch sử xử lý
            this.history_modal.getDetail();

            this.updateView();
        });
    }

    onSave(): void {
        abp.ui.setBusy();
        this.saveInput();
    }

    saveInput() {

        this.getDataEditTables();
        this.inputModel.useR_LOGIN = this.appSession.user.userName;
        if(this.editPageState != EditPageState.viewDetail) {
            if(!this.inputModel.producT_ID) {
                this.onAdd();
            } else {
                this.onUpdate();
            }
        } 
    }

    onAdd(): void {
    }

    onUpdate(): void {
        this.updateView();
        this.productProductService
			.pRODUCT_PRODUCT_Upd(this.inputModel)
			.pipe(
				finalize(() => {
					abp.ui.clearBusy();
				})
			)
			.subscribe((res) => {
				if (res['Result'] != '0') {
					this.showErrorMessage(res['ErrorDesc']);
				} else {
					this.updateSuccess();
                    this.getDataPage();
                    this.updateView();
				}
			});
    }

    onApprove(item: PRODUCT_PRODUCT_ENTITY): void {
        this.inputModel.checkeR_ID = this.appSession.user.userName;
    }

//#region "EditTable"
    getDataEditTables(){
        // Cụm chi tiết
        this.inputModel.producT_PRODUCT_GROUP_DETAILs = this.productGroupDetailEdittable.editTable.allData;
        // Bảng chiết tính
        //this.inputModel.producT_PRODUCT_COSTSTATEMENTs = this.productCoststatementdittable.editTable.allData;
    }
    setDataEditTables(){
        // Cụm chi tiết
        if (this.inputModel.producT_PRODUCT_GROUP_DETAILs && this.inputModel.producT_PRODUCT_GROUP_DETAILs.length > 0) {
            this.productGroupDetailEdittable.editTable.setList(this.inputModel.producT_PRODUCT_GROUP_DETAILs);
            this.productGroupDetailEdittable.refreshTable();
        }
        // // Bảng chiết tính
        // if (this.inputModel.producT_PRODUCT_COSTSTATEMENTs && this.inputModel.producT_PRODUCT_COSTSTATEMENTs.length > 0) {
        //     this.productCoststatementdittable.editTable.setList(this.inputModel.producT_PRODUCT_COSTSTATEMENTs);
        //     this.productCoststatementdittable.refreshTable();
        // }
    }

    // Bảng chiết tính
    //@ViewChild('productCoststatementdittable') productCoststatementdittable: ProductCoststatementEdittableComponent;
    // Cụm chi tiết
    @ViewChild('productGroupDetailEdittable') productGroupDetailEdittable: ProductGroupDetailEdittableComponent;
    // lịch sử xử lý
    @ViewChild('history_modal') history_modal: ProductHistoryModalComponent;
//#endregion "EditTable"

//#region Status Page
    setViewToolBar(){
        // Button lưu
        /*
        if(this.editPageState == EditPageState.viewDetail){
            this.appToolbar.setButtonSaveEnable(false);
        }
        else{
            if(this.statusModel.disablE_INPUT == '0'){
                this.appToolbar.setButtonSaveEnable(false);
            }
            else{
                this.appToolbar.setButtonSaveEnable(true);
            }
        }
        */
        // Button duyệt

        if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
            this.appToolbar.setButtonApproveEnable(false);
            this.appToolbar.setButtonSaveEnable(true);
        }
    }

    get disableInput(): boolean {
        return this.editPageState == EditPageState.viewDetail || this.inputModel.autH_STATUS == 'A';
    }
//#endregion Status Page

    onChaneNumber(){
        this.inputModel.producT_SPECIFI_LENGTH_INCH = this.inputModel.producT_SPECIFI_LENGTH*WebConsts.MmToInch;
        this.inputModel.producT_SPECIFI_WIDTH_INCH = this.inputModel.producT_SPECIFI_WIDTH*WebConsts.MmToInch;
        this.inputModel.producT_SPECIFI_HEIGHT_INCH = this.inputModel.producT_SPECIFI_HEIGHT*WebConsts.MmToInch;

        this.inputModel.cartoN_SPECIFI_LENGTH_INCH = this.inputModel.cartoN_SPECIFI_LENGTH*WebConsts.MmToInch;
        this.inputModel.cartoN_SPECIFI_WIDTH_INCH = this.inputModel.cartoN_SPECIFI_WIDTH*WebConsts.MmToInch;
        this.inputModel.cartoN_SPECIFI_HEIGHT_INCH = this.inputModel.cartoN_SPECIFI_HEIGHT*WebConsts.MmToInch;

        this.updateView();
    }
//#region Export Excel
    exportToExcel(type_export: string){
        abp.ui.setBusy();

        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        let filterReport = { ...this.inputModel }
        filterReport.maxResultCount = -1;

        reportInfo.parameters = this.GetParamsFromFilter({
            TYPE_EXPORT: type_export,
            PRODUCT_ID: this.inputModel.producT_ID
        });
        
        if(type_export == 'BCT_HARDWARE'){
            reportInfo.pathName = "/PRODUCT/PRODUCT/PRODUCT_PRODUCT_BCT_HARDWARE.xlsx";
            reportInfo.storeName = "PRODUCT_PRODUCT_EXPORT_EXCEL";
        }
        else if(type_export == 'BCT_PHOI'){
            reportInfo.pathName = "/PRODUCT/PRODUCT/PRODUCT_PRODUCT_BCT_PHOI.xlsx";
            reportInfo.storeName = "PRODUCT_PRODUCT_EXPORT_EXCEL";
        }

        this.asposeService
        .getReport(reportInfo)
        .pipe(finalize(() => abp.ui.clearBusy()))
        .subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }
//#endregion Export Excel

    
    
}
