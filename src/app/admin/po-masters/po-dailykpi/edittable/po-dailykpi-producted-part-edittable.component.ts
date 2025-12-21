import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { PoPOModalComponent } from "@app/admin/core/modal/module-po/po-po-modal/po-po-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AsposeServiceProxy, PO_DAILYKPI_ENTITY, PO_DAILYKPI_PRODUCTED_PART_EDITTABLE, PO_ENTITY, PoDailyKPIServiceProxy, ReportInfo } from "@shared/service-proxies/service-proxies";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'po-dailykpi-producted-part-edittable',
	templateUrl: './po-dailykpi-producted-part-edittable.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ appModuleAnimation() ]
})

export class PODailyKPIProductedPartEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
        private poDailyKPIService: PoDailyKPIServiceProxy,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy
    ) {
        super(injector);
    }

    _inputModel: PO_DAILYKPI_ENTITY;
    @Input() set inputModel(value: PO_DAILYKPI_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): PO_DAILYKPI_ENTITY {
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

    @ViewChild('editTable') editTable: EditableTableComponent<PO_DAILYKPI_PRODUCTED_PART_EDITTABLE>;

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
        let datas = this.editTable.allData;
        let data = new PO_DAILYKPI_PRODUCTED_PART_EDITTABLE();
        data.target = 9.5;
        data.workeR_ACTUAL = 0;
        data.workeR_OT = 0;
        data.totaL_OT = 0;
        data.targeT_M3_PER_CONT = 0.22;
        datas.push(data);
		this.editTable.setList(datas);
    }

    onRemove(): void {
        this.editTable.removeAllCheckedItem();
		this.updateView();
    }

    
    exportExcel(){
        abp.ui.setBusy();

        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        reportInfo.parameters = this.GetParamsFromFilter({
            PO_DAILYKPI_ID: this.inputModel.pO_DAILYKPI_ID
        });
        
        reportInfo.pathName = "/PO_MASTER/PO_DAILYKPI_PRODUCTED_PARTs.xlsx";
        reportInfo.storeName = "PO_DAILYKPI_PRODUCTED_PARTs_EXPORT";

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

    onChangeValue(item: PO_DAILYKPI_PRODUCTED_PART_EDITTABLE){
        if(this.isNullOrEmptyNumber(item.totaL_OT))
        {
            item.totaL_OT = 0;
        }

        // Quy về công lao động
        item.workeR_COST = (item.totaL_OT/8) + item.workeR_ACTUAL;
        // M3 theo định mức
        item.targeT_M3 = ((item.totaL_OT/8) + item.workeR_ACTUAL) * item.targeT_M3_PER_CONT;
        // Số cont theo định mức
        item.targeT_CONT = ((item.totaL_OT/8) + item.workeR_ACTUAL) * item.targeT_M3_PER_CONT / 9.5
        // // Tỷ lệ
        // if(!this.isNullOrEmptyNumber(item.targeT_CONT) && item.targeT_CONT != 0){
        //     item.actuaL_CONT_PER_TARGET_CONT = (item.actuaL_CONT / item.targeT_CONT) * 100;
        //     this.updateView();
        // }
        this.updateView();
    }

    // onEditColumn(item: PO_DAILYKPI_PRODUCTED_PART_EDITTABLE){
    //     abp.ui.setBusy();
    //     this.poDailyKPIService
    //     .pO_DAILYKPI_PRODUCTED_PART_EditColumn(item)
    //     .pipe(finalize(() => {abp.ui.clearBusy();}))
    //     .subscribe(res => {
    //         if(res['Result'] != '0'){
    //             this.showErrorMessage(res['ErrorDesc']);
    //             this.updateView();
    //         } else {
    //             this.showSuccessMessage(res['ErrorDesc']);
    //             this.updateView();
    //         }
    //     })
    // }

}