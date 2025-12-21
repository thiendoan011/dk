import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { UltilityServiceProxy, AsposeServiceProxy, ReportInfo, PoHardwareDGServiceProxy, PO_HARDWAREDG_ENTITY, PO_PRODUCT_ENTITY } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { NgForm } from '@angular/forms';
import { ReportTypeConsts } from '@app/admin/core/ultils/consts/ReportTypeConsts';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { ToolbarComponent } from '@app/admin/core/controls/toolbar/toolbar.component';

@Component({
    templateUrl: './po-hardwareDG-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PoHardwareDGEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<PO_HARDWAREDG_ENTITY> {
//#region "Constructor"
    constructor(
        injector: Injector,
        private ultilityService: UltilityServiceProxy,
        private poHardwareDGService: PoHardwareDGServiceProxy,
        private asposeService: AsposeServiceProxy,
        private fileDownloadService: FileDownloadService,
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.hardwaredG_ID = this.getRouteParam('id');
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
    inputModel: PO_HARDWAREDG_ENTITY = new PO_HARDWAREDG_ENTITY();
    filterInput: PO_HARDWAREDG_ENTITY;
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
                this.appToolbar.setRole('PoHardwareDG', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('PoHardwareDG', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('PoHardwareDG', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getDataPages();
                break;
        }
        this.appToolbar.setUiActionEdit(this);
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    goBack() {
        this.navigatePassParam('/app/admin/po-hardwareDG', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.poHardwareDGService.pO_HARDWAREDG_ById(this.inputModel.hardwaredG_ID).subscribe(response => {
            if (!response) this.goBack()
            this.inputModel = response;

            if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
                this.appToolbar.setButtonApproveEnable(false);
                this.appToolbar.setButtonSaveEnable(true);
            }

            // CM_ATTACH_FILE
			this.getFile(this.inputModel.hardwaredG_ID, this.inputModel);

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

        //this.getEditTablesData();

        if(this.editPageState != EditPageState.viewDetail) {
            if(!this.inputModel.hardwaredG_ID) {
                this.onAdd();
            } else {
                this.onUpdate();
            }
        } 
    }

    onAdd(): void {
        this.poHardwareDGService
        .pO_HARDWAREDG_Ins(this.inputModel)
        .pipe(
            finalize(() => {
                abp.ui.clearBusy();
            })
        )
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc'])
            } else {
                this.showSuccessMessage(res['ErrorDesc']);
                this.inputModel.hardwaredG_ID = res['ID'];
                // CM_ATTACH_FILE
                this.addFile(this.inputModel, 'po-hardwareDG', undefined, res['ID']);
                this.getDataPages();
                this.updateView();
            }
            this.updateView();
        })
    }

    onUpdate(): void {
        this.poHardwareDGService
			.pO_HARDWAREDG_Upd(this.inputModel)
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
                    // CM_ATTACH_FILE
					this.updateFile(this.inputModel, 'po-hardwareDG', undefined, this.inputModel.hardwaredG_ID);
                    this.getDataPages();
                    this.updateView();
				}
			});
    }

    onApprove(item: PO_HARDWAREDG_ENTITY): void{
        this.inputModel.checkeR_ID = this.appSession.user.userName;

    }

    importFilterInput: PO_PRODUCT_ENTITY = new PO_PRODUCT_ENTITY();
    xlsStructure = [
        'hardwaredG_CODE',
        'hardwaredG_NAME',
        'height',
        'widtH1',
        'widtH2',
        'length',
        'unit',
        'color',
        'quantify',
        'notes'
	];
    onImportExcel(rows: any) {
        abp.ui.setBusy();
        let excelArr = this.xlsRowsToArr(rows, this.xlsStructure, function (obj: PO_HARDWAREDG_ENTITY) {
            return obj;
        })
		if (!excelArr) {
			abp.ui.clearBusy();
			return;
		}
        // phần gán data gửi về BE
		this.importFilterInput.pO_PRODUCT_HARDWAREDGs = excelArr.map(this.excelMapping);

		if (excelArr && excelArr.length) {
			this.poHardwareDGService
				.pO_HARDWAREDG_IMPORT_Data(this.appSession.user.userName, this.importFilterInput)
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
        reportInfo.pathName = '/PO_MASTER/FileImport_HardwareDG.xlsx';
		reportInfo.storeName = 'PO_HARDWAREDG_ById';
		this.asposeService
        .getReportFromTable(reportInfo)
        .pipe( finalize(() => { abp.ui.clearBusy();}))
        .subscribe((res) => {
            this.fileDownloadService.downloadTempFile(res);
		});
	}
    
}
