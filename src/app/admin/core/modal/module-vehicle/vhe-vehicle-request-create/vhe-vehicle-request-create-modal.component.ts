import { ViewEncapsulation, Injector, Component, Input } from "@angular/core";
import { PopupBaseComponent } from "@app/admin/core/ultils/popup-base.component";
import { VHE_VEHICLE_REQUEST_ENTITY, VHEVehicleRequestServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "vhe-vehicle-request-create-modal",
    templateUrl: "./vhe-vehicle-request-create-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class VHEVehicleRequestCreateModalComponent extends PopupBaseComponent<VHE_VEHICLE_REQUEST_ENTITY> {
    constructor(injector: Injector,
        private vehicleRequestService: VHEVehicleRequestServiceProxy) {
        super(injector);
        this.filterInput = new VHE_VEHICLE_REQUEST_ENTITY();
        this.keyMember = 'VHE_VEHICLE_REQUEST_ID';
        //default filter
        this.filterInput.useR_LOGIN = this.appSession.user.userName;

    }

    _title: string = '';
    @Input() set title(value: string) {
        this._title = value;
    }
    get title(): string {
        return this._title;
    }

    _disableInput:boolean = false;

    showAlert: boolean = true; // Hiển thị alert ban đầu

    saveInput() {
        if(!this.filterInput.frE_FREIGHT_ID) {
            this.onAdd();
        } else {
            this.onUpdate();
        }
    }

    onAdd(): void {
        this.saving = true;
        this.vehicleRequestService
        .vHE_VEHICLE_REQUEST_Ins(this.filterInput)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.filterInput.frE_FREIGHT_ID = res['ID'];
                this.showSuccessMessage(res['ErrorDesc']);
            }
        })
    }

    onUpdate(): void {
        this.saving = true;
        this.vehicleRequestService
        .vHE_VEHICLE_REQUEST_Upd(this.filterInput)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe((res) => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
            } else {
                this.updateSuccess();
            }
        });
    }

    removeAlter(){
        this.showAlert = false;
        this.cdr.detectChanges(); // Thông báo Angular cập nhật giao diện
    }
}
