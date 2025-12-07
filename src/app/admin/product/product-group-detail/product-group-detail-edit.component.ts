import { Component, Injector, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AsposeServiceProxy, ReportInfo, PRODUCT_GROUP_DETAIL_ENTITY, SupplierServiceProxy, ProductGroupDetailServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { ReportTypeConsts } from '@app/admin/core/ultils/consts/ReportTypeConsts';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { ToolbarComponent } from '@app/admin/core/controls/toolbar/toolbar.component';
import { ProductGroupDetailProductDetailEdittableComponent } from './product-detail-edittable.component';

@Component({
    templateUrl: './product-group-detail-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ProductGroupDetailEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<PRODUCT_GROUP_DETAIL_ENTITY> {
//#region constructor
    constructor(
        injector: Injector,
        private asposeService: AsposeServiceProxy,
        private fileDownloadService: FileDownloadService,
        private productGroupDetailService: ProductGroupDetailServiceProxy
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.producT_GROUP_DETAIL_ID = this.getRouteParam('id');
    }

    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: PRODUCT_GROUP_DETAIL_ENTITY = new PRODUCT_GROUP_DETAIL_ENTITY();
    filterInput: PRODUCT_GROUP_DETAIL_ENTITY;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.appToolbar.setRole('ProductGroupDetail', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('ProductGroupDetail', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('ProductGroupDetail', false, false, false, false, false, false, true, false);
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
        this.navigatePassParam('/app/admin/product-group-detail', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.productGroupDetailService.pRODUCT_GROUP_DETAIL_ById(this.inputModel.producT_GROUP_DETAIL_ID).subscribe(response => {
            // set data
            if (!response) this.goBack()
            this.inputModel = response;

            // set data editTable
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
            if(!this.inputModel.producT_GROUP_DETAIL_ID) {
                this.onAdd();
            } else {
                this.onUpdate();
            }
        } 
    }

    onAdd(): void {
        this.saving = true;
        this.productGroupDetailService
        .pRODUCT_GROUP_DETAIL_Ins(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.inputModel.producT_GROUP_DETAIL_ID = res['ID'];
                this.showSuccessMessage(res['ErrorDesc']);
                this.getDataPages();
                this.updateView();
            }
        })
    }

    onUpdate(): void {
        this.saving = true;
        this.productGroupDetailService
        .pRODUCT_GROUP_DETAIL_Upd(this.inputModel)
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

    onApprove(item: PRODUCT_GROUP_DETAIL_ENTITY): void{
        this.message.confirm(
            this.l('ApproveWarningMessage', (this.inputModel.producT_GROUP_DETAIL_CODE)),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.productGroupDetailService
                    .pRODUCT_GROUP_DETAIL_App(this.inputModel.producT_GROUP_DETAIL_ID, this.appSession.user.userName)
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
    /*
    importFilterInput: PRODUCT_GROUP_DETAIL_ENTITY[] = [];
    xlsStructure = [
        'producT_GROUP_DETAIL_CODE',
        'suP_NAME',
        'addr',
        'contacT_PERSON',
        'tel',
        'email',
        'notes'
	];
    onImportExcel(rows: any) {
        abp.ui.setBusy();
        let excelArr = this.xlsRowsToArr(rows, this.xlsStructure, function (obj: PRODUCT_GROUP_DETAIL_ENTITY) {
            return obj;
        })
		if (!excelArr) {
			abp.ui.clearBusy();
			return;
		}
        // phần gán data gửi về BE
		this.importFilterInput = excelArr.map(this.excelMapping);

		if (excelArr && excelArr.length) {
			this.productGroupDetailService
				.pRODUCT_GROUP_DETAIL_IMPORT_Data(this.appSession.user.userName, this.importFilterInput)
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
    */
//#endregion Import excel

//#region "EditTable"
    getDataEditTables(){
        // Thông tin báo giá cho khách
        this.inputModel.producT_DETAILs = this.productDetailEditTable.editTable.allData;
    }
    setDataEditTables(){
        // Thông tin báo giá cho khách
        if (this.inputModel.producT_DETAILs && this.inputModel.producT_DETAILs.length > 0) {
            this.productDetailEditTable.editTable.setList(this.inputModel.producT_DETAILs);
            this.productDetailEditTable.refreshTable();
        }
    }

    // Thông tin báo giá cho khách
    @ViewChild('productDetailEditTable') productDetailEditTable: ProductGroupDetailProductDetailEdittableComponent;

//#endregion "EditTable"

//#region Status Page
    setViewToolBar(){
        // Button lưu
        if(this.editPageState == EditPageState.viewDetail){
            this.appToolbar.setButtonSaveEnable(false);
        }
        else{
            if(this.inputModel.producT_GROUP_DETAIL_ID != AuthStatusConsts.Approve){
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
