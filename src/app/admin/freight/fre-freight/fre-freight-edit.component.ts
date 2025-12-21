import { Component, Injector, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FRE_FREIGHT_ENTITY, TL_USER_ENTITY, TlUserServiceProxy, FreightServiceProxy, VHE_VEHICLE_REQUEST_ENTITY } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { FREHistoryModalComponent } from '@app/admin/core/modal/module-fre/fre-history-modal/fre-history-modal.component';
import { FRERejectModalComponent } from '@app/admin/core/modal/module-fre/fre-reject-modal/fre-reject-modal.component';
import { FREFreightRouteEdittableComponent } from './edittable/fre-freight-route-edittable.component';
import { FREFreightVehicleRequestEdittableComponent } from './edittable/fre-freight-vehicle-request-edittable.component';
import { FREFreightGoodUserEdittableComponent } from './edittable/fre-freight-good-user-edittable.component';
import { FREFreightGoodEdittableComponent } from './edittable/fre-freight-good-edittable.component';
import { VHEVehicleRequestCreateModalComponent } from '@app/admin/core/modal/module-vehicle/vhe-vehicle-request-create/vhe-vehicle-request-create-modal.component';

@Component({
    templateUrl: './fre-freight-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class FREFreightEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<FRE_FREIGHT_ENTITY> {
//#region constructor
    constructor(
        injector: Injector,
        private tlUserService: TlUserServiceProxy,
        private freightService: FreightServiceProxy
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.frE_FREIGHT_ID = this.getRouteParam('id');
        this.initDefaultFilter();
    }

    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: FRE_FREIGHT_ENTITY = new FRE_FREIGHT_ENTITY();
    filterInput: FRE_FREIGHT_ENTITY;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.appToolbar.setRole('FREFreight', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.inputModel.autH_STATUS = 'E'
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('FREFreight', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('FREFreight', false, false, false, false, false, false, true, false);
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
        this.navigatePassParam('/app/admin/fre-freight', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.freightService.fRE_FREIGHT_ById(this.inputModel.frE_FREIGHT_ID).subscribe(response => {
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

        if(!this.inputModel.frE_FREIGHT_ID) {
            this.onAdd();
        } else {
            this.onUpdate();
        }
    }

    onAdd(): void {
        this.saving = true;
        this.freightService
        .fRE_FREIGHT_Ins(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.inputModel.frE_FREIGHT_ID = res['ID'];
                this.showSuccessMessage(res['ErrorDesc']);
                this.getDataPages();
                this.updateView();
            }
        })
    }

    onUpdate(): void {
        this.saving = true;
        this.freightService
        .fRE_FREIGHT_Upd(this.inputModel)
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

    onApprove(item: FRE_FREIGHT_ENTITY): void{
        this.message.confirm(
            this.l('ApproveWarningMessage', (this.inputModel.frE_FREIGHT_ID)),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.freightService
                    .fRE_FREIGHT_App(this.inputModel.frE_FREIGHT_ID, this.appSession.user.userName)
                    .pipe(finalize(() => {this.saving = false}))
                    .subscribe((res) => {
                        if (res['Result'] != '0') {
                            this.showErrorMessage(res['ErrorDesc']);
                            this.updateView();
                        } 
                        else {
                            this.approveSuccess();
                            this.getDataPages();
                            this.updateView();
                        }
                    });
                }
            }
        );
    }

    onSendAppr(): void {
        this.saving = true;
        this.inputModel.iS_SEND_APPR = 'Y';
        this.freightService
        .fRE_FREIGHT_Upd(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe((res) => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.showSuccessMessage(res['ErrorDesc']);
                this.getDataPages();
                this.updateView();
            }
        });
    }

    onReject(event){
        this.getDataPages();
    }
//#endregion CRUD

//#region "EditTable"
    getDataEditTables(){
        // Danh sách lộ trình
        this.inputModel.frE_FREIGHT_ROUTEs = this.freFreightRouteEdittable.editTable.allData;
        // Danh sách hàng hóa
        this.inputModel.frE_FREIGHT_GOODs = this.freFreightGoodEdittable.editTable.allData;
        // Danh sách user
        this.inputModel.frE_FREIGHT_GOOD_USERs = this.freFreightGoodUserEdittable.editTable.allData;
        // Danh sách phiếu yêu cầu
        this.inputModel.frE_FREIGHT_VEHICLE_REQUESTs = this.freFreightVehicleRequestEdittable.editTable.allData;
    }
    setDataEditTables(){
        //Danh sách lộ trình
        if (this.inputModel.frE_FREIGHT_ROUTEs && this.inputModel.frE_FREIGHT_ROUTEs.length > 0) {
            this.freFreightRouteEdittable.editTable.setList(this.inputModel.frE_FREIGHT_ROUTEs);
            this.freFreightRouteEdittable.refreshTable();
        }
        //Danh sách hàng hóa
        if (this.inputModel.frE_FREIGHT_GOODs && this.inputModel.frE_FREIGHT_GOODs.length > 0) {
            this.freFreightGoodEdittable.editTable.setList(this.inputModel.frE_FREIGHT_GOODs);
            this.freFreightGoodEdittable.refreshTable();
        }
        //Danh sách user
        if (this.inputModel.frE_FREIGHT_GOOD_USERs && this.inputModel.frE_FREIGHT_GOOD_USERs.length > 0) {
            this.freFreightGoodUserEdittable.editTable.setList(this.inputModel.frE_FREIGHT_GOOD_USERs);
            this.freFreightGoodUserEdittable.refreshTable();
        }
        //Danh sách phiếu yêu cầu
        if (this.inputModel.frE_FREIGHT_VEHICLE_REQUESTs && this.inputModel.frE_FREIGHT_VEHICLE_REQUESTs.length > 0) {
            this.freFreightVehicleRequestEdittable.editTable.setList(this.inputModel.frE_FREIGHT_VEHICLE_REQUESTs);
            this.freFreightVehicleRequestEdittable.refreshTable();
        }
    }

    //Danh sách lộ trình
    @ViewChild('freFreightRouteEdittable') freFreightRouteEdittable: FREFreightRouteEdittableComponent;
    //Danh sách hàng hóa
    @ViewChild('freFreightGoodEdittable') freFreightGoodEdittable: FREFreightGoodEdittableComponent;
    //Danh sách user
    @ViewChild('freFreightGoodUserEdittable') freFreightGoodUserEdittable: FREFreightGoodUserEdittableComponent;
    //Danh sách phiếu yêu cầu
    @ViewChild('freFreightVehicleRequestEdittable') freFreightVehicleRequestEdittable: FREFreightVehicleRequestEdittableComponent;


    // lịch sử xử lý
    @ViewChild('history_modal') history_modal: FREHistoryModalComponent;
    // lịch sử trả về
    @ViewChild('reject_modal') reject_modal: FRERejectModalComponent;
    
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
    // Danh sách
        if(this.disableSendAppr){
            this.hiddenUpdateFREGood = false;
            this.hiddenUpdateFREGoodUser = false;
        }
    }

    get disableInput(): boolean {
        return this.editPageState == EditPageState.viewDetail || this.inputModel.autH_STATUS == 'U' || this.inputModel.autH_STATUS == 'A'|| this.inputModel.autH_STATUS == 'C';
    }
    get rejectInput(): boolean {
        return this.editPageState == EditPageState.viewDetail && this.inputModel.autH_STATUS == 'U'
    }
    get disableSave(): boolean {
        return this.editPageState == EditPageState.viewDetail || (this.inputModel.autH_STATUS !== 'E' && this.inputModel.autH_STATUS !== 'R');
    }
    get disableSendAppr(): boolean {
        return this.editPageState == EditPageState.viewDetail || this.inputModel.autH_STATUS !== 'E' || !this.inputModel.frE_FREIGHT_ID;
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
    }

// edit step 1: init variable
    //list user gốc
    _users: TL_USER_ENTITY[];

// edit step 2: handle event
// end combobox

//#endregion combobox and default filter

//#region Emit Event
    disableUpdateVHEVehicleRequest: boolean = false;
    disableUpdateFREGood: boolean = true;
    disableUpdateFREGoodUser: boolean = true;

    hiddenUpdateVHEVehicleRequest: boolean = false;
    hiddenUpdateFREGood: boolean = true;
    hiddenUpdateFREGoodUser: boolean = true;

    updateViewedittable(type: string, type_update: string){
        if(type_update === "SaveAndLock"){
            if(type === "vheVehicleRequest"){
                this.disableUpdateVHEVehicleRequest = true;
                this.disableUpdateFREGood = false;
                this.disableUpdateFREGoodUser = true;

                this.hiddenUpdateVHEVehicleRequest = false;
                this.hiddenUpdateFREGood = false;
                this.hiddenUpdateFREGoodUser = true;

                this.updateView();
            }
            else if(type === "freGood"){
                this.disableUpdateVHEVehicleRequest = true;
                this.disableUpdateFREGood = true;
                this.disableUpdateFREGoodUser = false;

                this.hiddenUpdateVHEVehicleRequest = false;
                this.hiddenUpdateFREGood = false;
                this.hiddenUpdateFREGoodUser = false;

                this.updateView();
            }
            else if(type === "freGoodUser"){
                this.disableUpdateVHEVehicleRequest = false;
                this.disableUpdateFREGood = false;
                this.disableUpdateFREGoodUser = false;

                this.hiddenUpdateVHEVehicleRequest = false;
                this.hiddenUpdateFREGood = false;
                this.hiddenUpdateFREGoodUser = false;

                this.updateView();
            }
        }
        else if(type_update === "UnLock"){
            if(type === "vheVehicleRequest"){
                this.disableUpdateVHEVehicleRequest = false;
                this.disableUpdateFREGood = true;
                this.disableUpdateFREGoodUser = true;

                this.hiddenUpdateVHEVehicleRequest = false;
                this.hiddenUpdateFREGood = true;
                this.hiddenUpdateFREGoodUser = true;

                this.updateView();
            }
            else if(type === "freGood"){
                this.disableUpdateVHEVehicleRequest = true;
                this.disableUpdateFREGood = false;
                this.disableUpdateFREGoodUser = true;

                this.hiddenUpdateVHEVehicleRequest = false;
                this.hiddenUpdateFREGood = false;
                this.hiddenUpdateFREGoodUser = true;

                this.updateView();
            }
            else if(type === "freGoodUser"){
                this.disableUpdateVHEVehicleRequest = false;
                this.disableUpdateFREGood = false;
                this.disableUpdateFREGoodUser = false;
                this.updateView();
            }
        }
    }

    onSaveEdittable(): void {
        this.saveInput();
    }
    
    onSaveAndLockEdittable(type: string){
        this.onSave();
        this.updateViewedittable(type, "SaveAndLock");
    }

    onUnLockEdittable(type: string){
        this.updateViewedittable(type, "UnLock");
    }

//#endregion Emit Event

}
