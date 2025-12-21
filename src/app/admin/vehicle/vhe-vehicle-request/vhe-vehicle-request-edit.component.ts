import { Component, Injector, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { VHE_VEHICLE_REQUEST_ENTITY, TL_USER_ENTITY, TlUserServiceProxy, VHEVehicleRequestServiceProxy, VHE_VEHICLE_ENTITY, FRE_FREIGHT_ENTITY, VHE_DRIVER_ENTITY } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { VHEHistoryModalComponent } from '@app/admin/core/modal/module-vehicle/vhe-history-modal/vhe-history-modal.component';
import { VHERejectModalComponent } from '@app/admin/core/modal/module-vehicle/vhe-reject-modal/vhe-reject-modal.component';
import { VHEVehicleModalComponent } from '@app/admin/core/modal/module-vehicle/vhe-vehicle/vhe-vehicle-modal.component';
import { FREFreightModalComponent } from '@app/admin/core/modal/module-fre/fre-freight/fre-freight-modal.component';
import { TLUserModalComponent } from '@app/admin/core/modal/module-user/tl-user/tl-user-modal.component';
import { VHEDriverModalComponent } from '@app/admin/core/modal/module-vehicle/vhe-driver/vhe-driver-modal.component';

@Component({
    templateUrl: './vhe-vehicle-request-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class VHEVehicleRequestEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<VHE_VEHICLE_REQUEST_ENTITY> {
//#region constructor
    constructor(
        injector: Injector,
        private tlUserService: TlUserServiceProxy,
        private vehicleRequestService: VHEVehicleRequestServiceProxy
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.vhE_VEHICLE_REQUEST_ID = this.getRouteParam('id');
        this.initDefaultFilter();
    }

    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: VHE_VEHICLE_REQUEST_ENTITY = new VHE_VEHICLE_REQUEST_ENTITY();
    filterInput: VHE_VEHICLE_REQUEST_ENTITY;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.appToolbar.setRole('VHEVehicleRequest', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.inputModel.autH_STATUS = 'E'
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('VHEVehicleRequest', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('VHEVehicleRequest', false, false, false, false, false, false, true, false);
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
        this.navigatePassParam('/app/admin/vhe-vehicle-request', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.vehicleRequestService.vHE_VEHICLE_REQUEST_ById(this.inputModel.vhE_VEHICLE_REQUEST_ID).subscribe(response => {
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

        if(!this.inputModel.vhE_VEHICLE_REQUEST_ID) {
            this.onAdd();
        } else {
            this.onUpdate();
        }
    }

    onAdd(): void {
        this.saving = true;
        this.vehicleRequestService
        .vHE_VEHICLE_REQUEST_Ins(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.inputModel.vhE_VEHICLE_REQUEST_ID = res['ID'];
                this.showSuccessMessage(res['ErrorDesc']);
                this.getDataPages();
                this.updateView();
            }
        })
    }

    onUpdate(): void {
        this.saving = true;
        this.vehicleRequestService
        .vHE_VEHICLE_REQUEST_Upd(this.inputModel)
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

    onApprove(item: VHE_VEHICLE_REQUEST_ENTITY): void{
        this.message.confirm(
            this.l('ApproveWarningMessage', (this.inputModel.vhE_VEHICLE_REQUEST_ID)),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.vehicleRequestService
                    .vHE_VEHICLE_REQUEST_App(this.inputModel.vhE_VEHICLE_REQUEST_ID, this.appSession.user.userName)
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
        this.vehicleRequestService
        .vHE_VEHICLE_REQUEST_Upd(this.inputModel)
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
    //@ViewChild('purOrderDetailEdittable') purOrderDetailEdittable: VHEVehicleDetailEdittableComponent;
    // lịch sử xử lý
    @ViewChild('history_modal') history_modal: VHEHistoryModalComponent;
    // lịch sử trả về
    @ViewChild('reject_modal') reject_modal: VHERejectModalComponent;
    
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

    get disableInput(): boolean {
        return this.editPageState == EditPageState.viewDetail || this.inputModel.autH_STATUS == 'A';
    }
    get rejectInput(): boolean {
        return this.editPageState == EditPageState.viewDetail && this.inputModel.autH_STATUS == 'U'
    }
    get disableSendAppr(): boolean {
        return this.editPageState == EditPageState.viewDetail || this.inputModel.autH_STATUS != 'E';
    }
//#endregion Status Page

//#region combobox and default filter

    // call in region constructor
    initDefaultFilter() {
        //this.initCombobox();  --> đóng lại để không cần load user
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

//#region modal
    // modal xe
    @ViewChild('vheVehicleModal') vheVehicleModal: VHEVehicleModalComponent;
    onShowVHEVehicleModal(): void {
        this.vheVehicleModal.filterInput.top = null;
        this.vheVehicleModal.show();
    }

    onSelectVHEVehicle(event: VHE_VEHICLE_ENTITY): void {
        if (event) {
            this.inputModel.vhE_VEHICLE_ID = event.vhE_VEHICLE_ID;
            this.inputModel.vhE_VEHICLE_CODE = event.vhE_VEHICLE_CODE;
            this.inputModel.vhE_VEHICLE_NAME = event.vhE_VEHICLE_NAME;
            this.updateView();
        }
    }
    onDeleteVHEVehicle(){
        this.inputModel.vhE_VEHICLE_ID = '';
        this.inputModel.vhE_VEHICLE_CODE = '';
        this.inputModel.vhE_VEHICLE_NAME = '';
        this.updateView();
    }

    // modal phiếu vận chuyển hàng hóa
    @ViewChild('freFreightModal') freFreightModal: FREFreightModalComponent;
    onShowFREFreightModal(): void {
        this.freFreightModal.filterInput.top = null;
        this.freFreightModal.show();
    }

    onSelectFREFreight(event: FRE_FREIGHT_ENTITY): void {
        if (event) {
            this.inputModel.frE_FREIGHT_ID = event.frE_FREIGHT_ID;
            this.inputModel.frE_FREIGHT_CODE = event.frE_FREIGHT_CODE;
            this.updateView();
        }
    }
    onDeleteFREFreight(){
        this.inputModel.frE_FREIGHT_ID = '';
        this.inputModel.frE_FREIGHT_CODE = '';
        this.updateView();
    }

    // user yêu cầu
    @ViewChild('tlUserModal') tlUserModal: TLUserModalComponent;
    onShowTLUserModal(): void {
        this.tlUserModal.filterInput.top = null;
        this.tlUserModal.show();
    }

    onSelectTLUser(event: TL_USER_ENTITY): void {
        if (event) {
            this.inputModel.useR_REQUEST_ID = event.tlnanme;
            this.inputModel.useR_REQUEST_NAME = event.tlFullName;
            this.updateView();
        }
    }
    onDeleteTLUser(){
        this.inputModel.useR_REQUEST_ID = '';
        this.inputModel.useR_REQUEST_NAME = '';
        this.updateView();
    }

    // Tài xế
    @ViewChild('vheDriverModal') vheDriverModal: VHEDriverModalComponent;
    onShowVHEDriverModal(): void {
        this.vheDriverModal.filterInput.top = null;
        this.vheDriverModal.show();
    }

    onSelecVHEDriver(event: VHE_DRIVER_ENTITY): void {
        if (event) {
            this.inputModel.driveR_ID = event.vhE_DRIVER_ID;
            this.inputModel.driveR_NAME = event.vhE_DRIVER_NAME;
            this.updateView();
        }
    }
    onDeleteVHEDriver(){
        this.inputModel.driveR_ID = '';
        this.inputModel.driveR_NAME = '';
        this.updateView();
    }
//#endregion modal



}
