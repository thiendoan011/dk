import { Component, Injector, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FRE_GOODS_ENTITY, TL_USER_ENTITY, TlUserServiceProxy, GoodsServiceProxy, UnitServiceProxy, CM_UNIT_ENTITY, ReportInfo, AsposeServiceProxy, FRE_GOODS_TEMPLATE_MASTER_DTO } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { FREHistoryModalComponent } from '@app/admin/core/modal/module-fre/fre-history-modal/fre-history-modal.component';
import { ReportTypeConsts } from '@app/admin/core/ultils/consts/ReportTypeConsts';
import { FileDownloadService } from '@shared/utils/file-download.service';

@Component({
    templateUrl: './fre-goods-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class FREGoodsEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<FRE_GOODS_ENTITY> {
//#region constructor
    constructor(
        injector: Injector,
        private tlUserService: TlUserServiceProxy,
        private goodsService: GoodsServiceProxy,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private unitService: UnitServiceProxy
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.frE_GOODS_ID = this.getRouteParam('id');
        this.initDefaultFilter();
    }

    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: FRE_GOODS_ENTITY = new FRE_GOODS_ENTITY();
    filterInput: FRE_GOODS_ENTITY;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.appToolbar.setRole('FREGoods', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.inputModel.autH_STATUS = 'E'
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('FREGoods', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('FREGoods', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getDataPages();
                break;
        }
        this.appToolbar.setUiActionEdit(this);
    }

    ngAfterViewInit(): void {
        this.updateView();
    }
//#endregion constructor

//#region CRUD    
    goBack() {
        this.navigatePassParam('/app/admin/fre-goods', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.goodsService.fRE_GOODS_ById(this.inputModel.frE_GOODS_ID).subscribe(response => {
            // set data
            if (!response) this.goBack()
            this.inputModel = response;

            this.setDataEditTables();
            // set role, view button(detail at region Status Page)
            this.setViewToolBar();
            // lịch sử xử lý
            this.history_modal.getDetail();

            this.updateView();
        });
    }

    onSave(): void {
        this.saveInput();
    }

    saveInput() {
        
        this.getDataEditTables();

        if(!this.inputModel.frE_GOODS_ID) {
            this.onAdd();
        } else {
            this.onUpdate();
        }
    }

    onAdd(): void {
        this.saving = true;
        this.goodsService
        .fRE_GOODS_Ins(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.inputModel.frE_GOODS_ID = res['ID'];
                this.showSuccessMessage(res['ErrorDesc']);
                this.getDataPages();
                this.updateView();
            }
        })
    }

    onUpdate(): void {
        this.saving = true;
        this.goodsService
        .fRE_GOODS_Upd(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe((res) => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.updateSuccess();
                this.getDataPages();
                this.updateView();
            }
        });
    }

    onApprove(item: FRE_GOODS_ENTITY): void{
    }

    onReject(event){
        this.getDataPages();
    }
//#endregion CRUD

//#region "EditTable"
    getDataEditTables(){
        // Danh sách vật tư
        //this.inputModel.puR_ORDER_Details = this.purOrderDetailEdittable.editTable.allData;
    }
    setDataEditTables(){
        // Danh sách vật tư
        // if (this.inputModel.puR_ORDER_Details && this.inputModel.puR_ORDER_Details.length > 0) {
        //     this.purOrderDetailEdittable.editTable.setList(this.inputModel.puR_ORDER_Details);
        //     this.purOrderDetailEdittable.refreshTable();
        // }
    }

    // Danh sách vật tư
    //@ViewChild('purOrderDetailEdittable') purOrderDetailEdittable: FREGoodsDetailEdittableComponent;
    // lịch sử xử lý
    @ViewChild('history_modal') history_modal: FREHistoryModalComponent;
    
//#endregion "EditTable"

//#region Status Page
    is_enable_reject: string = 'N';
    setViewToolBar(){
    // Button lưu
        // Xem chi tiết
        if(this.editPageState == EditPageState.viewDetail){
            this.appToolbar.setButtonSaveEnable(false);
        }
        // Chỉnh sửa
        else{
            // Lưu nháp(E), từ chối(R) --> có thể lưu
            if(this.inputModel.autH_STATUS == 'E' || this.inputModel.autH_STATUS == 'R'){
                this.appToolbar.setButtonSaveEnable(true);
            }
            else{
                this.appToolbar.setButtonSaveEnable(false);
            }
        }

    // Button duyệt
        if (this.editPageState == EditPageState.viewDetail && this.inputModel.autH_STATUS == 'U') {
            this.appToolbar.setButtonApproveEnable(true);
        }
        else{
            this.appToolbar.setButtonApproveEnable(false);
        }
    }
Ư
    get disableInput(): boolean {
        return this.editPageState == EditPageState.viewDetail || this.inputModel.autH_STATUS == 'A';
    }
//#endregion Status Page

//#region combobox and default filter

    // call in region constructor
    initDefaultFilter() {
        this.initCombobox();
        // set other filter here
    }
// begin combobox
// edit step 3: search
    initCombobox() {
        let filterCombobox = this.getFillterForCombobox();

        this.tlUserService.tL_USER_Search(filterCombobox).subscribe(response => {
            this._users = response.items;
            //this._users= this._users.filter(x=>x.tlnanme!=this.appSession.user.userName);
            this.updateView();
        });
        this.unitService.cM_UNIT_Search(filterCombobox).subscribe((res) => {
            this.units = res.items;
            this.updateView();
        });
    }

// edit step 1: init variable
    //list user gốc
    _users: TL_USER_ENTITY[];
    units: CM_UNIT_ENTITY[] = [];

// edit step 2: handle event
    onSelectMWGroup(event){
            
    }
// end combobox

//#endregion combobox and default filter

//#region import
    onExportTemplate(type: string){
        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        let reportFilter =  {   USER_LOGIN: this.appSession.user.userName };
        reportInfo.parameters = this.GetParamsFromFilter(reportFilter)

        reportInfo.pathName = '/FRE/FRE_GOODS/FRE_GOODS_TEMPLATE.xlsx';

        reportInfo.storeName = 'CM_BRANCH_Search';
        this.asposeService.getReport(reportInfo).subscribe((res) => {
            this.fileDownloadService.downloadTempFile(res);
        });
    }

    importFilterInput: FRE_GOODS_TEMPLATE_MASTER_DTO = new FRE_GOODS_TEMPLATE_MASTER_DTO();
    xlsStructureIns = [
        'STT',
        'frE_GOODS_CODE',
        'frE_GOODS_NAME',
        'frE_GOODS_SPECIFICATION',
        'frE_GOODS_UNIT_NAME',
        'frE_GOODS_MASS',
        'frE_GOODS_VOLUME',
        'frE_GOODS_TYPE',
        'notes'
    ];

    onImport(rows: any) {
        abp.ui.setBusy();
        let excelArr = this.xlsRowsToArr(rows, this.xlsStructureIns, function (obj: FRE_GOODS_ENTITY) {
            return obj;
        })
        if (!excelArr) {
            abp.ui.clearBusy();
            return;
        }
        // phần gán data gửi về BE
        this.importFilterInput.makeR_ID = this.appSession.user.userName;
        this.importFilterInput.frE_GOODS_TEMPLATEs = excelArr.map(this.excelMapping);

        if (excelArr && excelArr.length) {
            this.goodsService
                .fRE_GOODS_Import(this.importFilterInput)
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
//#endregion import
}
