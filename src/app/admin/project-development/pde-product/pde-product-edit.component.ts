import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { PO_PRODUCT_ENTITY, UltilityServiceProxy, AsposeServiceProxy, PO_GROUP_PRODUCT_ENTITY, ReportInfo, PDEProductServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { NgForm } from '@angular/forms';
import { ReportTypeConsts } from '@app/admin/core/ultils/consts/ReportTypeConsts';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { ToolbarComponent } from '@app/admin/core/controls/toolbar/toolbar.component';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { PDEProductHardwareEdittableComponent } from './pde-hardwarevt-edittable.component';
import { PDEProductHardwareDGEdittableComponent } from './pde-hardwaredg-edittable.component';
import { PDERequestCustomerAttachFileComponent } from './pde-request-customer-attach-file.component';
import { PDETechDrawFromCusAttachFileComponent } from './pde-tech-draw-from-cus-attach-file.component';
import { PDETechDrawAttachFileComponent } from './pde-tech-draw-attach-file.component';
import { WebConsts } from '@app/ultilities/enum/consts';

@Component({
    templateUrl: './pde-product-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PDEProductEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<PO_PRODUCT_ENTITY> {
//#region "Constructor"
    constructor(
        injector: Injector,
        private ultilityService: UltilityServiceProxy,
        private pdeProductService: PDEProductServiceProxy,
		private asposeService: AsposeServiceProxy,
		private fileDownloadService: FileDownloadService,
    ) {
        super(injector);

        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.producT_ID = this.getRouteParam('id');
        this.initFilter();
        this.initIsApproveFunct();
    }
    isApproveFunct: boolean;
    initIsApproveFunct(): void {
        this.ultilityService.isApproveFunct(this.getCurrentFunctionId()).subscribe((res) => {
			this.isApproveFunct = res;
		});
    }
    EditPageState = EditPageState;
    editPageState: EditPageState;
    @ViewChild('editForm') editForm: NgForm;

    // Begin Change when clone component
    inputModel: PO_PRODUCT_ENTITY = new PO_PRODUCT_ENTITY();
    filterInput: PO_PRODUCT_ENTITY;

    get disableInput(): boolean {
        return this.editPageState == EditPageState.viewDetail || this.inputModel.autH_STATUS == 'A';
    }
    get apptoolbar(): ToolbarComponent {
        return this.appToolbar as ToolbarComponent;
    }
    // End Change when clone component

//#endregion "Constructor"

    ngOnInit(): void {

        switch (this.editPageState) {
            case EditPageState.add:
                this.appToolbar.setRole('PDEProduct', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('PDEProduct', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPage();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('PDEProduct', false, false, false, false, false, false, true, false);
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
        this.navigatePassParam('/app/admin/pde-product', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPage() {
        this.pdeProductService.pO_Product_ById(this.inputModel.producT_ID).subscribe(response => {
            if (!response) this.goBack()
            this.inputModel = response;

            if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
                this.appToolbar.setButtonApproveEnable(false);
                this.appToolbar.setButtonSaveEnable(true);
            }

            this.setDataEditTables();

            this.onChaneNumber();

            this.updateView();
        });
    }

    onSave(): void {
        abp.ui.setBusy();
        this.inputModel.makeR_ID = this.appSession.user.userName;
        this.saveInput();
    }

    saveInput() {
        if (this.isApproveFunct == undefined) {
            this.showErrorMessage(this.l('PageLoadUndone'));
			this.updateView();
			return;
		}

        this.getDataEditTables();

        if(this.editPageState != EditPageState.viewDetail) {
            if(!this.inputModel.producT_ID) {
                this.onAdd();
            } else {
                this.onUpdate();
            }
        } 
    }

    onAdd(): void {
        this.pdeProductService
        .pO_Product_Ins(this.inputModel)
        .pipe(
            finalize(() => {
                abp.ui.clearBusy();
            })
        )
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc'])
            } else {
                this.inputModel.producT_ID = res['ID'];
                this.showSuccessMessage(res['ErrorDesc']);
            }
            this.updateView();
        })
    }

    onUpdate(): void {
        this.updateView();
        this.pdeProductService
			.pO_Product_Upd(this.inputModel)
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
					this.updateSuccess();
                    this.getDataPage();
                    this.updateView();
				}
			});
    }

    onApprove(item: PO_PRODUCT_ENTITY): void {
        this.inputModel.checkeR_ID = this.appSession.user.userName;
    }

    importFilterInput: PO_GROUP_PRODUCT_ENTITY = new PO_GROUP_PRODUCT_ENTITY();
    xlsStructure = [
        'producT_CODE',
        'producT_NAME',
        'notes',
	];
    onImportExcel(rows: any) {
        abp.ui.setBusy();
        let excelArr = this.xlsRowsToArr(rows, this.xlsStructure, function (obj: PO_PRODUCT_ENTITY) {
            return obj;
        })
		if (!excelArr) {
			abp.ui.clearBusy();
			return;
		}
        // phần gán data gửi về BE
		this.importFilterInput.pO_PRODUCTs = excelArr.map(this.excelMapping);
        this.importFilterInput.makeR_ID = this.appSession.user.userName;

		if (excelArr && excelArr.length) {
			this.pdeProductService
				.pO_PRODUCT_IMPORT_Data(this.importFilterInput)
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
        reportInfo.pathName = '/PO_MASTER/FileImport_Product.xlsx';
		reportInfo.storeName = 'PO_PRODUCT_ById';

        let reportFilter = { PRODUCT_ID: this.inputModel.producT_NAME};
        reportInfo.parameters = this.GetParamsFromFilter(reportFilter)

		this.asposeService
        .getReportFromTable(reportInfo)
        .pipe( finalize(() => { abp.ui.clearBusy();}))
        .subscribe((res) => {
			this.fileDownloadService.downloadTempFile(res);
		});
	}

    onChaneNumber(){
        this.inputModel.producT_SPECIFI_LENGTH_INCH = this.inputModel.producT_SPECIFI_LENGTH*WebConsts.MmToInch;
        this.inputModel.producT_SPECIFI_WIDTH_INCH = this.inputModel.producT_SPECIFI_WIDTH*WebConsts.MmToInch;
        this.inputModel.producT_SPECIFI_HEIGHT_INCH = this.inputModel.producT_SPECIFI_HEIGHT*WebConsts.MmToInch;

        this.inputModel.cartoN_SPECIFI_LENGTH_INCH = this.inputModel.cartoN_SPECIFI_LENGTH*WebConsts.MmToInch;
        this.inputModel.cartoN_SPECIFI_WIDTH_INCH = this.inputModel.cartoN_SPECIFI_WIDTH*WebConsts.MmToInch;
        this.inputModel.cartoN_SPECIFI_HEIGHT_INCH = this.inputModel.cartoN_SPECIFI_HEIGHT*WebConsts.MmToInch;

        this.updateView();
    }

//#region "EditTable"
    getDataEditTables(){
        // Danh sách vật tư hardware
        this.inputModel.pO_PRODUCT_HARDWAREVTs = this.pdeHardwareVTEdittable.editTable.allData;
        // Danh sách vật tư đóng gói
        this.inputModel.pO_PRODUCT_HARDWAREDGs = this.pdeHardwareDGEdittable.editTable.allData;
        // Thông tin yêu cầu từ khách cho từng sản phẩm
        this.inputModel.pdE_ATTACH_FILE_CUSTOMER_REQUESTs = this.pdeRequestCustomerAttachFileEdittable.editTable.allData;
        // Bản vẽ kỹ thuật và thông tin yêu cầu từ khách
        this.inputModel.pdE_ATTACH_FILE_TECH_DRAW_FROM_CUSs = this.pdeTechDrawFromCusAttachFileEdittable.editTable.allData;
        // Bản vẽ kỹ thuật dũng khanh
        this.inputModel.pdE_ATTACH_FILE_TECH_DRAWs = this.pdeTechDrawAttachFileEdittable.editTable.allData;
    }
    setDataEditTables(){
        // Danh sách vật tư hardware
        if (this.inputModel.pO_PRODUCT_HARDWAREVTs && this.inputModel.pO_PRODUCT_HARDWAREVTs.length > 0) {
            this.pdeHardwareVTEdittable.editTable.setList(this.inputModel.pO_PRODUCT_HARDWAREVTs);
            this.pdeHardwareVTEdittable.refreshTable();
        }
        // Danh sách vật tư đóng gói
        if (this.inputModel.pO_PRODUCT_HARDWAREDGs && this.inputModel.pO_PRODUCT_HARDWAREDGs.length > 0) {
            this.pdeHardwareDGEdittable.editTable.setList(this.inputModel.pO_PRODUCT_HARDWAREDGs);
            this.pdeHardwareDGEdittable.refreshTable();
        }
        // Thông tin yêu cầu từ khách cho từng sản phẩm
        if (this.inputModel.pdE_ATTACH_FILE_CUSTOMER_REQUESTs && this.inputModel.pdE_ATTACH_FILE_CUSTOMER_REQUESTs.length > 0) {
            this.pdeRequestCustomerAttachFileEdittable.editTable.setList(this.inputModel.pdE_ATTACH_FILE_CUSTOMER_REQUESTs);
            this.pdeRequestCustomerAttachFileEdittable.refreshTable();
        }
        // Bản vẽ kỹ thuật và thông tin yêu cầu từ khách
        if (this.inputModel.pdE_ATTACH_FILE_TECH_DRAW_FROM_CUSs && this.inputModel.pdE_ATTACH_FILE_TECH_DRAW_FROM_CUSs.length > 0) {
            this.pdeTechDrawFromCusAttachFileEdittable.editTable.setList(this.inputModel.pdE_ATTACH_FILE_TECH_DRAW_FROM_CUSs);
            this.pdeTechDrawFromCusAttachFileEdittable.refreshTable();
        }
        // Bản vẽ kỹ thuật dũng khanh
        if (this.inputModel.pdE_ATTACH_FILE_TECH_DRAWs && this.inputModel.pdE_ATTACH_FILE_TECH_DRAWs.length > 0) {
            this.pdeTechDrawAttachFileEdittable.editTable.setList(this.inputModel.pdE_ATTACH_FILE_TECH_DRAWs);
            this.pdeTechDrawAttachFileEdittable.refreshTable();
        }
    }
    
    // Danh sách vật tư hardware
    @ViewChild('pdeHardwareVTEdittable') pdeHardwareVTEdittable: PDEProductHardwareEdittableComponent;
    // Danh sách vật tư đóng gói
    @ViewChild('pdeHardwareDGEdittable') pdeHardwareDGEdittable: PDEProductHardwareDGEdittableComponent;
    // Thông tin yêu cầu từ khách cho từng sản phẩm
    @ViewChild('pdeRequestCustomerAttachFileEdittable') pdeRequestCustomerAttachFileEdittable: PDERequestCustomerAttachFileComponent;
    // Bản vẽ kỹ thuật và thông tin yêu cầu từ khách
    @ViewChild('pdeTechDrawFromCusAttachFileEdittable') pdeTechDrawFromCusAttachFileEdittable: PDETechDrawFromCusAttachFileComponent;
    // Bản vẽ kỹ thuật dũng khanh
    @ViewChild('pdeTechDrawAttachFileEdittable') pdeTechDrawAttachFileEdittable: PDETechDrawAttachFileComponent;
    
//#endregion "EditTable"
    
}
