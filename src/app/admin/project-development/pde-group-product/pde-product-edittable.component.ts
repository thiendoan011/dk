import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";

import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { PoProductModalComponent } from "@app/admin/core/modal/module-po/po-product-modal/po-product-modal.component";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AsposeServiceProxy, PDEGroupProductServiceProxy, PO_GROUP_PRODUCT_ENTITY, PO_PRODUCT_ENTITY, PoPurchaseServiceProxy, ReportInfo } from "@shared/service-proxies/service-proxies";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'pde-product-edittable',
	templateUrl: './pde-product-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class PDEProductEditTableComponent extends DefaultComponentBase implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
		private asposeService: AsposeServiceProxy,
		private fileDownloadService: FileDownloadService,
        private poPurchaseService: PoPurchaseServiceProxy,
        private pdeGroupProductService: PDEGroupProductServiceProxy,
    ) {
        super(injector);
    }

    _disableInput: boolean;
    @Input() set disableInput(value: boolean) {
        this._disableInput = value;
    }
    get disableInput(): boolean {
        return this._disableInput;
    }

    _inputModel: PO_GROUP_PRODUCT_ENTITY;
    @Input() set inputModel(value: PO_GROUP_PRODUCT_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): PO_GROUP_PRODUCT_ENTITY {
        return this._inputModel;
    }

    @Output() choose_product_template_complated: EventEmitter<any> =   new EventEmitter();
//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<PO_PRODUCT_ENTITY>;
    @ViewChild('popupAdd') popupAdd: PoProductModalComponent;

    ngOnInit(): void {
        this.updateView();
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    refreshTable(){
        this.updateView();
    }

    onAdd(): void {
        this.popupAdd.show();
    }

    onRemove(): void {
        this.editTable.removeAllCheckedItem();
		this.updateView();
    }
    
    reload(){

    }
	
	onSelectPopupAdd(items: PO_PRODUCT_ENTITY[]): void {
        items.forEach(x => {
			var item = new PO_PRODUCT_ENTITY();
			item.producT_ID = x.producT_ID;
			item.producT_CODE = x.producT_CODE;
			item.producT_NAME = x.producT_NAME;
			item.quantity = 0;
			this.editTable.allData.push(item);
		})

		this.editTable.resetNoAndPage();
		this.editTable.changePage(0);
		this.updateView();
	}

    importFilterInput: PO_GROUP_PRODUCT_ENTITY = new PO_GROUP_PRODUCT_ENTITY();
    xlsStructure = [
        'producT_CODE',
        'producT_NAME',
        'notes',
	];

    onImportExcel(rows: any) {
		var bakValidation = [ ...this.editTable.validations ];
		this.editTable.validations = [];

		let excelArr = this.xlsRowsToArrCheckVal<PO_PRODUCT_ENTITY>(
			this.editTable,rows,this.xlsStructure,
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
                            this.editTable.allData.push(item);
						});

						this.editTable.resetNoAndPage();
						this.editTable.changePage(0);
						this.showSuccessMessage(this.l('ImportSuccessfully'));
						this.updateView();
					} else {
						this.showErrorMessage(this.l('Immport file excel thất bại'));
						this.updateView();
					}
				});
		}
		this.editTable.validations = [ ...bakValidation ];
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

    PDE_GROUP_PRODUCT_PRODUCT_TEMPLATE_Upd(){
		this.message.confirm(
            this.l('Việc chọn làm mẫu này sẽ tải lại trang, do đó sẽ không lưu các thay đổi của hệ hàng nếu có! Vui lòng cân nhắc trước khi xác nhận'),
			this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
					abp.ui.setBusy();
					this.inputModel.pO_PRODUCT_TEMPLATEs =  this.editTable.getAllCheckedItem();
					this.pdeGroupProductService
						.pDE_GROUP_PRODUCT_PRODUCT_TEMPLATE_Upd(this.inputModel)
						.pipe(finalize(() => {abp.ui.clearBusy();}))
						.subscribe((res) => {
							if (res['Result'] != '0') {
								this.showErrorMessage(res['ErrorDesc']);
							} else {
								this.showSuccessMessage(res['ErrorDesc']);
								this.choose_product_template_complated.emit();
								this.updateView();
							}
						});
                }
            }
        );
    }

//#region Hyperlink
	onViewDetailProduct(item: PO_PRODUCT_ENTITY){
		window.open("/app/admin/pde-product-view;id="+ item.producT_ID);
	}
//#endregion Hyperlink

}