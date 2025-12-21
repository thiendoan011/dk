import { AfterViewInit, Component, EventEmitter, Injector, Input, Output, ViewChild } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { VHEVehicleRequestModalComponent } from "@app/admin/core/modal/module-vehicle/vhe-vehicle-request/vhe-vehicle-request-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { finalize } from "@node_modules/rxjs/operators";
import { AsposeServiceProxy, FRE_FREIGHT_ENTITY, FRE_FREIGHT_VEHICLE_REQUEST_DTO, ReportInfo, VHE_VEHICLE_REQUEST_ENTITY } from "@shared/service-proxies/service-proxies";
import { FileDownloadService } from "@shared/utils/file-download.service";

@Component({
    selector: 'fre-freight-vehicle-request-edittable',
	templateUrl: './fre-freight-vehicle-request-edittable.component.html'
})

export class FREFreightVehicleRequestEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy
    ) {
        super(injector);
    }
    
    _title: string;
    @Input() set title(value: string) {
        this._title = value;
    }
    get title(): string {
        return this._title;
    }
    
    _inputModel: FRE_FREIGHT_ENTITY;
    @Input() set inputModel(value: FRE_FREIGHT_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): FRE_FREIGHT_ENTITY {
        return this._inputModel;
    }

    _disableInput: boolean;
    @Input() set disableInput(value: boolean) {
        this._disableInput = value;
    }
    get disableInput(): boolean {
        return this._disableInput;
    }
    
    _disableSendAppr: boolean;
    @Input() set disableSendAppr(value: boolean) {
        this._disableSendAppr = value;
    }
    get disableSendAppr(): boolean {
        return this._disableSendAppr;
    }
    
//#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<FRE_FREIGHT_VEHICLE_REQUEST_DTO>;

    ngOnInit(): void {
        this.updateView();
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    refreshTable(){
        this.updateView();
    }

//#region modal

    // //modal tạo nhanh phiếu yêu cầu xe -- tạm thời chưa sử dụng
    // @ViewChild('vheVehicleRequestCreateModal') vheVehicleRequestCreateModal: VHEVehicleRequestCreateModalComponent;
    // showVehicleRequestCreate() : void{
    //     //default value
    //     //this.vheVehicleRequestCreateModal.filterInput.froM_DT = this.inputModel.froM_DT;
    //     //this.vheVehicleRequestCreateModal.filterInput.tO_DT = this.inputModel.tO_DT;

    //     this.vheVehicleRequestCreateModal.show();
    // }
    // onAcceptVehicleRequestCreate(item: VHE_VEHICLE_REQUEST_ENTITY){
    //     this.editTable.pushItem(item);
    //     this.updateView();
    // }

    //modal tạo nhanh phiếu yêu cầu xe
    @ViewChild('vheVehicleRequestModal') vheVehicleRequestModal: VHEVehicleRequestModalComponent;
    onShowVehicleRequest() : void{
        //default value
        //this.vheVehicleRequestCreateModal.filterInput.froM_DT = this.inputModel.froM_DT;
        //this.vheVehicleRequestCreateModal.filterInput.tO_DT = this.inputModel.tO_DT;

        this.vheVehicleRequestModal.show();
    }
    onSelectVehicleRequest(items: VHE_VEHICLE_REQUEST_ENTITY[]){
        items.forEach(x => {
            var item = new FRE_FREIGHT_VEHICLE_REQUEST_DTO();
            item.vhE_VEHICLE_ID = x.vhE_VEHICLE_ID;
            item.vhE_VEHICLE_CODE = x.vhE_VEHICLE_CODE;
            item.vhE_VEHICLE_REQUEST_ID = x.vhE_VEHICLE_REQUEST_ID;
            item.vhE_VEHICLE_REQUEST_CODE = x.vhE_VEHICLE_REQUEST_CODE;
            item.driveR_ID = x.driveR_ID;
            item.driveR_NAME = x.driveR_NAME;
            item.froM_DT = x.froM_DT;
            item.tO_DT = x.tO_DT;
            item.froM_LOCATION = x.froM_LOCATION;
            item.tO_LOCATION = x.tO_LOCATION;
            item.vhE_VEHICLE_PAYLOAD = x.vhE_VEHICLE_PAYLOAD;
            item.vhE_VEHICLE_FREIGHT_CAPCITY = x.vhE_VEHICLE_FREIGHT_CAPCITY;
            this.editTable.allData.push(item);
        })

        this.editTable.resetNoAndPage();
        this.editTable.changePage(0);
        this.updateView();
    }
    onOpenAdd(){
        window.open("/app/admin/vhe-vehicle-request-add");
    }
//#endregion modal

//#region Emit Event
    _disableUpdate: boolean;
    @Input() set disableUpdate(value: boolean) {
        this._disableUpdate = value;
    }
    get disableUpdate(): boolean {
        return this._disableUpdate;
    }

    @Output() o_Save: EventEmitter<any> = new EventEmitter();
    @Output() o_SaveAndLock: EventEmitter<any> = new EventEmitter();
    @Output() o_UnLock: EventEmitter<any> = new EventEmitter();

    onSave(){
        this.o_Save.emit();
    }
    onUnLock(){
        this.o_UnLock.emit();
    }
    onSaveAndLock(){
        this.o_SaveAndLock.emit();
    }
    
    exportExcel(){
        abp.ui.setBusy();

        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        reportInfo.parameters = this.GetParamsFromFilter({
            BRANCH_ID: this.inputModel.brancH_ID,
            FRE_FREIGHT_ID: this.inputModel.frE_FREIGHT_ID,
        });
        
        reportInfo.pathName = "/FRE/FRE_FREIGHT/FRE_FREIGHT_GOODS.xlsx";
        reportInfo.storeName = "FRE_REPORT_FRE_FREIGHT_FRE_FREIGHT_VEHICLE_REQUEST";

        this.asposeService
        .getReport(reportInfo)
        .pipe(finalize(() => abp.ui.clearBusy()))
        .subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }

//#endregion Emit Event

}