import { AfterViewInit, Component, EventEmitter, Injector, Input, Output, ViewChild } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { FREGoodsModalComponent } from "@app/admin/core/modal/module-fre/fre-goods/fre-goods-modal.component";
import { FRELocationModalComponent } from "@app/admin/core/modal/module-fre/fre-location/fre-location-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { finalize } from "@node_modules/rxjs/operators";
import { AsposeServiceProxy, FRE_FREIGHT_ENTITY, FRE_FREIGHT_GOOD_ENTITY, FRE_GOODS_ENTITY, FRE_LOCATION_ENTITY, ReportInfo } from "@shared/service-proxies/service-proxies";
import { FileDownloadService } from "@shared/utils/file-download.service";

@Component({
    selector: 'fre-freight-good-edittable',
	templateUrl: './fre-freight-good-edittable.component.html'
})

export class FREFreightGoodEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
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

    @ViewChild('editTable') editTable: EditableTableComponent<FRE_FREIGHT_GOOD_ENTITY>;

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

    //modal hàng hóa
    @ViewChild('freGoodsModal') freGoodsModal: FREGoodsModalComponent;
    onShowFREGoodsModal() : void{
        //default value

        this.freGoodsModal.show();
    }
    onSelectFREGoodsModal(items : FRE_GOODS_ENTITY[]){
        var data = new FRE_FREIGHT_GOOD_ENTITY();
        for (const item of items) {
            data.frE_GOODS_ID = item.frE_GOODS_ID;
            data.frE_GOODS_NAME = item.frE_GOODS_NAME;
            data.frE_GOODS_SPECIFICATION = item.frE_GOODS_SPECIFICATION;
            data.frE_GOODS_TYPE = item.frE_GOODS_TYPE;
            data.frE_GOODS_UNIT = item.frE_GOODS_UNIT;
            data.frE_FREIGHT_GOOD_MASS = item.frE_GOODS_MASS;
            data.frE_FREIGHT_GOOD_VOLUME = item.frE_GOODS_VOLUME;

            this.editTable.allData.push(data);
            this.editTable.resetNoAndPage();
            this.editTable.changePage(0);
            this.updateView();
        }
    }

    //modal địa điểm đi
    @ViewChild('freDepartureLocationModal') freDepartureLocationModal: FRELocationModalComponent;
    onShowFREDepartureLocationModal() : void{
        //default value

        this.freDepartureLocationModal.show();
    }
    onSelectFREDepartureLocationModal(event: FRE_LOCATION_ENTITY){
        let currentItem = this.editTable.currentItem;
		let dataCurrentItem = this.editTable.allData[this.editTable.allData.indexOf(currentItem)];
        dataCurrentItem.departurE_LOCATION_ID = event.frE_LOCATION_ID
        dataCurrentItem.departurE_LOCATION_NAME = event.frE_LOCATION_NAME
        this.updateView();
    }

    //modal địa điểm đến
    @ViewChild('freArrivalLocationModal') freArrivalLocationModal: FRELocationModalComponent;
    onShowFREArrivalLocationModal() : void{
        //default value

        this.freArrivalLocationModal.show();
    }
    onSelectFREArrivalLocationModal(event: FRE_LOCATION_ENTITY){
        let currentItem = this.editTable.currentItem;
		let dataCurrentItem = this.editTable.allData[this.editTable.allData.indexOf(currentItem)];
        dataCurrentItem.arrivaL_LOCATION_ID = event.frE_LOCATION_ID
        dataCurrentItem.arrivaL_LOCATION_NAME = event.frE_LOCATION_NAME
        this.updateView();
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
        reportInfo.storeName = "FRE_REPORT_FRE_FREIGHT_FRE_FREIGHT_GOODS";

        this.asposeService
        .getReport(reportInfo)
        .pipe(finalize(() => abp.ui.clearBusy()))
        .subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }

    onChangeAMT(event: FRE_FREIGHT_GOOD_ENTITY): void {
        event.totaL_FRE_FREIGHT_GOOD_MASS = event.frE_FREIGHT_GOOD_QUANTITY * event.frE_FREIGHT_GOOD_MASS;
        event.totaL_FRE_FREIGHT_GOOD_VOLUME = event.frE_FREIGHT_GOOD_QUANTITY * event.frE_FREIGHT_GOOD_VOLUME;
        this.updateView();
    }

//#endregion Emit Event
}