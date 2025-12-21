import { AfterViewInit, Component, EventEmitter, Injector, Input, Output, ViewChild } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { finalize } from "@node_modules/rxjs/operators";
import { AsposeServiceProxy, PUR_REQUISITION_ENTITY, PUR_REQUISITION_MATERIAL_SUMMARY_EDITTABLE, ReportInfo } from "@shared/service-proxies/service-proxies";
import { FileDownloadService } from "@shared/utils/file-download.service";

@Component({
    selector: 'pur-requisition-material-summary-not-purchase-edittable',
	templateUrl: './pur-requisition-material-summary-not-purchase-edittable.component.html'
})

export class PURRequisitionMaterialSummaryNotPurchaseEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy
    ) {
        super(injector);
    }

    _inputModel: PUR_REQUISITION_ENTITY;
    @Input() set inputModel(value: PUR_REQUISITION_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): PUR_REQUISITION_ENTITY {
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
//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<PUR_REQUISITION_MATERIAL_SUMMARY_EDITTABLE>;

    ngOnInit(): void {
        this.updateView();
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    refreshTable(){
        this.updateView();
    }

    @Output() onUpdate: EventEmitter<any> = new EventEmitter();
    onUpd(){
        this.onUpdate.emit();
    }

    onChangeQuantityOrder(item: PUR_REQUISITION_MATERIAL_SUMMARY_EDITTABLE){
        item.quantitY_INVENTORY = item.quantitY_REQUEST - item.quantitY_ORDER;
        this.updateView();
    }

    exportExcel() {
        abp.ui.setBusy();

        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        reportInfo.parameters = this.GetParamsFromFilter({
            PUR_REQUISITION_ID: this.inputModel.puR_REQUISITION_ID
        });

        reportInfo.pathName = "/PURCHASE/PUR_REQUISITION_PROCESS/NOT_PURCHASE.xlsx";
        reportInfo.storeName = "PUR_REQUISITION_PROCESS_NOT_PURCHASE_EXPORT";

        this.asposeService
            .getReport(reportInfo)
            .pipe(finalize(() => abp.ui.clearBusy()))
            .subscribe(x => {
                this.fileDownloadService.downloadTempFile(x);
            });
    }
}