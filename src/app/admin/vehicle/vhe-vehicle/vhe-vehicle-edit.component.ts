import { Component, Injector, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { VHE_VEHICLE_ENTITY, TL_USER_ENTITY, TlUserServiceProxy, VHEVehicleServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { VHEHistoryModalComponent } from '@app/admin/core/modal/module-vehicle/vhe-history-modal/vhe-history-modal.component';
import { VHERejectModalComponent } from '@app/admin/core/modal/module-vehicle/vhe-reject-modal/vhe-reject-modal.component';

@Component({
    templateUrl: './vhe-vehicle-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class VHEVehicleEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<VHE_VEHICLE_ENTITY> {
//#region constructor
    constructor(
        injector: Injector,
        private tlUserService: TlUserServiceProxy,
        private vehicleService: VHEVehicleServiceProxy
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.vhE_VEHICLE_ID = this.getRouteParam('id');
        this.initDefaultFilter();
    }

    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: VHE_VEHICLE_ENTITY = new VHE_VEHICLE_ENTITY();
    filterInput: VHE_VEHICLE_ENTITY;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.appToolbar.setRole('VHEVehicle', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.inputModel.autH_STATUS = 'E'
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('VHEVehicle', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('VHEVehicle', false, false, false, false, false, false, true, false);
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
        this.navigatePassParam('/app/admin/vhe-vehicle', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.vehicleService.vHE_VEHICLE_ById(this.inputModel.vhE_VEHICLE_ID).subscribe(response => {
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

        if(!this.inputModel.vhE_VEHICLE_ID) {
            this.onAdd();
        } else {
            this.onUpdate();
        }
    }

    onAdd(): void {
        this.saving = true;
        this.vehicleService
        .vHE_VEHICLE_Ins(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.inputModel.vhE_VEHICLE_ID = res['ID'];
                this.showSuccessMessage(res['ErrorDesc']);
                this.getDataPages();
                this.updateView();
            }
        })
    }

    onUpdate(): void {
        this.saving = true;
        this.vehicleService
        .vHE_VEHICLE_Upd(this.inputModel)
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

    onApprove(item: VHE_VEHICLE_ENTITY): void{
        this.message.confirm(
            this.l('ApproveWarningMessage', (this.inputModel.vhE_VEHICLE_ID)),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.vehicleService
                    .vHE_VEHICLE_App(this.inputModel.vhE_VEHICLE_ID, this.appSession.user.userName)
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
        this.vehicleService
        .vHE_VEHICLE_Upd(this.inputModel)
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
        return this.editPageState == EditPageState.viewDetail || this.inputModel.autH_STATUS == 'U' || this.inputModel.autH_STATUS == 'A';
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

}
