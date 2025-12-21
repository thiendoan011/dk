import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { PoPOModalComponent } from "@app/admin/core/modal/module-po/po-po-modal/po-po-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AsposeServiceProxy, PO_BOOKING_ENTITY, PO_BOOKING_PO_EDITTABLE, PO_BOOKING_POs_IMPORT_DTO, PO_ENTITY, PoBookingServiceProxy, ReportInfo } from "@shared/service-proxies/service-proxies";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'po-booking-po-edittable',
	templateUrl: './po-booking-po-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class POBookingPOEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
        private poBookingService: PoBookingServiceProxy,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy
    ) {
        super(injector);
    }

    _inputModel: PO_BOOKING_ENTITY;
    @Input() set inputModel(value: PO_BOOKING_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): PO_BOOKING_ENTITY {
        return this._inputModel;
    }

    _title: string;
    @Input() set title(value: string) {
        this._title = value;
    }
    get title(): string {
        return this._title;
    }

    _disableInput: boolean;
    @Input() set disableInput(value: boolean) {
        this._disableInput = value;
    }
    get disableInput(): boolean {
        return this._disableInput;
    }

    _disableEditColumn: boolean = true;
    get disableEditColumn(): boolean {
        return this._disableEditColumn;
    }

    get isHiddenEditButton(): boolean {
        return this._inputModel.makeR_ID != this.appSession.user.userName || this._inputModel.autH_STATUS != 'A';
    }
//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<PO_BOOKING_PO_EDITTABLE>;

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
        this.showPopup();
    }

    onRemove(): void {
        this.editTable.removeAllCheckedItem();
		this.updateView();
    }

    @ViewChild('popupModal') popupModal: PoPOModalComponent;
    showPopup(): void {
		this.popupModal.show();
	}
	
	onSelectPopup(items: PO_ENTITY[]): void {
		items.forEach(x => {
			var item = new PO_BOOKING_PO_EDITTABLE();
			item.pO_ID = x.pO_ID;
			item.pO_CODE = x.pO_CODE;
			item.pO_NAME = x.pO_NAME;
            item.bookinG_DT = x.bookinG_DT;
            item.noteS_BOOKING = x.bookingdt;
			this.editTable.allData.push(item);
		})

		this.editTable.resetNoAndPage();
		this.editTable.changePage(0);
		this.updateView();
	}

    exportExcel(){
        abp.ui.setBusy();

        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        reportInfo.parameters = this.GetParamsFromFilter({
            PO_BOOKING_ID: this.inputModel.pO_BOOKING_ID
        });
        
        reportInfo.pathName = "/PO_MASTER/PO_BOOKING_POs.xlsx";
        reportInfo.storeName = "PO_BOOKING_POs_EXPORT";

        this.asposeService
        .getReport(reportInfo)
        .pipe(finalize(() => abp.ui.clearBusy()))
        .subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }

    onOpenEditColumn(){
        this._disableEditColumn = false;
        this.updateView();
    }

    onEditColumn(item: PO_BOOKING_PO_EDITTABLE){
        abp.ui.setBusy();
        this.poBookingService
        .pO_BOOKING_PO_EditColumn(item)
        .pipe(finalize(() => {abp.ui.clearBusy();}))
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.showSuccessMessage(res['ErrorDesc']);
                this.updateView();
            }
        })
    }

    //#region Import
    onExportTemplate(){
        this.removeMessage();
        abp.ui.setBusy();
        
        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;
        
        reportInfo.pathName = "/PO_MASTER/BOOKING/PO_BOOKING_IMPORT_TEMPLATE.xlsx";
        reportInfo.storeName = "CM_ALLCODE_Search";

        this.asposeService
        .getReport(reportInfo)
        .pipe(finalize(() => abp.ui.clearBusy()))
        .subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }

    importFilterInput: PO_BOOKING_POs_IMPORT_DTO = new PO_BOOKING_POs_IMPORT_DTO();
    xlsStructure = [
        'STT',
        'PO_BOOKING_NAME',
        'PO_CODE',
        'BOOKING_DT',
        'REASON',
        'NOTES_BOOKING',
    ];

    onImportTemplate(rows: any) {
        this.removeMessage();
        abp.ui.setBusy();
        let excelArr = this.xlsRowsToArr(rows, this.xlsStructure, function (obj: PO_BOOKING_POs_IMPORT_DTO) {
            return obj;
        })
        if (!excelArr) {
            abp.ui.clearBusy();
            return;
        }


        if (excelArr && excelArr.length) {
            this.poBookingService
                .pO_BOOKING_Import(excelArr.map(this.excelMapping))
                .pipe( finalize(() => { abp.ui.clearBusy();}))
                .subscribe((res) => {
                    if(res['Result'] == '-1'){
                        this.showErrorMessage(res['ErrorDesc']);
                    }
                    else{
                        this.showSuccessMessage(res['ErrorDesc']);
                    }
                    this.updateView();
                });
        }
    }
    //#endregion Import

}