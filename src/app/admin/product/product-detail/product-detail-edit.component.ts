import { Component, Injector, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AsposeServiceProxy, ReportInfo, PRODUCT_DETAIL_ENTITY, SupplierServiceProxy, ProductDetailServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { ReportTypeConsts } from '@app/admin/core/ultils/consts/ReportTypeConsts';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { ToolbarComponent } from '@app/admin/core/controls/toolbar/toolbar.component';
import { ProductProductDetailMaterialEdittableComponent } from './edittable/product-product-detail-material-edittable.component';

@Component({
    templateUrl: './product-detail-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ProductDetailEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<PRODUCT_DETAIL_ENTITY> {
//#region constructor
    constructor(
        injector: Injector,
        private asposeService: AsposeServiceProxy,
        private fileDownloadService: FileDownloadService,
        private productDetailService: ProductDetailServiceProxy
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.producT_DETAIL_ID = this.getRouteParam('id');
    }

    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: PRODUCT_DETAIL_ENTITY = new PRODUCT_DETAIL_ENTITY();
    filterInput: PRODUCT_DETAIL_ENTITY;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.appToolbar.setRole('ProductDetail', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('ProductDetail', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('ProductDetail', false, false, false, false, false, false, true, false);
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
        this.navigatePassParam('/app/admin/product-detail', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.productDetailService.pRODUCT_DETAIL_ById(this.inputModel.producT_DETAIL_ID).subscribe(response => {
            // set data
            if (!response) this.goBack()
            this.inputModel = response;

            this.setDataEditTables();

            this.onChangeProp();

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
            if(!this.inputModel.producT_DETAIL_ID) {
                this.onAdd();
            } else {
                this.onUpdate();
            }
        } 
    }

    onAdd(): void {
        this.saving = true;
        this.productDetailService
        .pRODUCT_DETAIL_Ins(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.inputModel.producT_DETAIL_ID = res['ID'];
                this.showSuccessMessage(res['ErrorDesc']);
                this.getDataPages();
                this.updateView();
            }
        })
    }

    onUpdate(): void {
        this.saving = true;
        this.productDetailService
        .pRODUCT_DETAIL_Upd(this.inputModel)
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

    onApprove(item: PRODUCT_DETAIL_ENTITY): void{
        this.message.confirm(
            this.l('ApproveWarningMessage', (this.inputModel.producT_DETAIL_CODE)),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.productDetailService
                    .pRODUCT_DETAIL_App(this.inputModel.producT_DETAIL_ID, this.appSession.user.userName)
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
        // Vật tư
        this.inputModel.producT_DETAIL_MATERIALs = this.productProductDetailMaterialEdittable.editTable.allData;
    }
    setDataEditTables(){
        // // Vật tư
        if (this.inputModel.producT_DETAIL_MATERIALs && this.inputModel.producT_DETAIL_MATERIALs.length > 0) {
            this.productProductDetailMaterialEdittable.editTable.setList(this.inputModel.producT_DETAIL_MATERIALs);
            this.productProductDetailMaterialEdittable.refreshTable();
        }
    }
    
    // Vật tư
    @ViewChild('productProductDetailMaterialEdittable') productProductDetailMaterialEdittable: ProductProductDetailMaterialEdittableComponent;
    
//#endregion "EditTable"

//#region Import excel
    /*
    importFilterInput: PRODUCT_DETAIL_ENTITY[] = [];
    xlsStructure = [
        'producT_DETAIL_CODE',
        'suP_NAME',
        'addr',
        'contacT_PERSON',
        'tel',
        'email',
        'notes'
	];
    onImportExcel(rows: any) {
        abp.ui.setBusy();
        let excelArr = this.xlsRowsToArr(rows, this.xlsStructure, function (obj: PRODUCT_DETAIL_ENTITY) {
            return obj;
        })
		if (!excelArr) {
			abp.ui.clearBusy();
			return;
		}
        // phần gán data gửi về BE
		this.importFilterInput = excelArr.map(this.excelMapping);

		if (excelArr && excelArr.length) {
			this.productDetailService
				.pRODUCT_DETAIL_IMPORT_Data(this.appSession.user.userName, this.importFilterInput)
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

//#region Status Page
    setViewToolBar(){
        // Button lưu
        if(this.editPageState == EditPageState.viewDetail){
            this.appToolbar.setButtonSaveEnable(false);
        }
        else{
            if(this.inputModel.producT_DETAIL_ID != AuthStatusConsts.Approve){
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

    onChangeProp(){

        if(this.inputModel.producT_DETAIL_TYPE == 'mdf' || this.inputModel.producT_DETAIL_TYPE == 'hdf'){
            this.inputModel.m3_WOOD = 0;
            this.inputModel.m3_MDF = (this.inputModel.length*this.inputModel.width*this.inputModel.height)/1000000000;
            this.inputModel.m3_PLANK = 0;
        }
        else if(this.inputModel.producT_DETAIL_TYPE == 'ply' || this.inputModel.producT_DETAIL_TYPE == 'pb'){
            this.inputModel.m3_WOOD = 0;
            this.inputModel.m3_MDF = 0;
            this.inputModel.m3_PLANK = (this.inputModel.length*this.inputModel.width*this.inputModel.height)/1000000000;
        }
        else{
            this.inputModel.m3_WOOD = (this.inputModel.length*this.inputModel.width*this.inputModel.height)/1000000000;
            this.inputModel.m3_MDF = 0;
            this.inputModel.m3_PLANK = 0;
        }

        this.inputModel.veneeR_11 = 0;
        this.inputModel.veneeR_12 = 0;
        this.inputModel.veneeR_21 = 0;
        this.inputModel.veneeR_22 = 0;
        this.inputModel.veneeR_31 = 0;
        this.inputModel.veneeR_32 = 0;
        this.inputModel.veneeR_41 = 0;
        this.inputModel.veneeR_42 = 0;
        this.inputModel.painT_11 = 0;
        this.inputModel.painT_12 = 0;
        this.inputModel.painT_21 = 0;
        this.inputModel.painT_22 = 0;
        this.inputModel.painT_31 = 0;
        this.inputModel.painT_32 = 0;

        if(this.inputModel.veneeR_SPECIFI == '8M-2C-2P-2CN-2CD'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_12 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_21 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_22 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.veneeR_31 = (this.inputModel.width*this.inputModel.height)/1000000;
            this.inputModel.veneeR_32 = (this.inputModel.width*this.inputModel.height)/1000000;

            this.inputModel.veneeR_41 = (this.inputModel.length*this.inputModel.height)/1000000;
            this.inputModel.veneeR_42 = (this.inputModel.length*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '7M-2C-2P-2CN-1CD'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_12 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_21 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_22 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.veneeR_31 = (this.inputModel.width*this.inputModel.height)/1000000;
            this.inputModel.veneeR_32 = (this.inputModel.width*this.inputModel.height)/1000000;

            this.inputModel.veneeR_41 = (this.inputModel.length*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '7M-1C-2P-2CN-2CD'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_21 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_22 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.veneeR_31 = (this.inputModel.width*this.inputModel.height)/1000000;
            this.inputModel.veneeR_32 = (this.inputModel.width*this.inputModel.height)/1000000;

            this.inputModel.veneeR_41 = (this.inputModel.length*this.inputModel.height)/1000000;
            this.inputModel.veneeR_42 = (this.inputModel.length*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '7M-2C-1P-2CN-2CD'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_12 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_21 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.veneeR_31 = (this.inputModel.width*this.inputModel.height)/1000000;
            this.inputModel.veneeR_32 = (this.inputModel.width*this.inputModel.height)/1000000;

            this.inputModel.veneeR_41 = (this.inputModel.length*this.inputModel.height)/1000000;
            this.inputModel.veneeR_42 = (this.inputModel.length*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '7M-2C-2P-1CN-2CD'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_12 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_21 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_22 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.veneeR_31 = (this.inputModel.width*this.inputModel.height)/1000000;

            this.inputModel.veneeR_41 = (this.inputModel.length*this.inputModel.height)/1000000;
            this.inputModel.veneeR_42 = (this.inputModel.length*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '6M-2C-2P-2CN'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_12 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_21 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_22 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.veneeR_31 = (this.inputModel.width*this.inputModel.height)/1000000;
            this.inputModel.veneeR_32 = (this.inputModel.width*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '6M-2C-2P-2CD'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_12 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_21 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_22 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.veneeR_41 = (this.inputModel.length*this.inputModel.height)/1000000;
            this.inputModel.veneeR_42 = (this.inputModel.length*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '6M-1C-2P-2CN-1CD'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_21 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_22 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.veneeR_31 = (this.inputModel.width*this.inputModel.height)/1000000;
            this.inputModel.veneeR_32 = (this.inputModel.width*this.inputModel.height)/1000000;

            this.inputModel.veneeR_41 = (this.inputModel.length*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '6M-1C-2P-1CN-2CD'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_21 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_22 = (this.inputModel.width*this.inputModel.length)/1000000;
            
            this.inputModel.veneeR_31 = (this.inputModel.width*this.inputModel.height)/1000000;

            this.inputModel.veneeR_41 = (this.inputModel.length*this.inputModel.height)/1000000;
            this.inputModel.veneeR_42 = (this.inputModel.length*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '6M-2C-1P-1CN-2CD'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_12 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_21 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.veneeR_31 = (this.inputModel.width*this.inputModel.height)/1000000;

            this.inputModel.veneeR_41 = (this.inputModel.length*this.inputModel.height)/1000000;
            this.inputModel.veneeR_42 = (this.inputModel.length*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '6M-2C-1P-2CN-1CD'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_12 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_21 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.veneeR_31 = (this.inputModel.width*this.inputModel.height)/1000000;
            this.inputModel.veneeR_32 = (this.inputModel.width*this.inputModel.height)/1000000;

            this.inputModel.veneeR_41 = (this.inputModel.length*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '5M-2C-2P-1CN'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_12 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_21 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_22 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.veneeR_31 = (this.inputModel.width*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '5M-2C-2P-1CD'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_12 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_21 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_22 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.veneeR_41 = (this.inputModel.length*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '5M-1C-1P-2CN-1CD'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_21 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.veneeR_31 = (this.inputModel.width*this.inputModel.height)/1000000;
            this.inputModel.veneeR_32 = (this.inputModel.width*this.inputModel.height)/1000000;

            this.inputModel.veneeR_41 = (this.inputModel.length*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '5M-1C-1P-1CN-2CD'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_21 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.veneeR_31 = (this.inputModel.width*this.inputModel.height)/1000000;

            this.inputModel.veneeR_41 = (this.inputModel.length*this.inputModel.height)/1000000;
            this.inputModel.veneeR_42 = (this.inputModel.length*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '5M-1C-2CN-2CD'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.veneeR_31 = (this.inputModel.width*this.inputModel.height)/1000000;
            this.inputModel.veneeR_32 = (this.inputModel.width*this.inputModel.height)/1000000;

            this.inputModel.veneeR_41 = (this.inputModel.length*this.inputModel.height)/1000000;
            this.inputModel.veneeR_42 = (this.inputModel.length*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '4M-2C-2P'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_12 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_21 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_22 = (this.inputModel.width*this.inputModel.length)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '4M-1C-1P-2CN'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_21 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.veneeR_31 = (this.inputModel.width*this.inputModel.height)/1000000;
            this.inputModel.veneeR_32 = (this.inputModel.width*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '4M-1C-1P-2CD'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_21 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.veneeR_41 = (this.inputModel.length*this.inputModel.height)/1000000;
            this.inputModel.veneeR_42 = (this.inputModel.length*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '4M-1C-1P-1CN-1CD'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_21 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.veneeR_31 = (this.inputModel.width*this.inputModel.height)/1000000;

            this.inputModel.veneeR_41 = (this.inputModel.length*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '3M-2C-1P'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_12 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_21 = (this.inputModel.width*this.inputModel.length)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '3M-1C-2P'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_21 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_22 = (this.inputModel.width*this.inputModel.length)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '3M-1C-1P-1CN'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_21 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.veneeR_31 = (this.inputModel.width*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '3M-1C-1P-1CD'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_21 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.veneeR_41 = (this.inputModel.length*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '2M-2C'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_12 = (this.inputModel.width*this.inputModel.length)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '2M-2P'){
            this.inputModel.veneeR_21 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_22 = (this.inputModel.width*this.inputModel.length)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '2M-1C-1P'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
            this.inputModel.veneeR_21 = (this.inputModel.width*this.inputModel.length)/1000000;
        }
        else if(this.inputModel.veneeR_SPECIFI == '1M-1C'){
            this.inputModel.veneeR_11 = (this.inputModel.width*this.inputModel.length)/1000000;
        }

        if(this.inputModel.painT_SPECIFI == '6M-1C-1P-2CN-2CD'){
            this.inputModel.painT_11 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.painT_12 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.painT_31 = (this.inputModel.width*this.inputModel.height)/1000000;
            this.inputModel.painT_32 = (this.inputModel.width*this.inputModel.height)/1000000;

            this.inputModel.painT_21 = (this.inputModel.length*this.inputModel.height)/1000000;
            this.inputModel.painT_22 = (this.inputModel.length*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.painT_SPECIFI == '5M-1C-1P-2CN-1CD'){
            this.inputModel.painT_11 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.painT_12 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.painT_31 = (this.inputModel.width*this.inputModel.height)/1000000;
            this.inputModel.painT_32 = (this.inputModel.width*this.inputModel.height)/1000000;

            this.inputModel.painT_21 = (this.inputModel.length*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.painT_SPECIFI == '5M-1C-1P-1CN-2CD'){
            this.inputModel.painT_11 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.painT_12 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.painT_31 = (this.inputModel.width*this.inputModel.height)/1000000;

            this.inputModel.painT_21 = (this.inputModel.length*this.inputModel.height)/1000000;
            this.inputModel.painT_22 = (this.inputModel.length*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.painT_SPECIFI == '4M-1C-1P-2CN'){
            this.inputModel.painT_11 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.painT_12 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.painT_31 = (this.inputModel.width*this.inputModel.height)/1000000;
            this.inputModel.painT_32 = (this.inputModel.width*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.painT_SPECIFI == '4M-1C-1P-2CD'){
            this.inputModel.painT_11 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.painT_12 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.painT_21 = (this.inputModel.length*this.inputModel.height)/1000000;
            this.inputModel.painT_22 = (this.inputModel.length*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.painT_SPECIFI == '3M-1C-1P-1CN'){
            this.inputModel.painT_11 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.painT_12 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.painT_31 = (this.inputModel.width*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.painT_SPECIFI == '3M-1C-1P-1CD'){
            this.inputModel.painT_11 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.painT_12 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.painT_21 = (this.inputModel.length*this.inputModel.height)/1000000;
        }
        else if(this.inputModel.painT_SPECIFI == '2M-1C-1P'){
            this.inputModel.painT_11 = (this.inputModel.width*this.inputModel.length)/1000000;

            this.inputModel.painT_12 = (this.inputModel.width*this.inputModel.length)/1000000;
        }
        else if(this.inputModel.painT_SPECIFI == '1M-1C'){
            this.inputModel.painT_11 = (this.inputModel.width*this.inputModel.length)/1000000;
        }
        else if(this.inputModel.painT_SPECIFI == '1M-1P'){
            this.inputModel.painT_12 = (this.inputModel.width*this.inputModel.length)/1000000;
        }

        this.updateView();
    }

}
