import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { UltilityServiceProxy, AsposeServiceProxy, ReportInfo, PoHardwareVTServiceProxy, PO_HARDWAREVT_ENTITY, PO_IMAGE_ENTITY, PO_PRODUCT_ENTITY } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { NgForm } from '@angular/forms';
import { ReportTypeConsts } from '@app/admin/core/ultils/consts/ReportTypeConsts';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { ToolbarComponent } from '@app/admin/core/controls/toolbar/toolbar.component';
import { AppConsts } from '@shared/AppConsts';
import { POImageModalComponent } from '@app/admin/core/modal/module-po/po-image-modal/po-image-modal.component';

@Component({
    templateUrl: './po-hardwareVT-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PoHardwareVTEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<PO_HARDWAREVT_ENTITY> {
//#region "Constructor"
    constructor(
        injector: Injector,
        private ultilityService: UltilityServiceProxy,
        private poHardwareVTService: PoHardwareVTServiceProxy,
        private asposeService: AsposeServiceProxy,
        private fileDownloadService: FileDownloadService,
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.hardwarevT_ID = this.getRouteParam('id');
        this.initIsApproveFunct();
        this.remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;
    }
    
    remoteServiceBaseUrl: string;

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
    inputModel: PO_HARDWAREVT_ENTITY = new PO_HARDWAREVT_ENTITY();
    filterInput: PO_HARDWAREVT_ENTITY;
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
                this.appToolbar.setRole('PoHardwareVT', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('PoHardwareVT', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('PoHardwareVT', false, false, false, false, false, false, true, false);
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
        this.navigatePassParam('/app/admin/po-hardwareVT', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.poHardwareVTService.pO_HARDWAREVT_ById(this.inputModel.hardwarevT_ID).subscribe(response => {
            if (!response) this.goBack()
            this.inputModel = response;

            if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
                this.appToolbar.setButtonApproveEnable(false);
                this.appToolbar.setButtonSaveEnable(true);
            }

            // CM_ATTACH_FILE
			this.getFile(this.inputModel.hardwarevT_ID, this.inputModel);

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
            if(!this.inputModel.hardwarevT_ID) {
                this.onAdd();
            } else {
                this.onUpdate();
            }
        } 
    }

    onAdd(): void {
        this.poHardwareVTService
        .pO_HARDWAREVT_Ins(this.inputModel)
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
                this.inputModel.hardwarevT_ID = res['ID'];
                // CM_ATTACH_FILE
                this.addFile(this.inputModel, 'po-hardwareVT', undefined, res['ID']);
                this.getDataPages();
                this.updateView();
            }
            this.updateView();
        })
    }

    onUpdate(): void {
        this.poHardwareVTService
			.pO_HARDWAREVT_Upd(this.inputModel)
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
					this.updateFile(this.inputModel, 'po-hardwareVT', undefined, this.inputModel.hardwarevT_ID);
                    this.getDataPages();
                    this.updateView();
				}
			});
    }

    onApprove(item: PO_HARDWAREVT_ENTITY): void{
        this.inputModel.checkeR_ID = this.appSession.user.userName;

    }

    importFilterInput: PO_PRODUCT_ENTITY = new PO_PRODUCT_ENTITY();
    xlsStructure = [
        'hardwarevT_CODE',
        'hardwarevT_NAME',
        'unit',
        'color',
        'hardwarevT_LENGTH',
        'hardwarevT_WIDTH',
        'hardwarevT_HEIGHT',
        'notes'
	];
    onImportExcel(rows: any) {
        abp.ui.setBusy();
        let excelArr = this.xlsRowsToArr(rows, this.xlsStructure, function (obj: PO_HARDWAREVT_ENTITY) {
            return obj;
        })
		if (!excelArr) {
			abp.ui.clearBusy();
			return;
		}
        // phần gán data gửi về BE
		this.importFilterInput.pO_PRODUCT_HARDWAREVTs = excelArr.map(this.excelMapping);

		if (excelArr && excelArr.length) {
			this.poHardwareVTService
				.pO_HARDWAREVT_IMPORT_Data(this.appSession.user.userName, this.importFilterInput)
				.pipe( finalize(() => { abp.ui.clearBusy();}))
                .subscribe((res) => {
                    if(res['Result'] == '-1'){
                        this.showErrorMessage(res['ErrorDesc']);
                        this.updateView();
                    }
                    else{
                        this.showSuccessMessage(this.l('ImportSuccessfully'));
                        this.updateView();
                    }
                });
		}
		this.updateView();
	}

    exportExcelTemplate() {
        abp.ui.setBusy();
		let reportInfo = new ReportInfo();
		reportInfo.typeExport = ReportTypeConsts.Excel;
        reportInfo.pathName = '/PO_MASTER/FileImport_HardwareVT.xlsx';
		reportInfo.storeName = 'PO_HARDWAREVT_ById';
		this.asposeService
        .getReportFromTable(reportInfo)
        .pipe( finalize(() => { abp.ui.clearBusy();}))
        .subscribe((res) => {
            this.fileDownloadService.downloadTempFile(res);
		});
	}

    @ViewChild('poImageModal') poImageModal: POImageModalComponent;
    showPOImageModal(): void {
		this.poImageModal.show();
	}
	
	onSelectPOImage(item: PO_IMAGE_ENTITY): void {
		this.inputModel.urls = item.urls;
		this.updateView();
	}

    deletePOImageModal(){
        this.inputModel.urls = undefined;
		this.updateView();
    }
    
}
