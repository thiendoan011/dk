import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { PO_PRODUCT_ENTITY, PoProductServiceProxy, UltilityServiceProxy, AsposeServiceProxy, PO_GROUP_PRODUCT_ENTITY, ReportInfo } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { NgForm } from '@angular/forms';
import { ReportTypeConsts } from '@app/admin/core/ultils/consts/ReportTypeConsts';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { ToolbarComponent } from '@app/admin/core/controls/toolbar/toolbar.component';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';

@Component({
    templateUrl: './po-product-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PoProductEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<PO_PRODUCT_ENTITY> {
//#region "Constructor"
    constructor(
        injector: Injector,
        private ultilityService: UltilityServiceProxy,
        private poProductService: PoProductServiceProxy,
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
                this.appToolbar.setRole('PoProduct', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('PoProduct', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPage();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('PoProduct', false, false, false, false, false, false, true, false);
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
        this.navigatePassParam('/app/admin/po-product', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPage() {
        this.poProductService.pO_Product_ById(this.inputModel.producT_ID).subscribe(response => {
            if (!response) this.goBack()
            this.inputModel = response;

            if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
                this.appToolbar.setButtonApproveEnable(false);
                this.appToolbar.setButtonSaveEnable(true);
            }

            this.setDataEditTables();

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
        this.poProductService
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
        this.poProductService
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
			this.poProductService
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
		this.asposeService
        .getReportFromTable(reportInfo)
        .pipe( finalize(() => { abp.ui.clearBusy();}))
        .subscribe((res) => {
			this.fileDownloadService.downloadTempFile(res);
		});
	}

//#region "EditTable"
    getDataEditTables(){
    }
    setDataEditTables(){
    }
    
//#endregion "EditTable"
    
}
