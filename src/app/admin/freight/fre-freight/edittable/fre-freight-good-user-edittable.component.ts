import { AfterViewInit, Component, EventEmitter, Injector, Input, Output, ViewChild } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { TLUserModalComponent } from "@app/admin/core/modal/module-user/tl-user/tl-user-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { FRE_FREIGHT_ENTITY, FRE_FREIGHT_GOOD_USER_ENTITY, TL_USER_ENTITY } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'fre-freight-good-user-edittable',
	templateUrl: './fre-freight-good-user-edittable.component.html'
})

export class FREFreightGoodUserEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
//#region "Constructor"
    constructor(
        injector: Injector,
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

    @ViewChild('editTable') editTable: EditableTableComponent<FRE_FREIGHT_GOOD_USER_ENTITY>;

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

    //modal địa điểm đến
    @ViewChild('tlUserModal') tlUserModal: TLUserModalComponent;
    onShowTLUserModal() : void{
        //default value

        this.tlUserModal.show();
    }
    onSelectTLUserModal(event: TL_USER_ENTITY){
        let currentItem = this.editTable.currentItem;
        let dataCurrentItem = this.editTable.allData[this.editTable.allData.indexOf(currentItem)];
        dataCurrentItem.tlnamE_ID = event.tlnanme
        dataCurrentItem.tlnamE_DEP_NAME = event.deP_NAME
        dataCurrentItem.tlnamE_PHONE = event.phoneNumber
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

//#endregion Emit Event
}