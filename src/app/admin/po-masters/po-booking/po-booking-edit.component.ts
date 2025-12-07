import { Component, Injector, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PO_BOOKING_ENTITY, PoBookingServiceProxy, PoMasterServiceProxy, PoUtilitiesServiceProxy, TL_USER_ENTITY, TlUserServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { POBookingPOEdittableComponent } from './edittable/po-booking-po-edittable.component';
import { POHistory2ModalComponent } from '@app/admin/core/modal/module-po/po-history-2-modal/po-history-2-modal.component';

@Component({
    templateUrl: './po-booking-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class POBookingEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<PO_BOOKING_ENTITY> {
//#region constructor
    constructor(
        injector: Injector,
        private poUtilitiesService      : PoUtilitiesServiceProxy,
        private tlUserService:TlUserServiceProxy,
        private poBookingService: PoBookingServiceProxy
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.pO_BOOKING_ID = this.getRouteParam('id');
        this.initDefaultFilter();
    }

    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: PO_BOOKING_ENTITY = new PO_BOOKING_ENTITY();
    filterInput: PO_BOOKING_ENTITY;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.appToolbar.setRole('POBooking', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();

                this.inputModel.autH_STATUS = 'U'
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('POBooking', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('POBooking', false, false, false, false, false, false, true, false);
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
        this.navigatePassParam('/app/admin/po-booking', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.poBookingService.pO_BOOKING_ById(this.inputModel.pO_BOOKING_ID).subscribe(response => {
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

        if(!this.inputModel.pO_BOOKING_ID) {
            this.onAdd();
        } else {
            this.onUpdate();
        }
    }

    onAdd(): void {
        this.saving = true;
        this.poBookingService
        .pO_BOOKING_Ins(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.inputModel.pO_BOOKING_ID = res['ID'];
                this.showSuccessMessage(res['ErrorDesc']);
                this.getDataPages();
                this.updateView();
            }
        })
    }

    onUpdate(): void {
        this.saving = true;
        this.poBookingService
        .pO_BOOKING_Upd(this.inputModel)
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

    onApprove(item: PO_BOOKING_ENTITY): void{
        this.message.confirm(
            this.l('ApproveWarningMessage', (this.inputModel.pO_BOOKING_ID)),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.poBookingService
                    .pO_BOOKING_App(this.inputModel.pO_BOOKING_ID)
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
    RequestHandOver(){
        this.message.confirm(
            this.l('Bàn giao Booking: ' + this.inputModel.pO_BOOKING_NAME),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.poUtilitiesService.pO_UTILITIES_Handover(this.inputModel.pO_BOOKING_ID, this.appSession.user.userName, this.inputModel.makE_HANDOVER, 'PO_BOOKING')
                    .pipe(finalize(() => {this.saving = false;}))
                        .subscribe((res) => {
                            if (
                                res["Result"] != "0") {
                                this.showErrorMessage(res["ErrorDesc"]);
                                
                            } else {
                                this.showSuccessMessage(res["ErrorDesc"]);
                                setTimeout(() => {
                                this.goBack();
                                }, 2000);
                            }
                        
                        });
                }
            }
        );
  
    }
//#endregion CRUD

//#region "EditTable"
    getDataEditTables(){
        // PO
        this.inputModel.pO_BOOKING_POs = this.poBookingPOEdittable.editTable.allData;
    }
    setDataEditTables(){
        // PO
        if (this.inputModel.pO_BOOKING_POs && this.inputModel.pO_BOOKING_POs.length > 0) {
            this.poBookingPOEdittable.editTable.setList(this.inputModel.pO_BOOKING_POs);
            this.poBookingPOEdittable.refreshTable();
        }
    }

    // PO
    @ViewChild('poBookingPOEdittable') poBookingPOEdittable: POBookingPOEdittableComponent;
    // lịch sử xử lý
    @ViewChild('history_modal') history_modal: POHistory2ModalComponent;
    
//#endregion "EditTable"

//#region Status Page
    setViewToolBar(){
        // Button lưu
        if(this.editPageState == EditPageState.viewDetail){
            this.appToolbar.setButtonSaveEnable(false);
        }
        else{
            if(this.inputModel.pO_BOOKING_ID != AuthStatusConsts.Approve){
                this.appToolbar.setButtonSaveEnable(true);
            }
            else{
                this.appToolbar.setButtonSaveEnable(false);
            }
        }

        // Button duyệt
        if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
            this.appToolbar.setButtonApproveEnable(false);
            this.appToolbar.setButtonSaveEnable(false);
        }
    }

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
            this._users= this._users.filter(x=>x.tlnanme!=this.appSession.user.userName);
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
