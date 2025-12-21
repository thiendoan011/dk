import { AfterViewInit, Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { ListComponentBase } from "@app/ultilities/list-component-base";
import {HISTORY_ENTITY, RejectServiceProxy} from "@shared/service-proxies/service-proxies";
import * as moment from "moment";
import { ModalDirective } from "ngx-bootstrap";
import { finalize } from "rxjs/operators";
import { Select2CustomComponent } from "../custom-select2/select2-custom.component";

@Component({
	templateUrl: './cm-reject-modal.component.html',
	encapsulation: ViewEncapsulation.None,
	selector: 'cm-reject-modal'
})

export class CMRejectModalComponent extends ListComponentBase<HISTORY_ENTITY>
 implements OnInit, AfterViewInit {
    inputModel: HISTORY_ENTITY = new HISTORY_ENTITY();
    
    @ViewChild('popupFrameModal') modal: ModalDirective;
    @ViewChild('custom_combobox') custom_combobox:Select2CustomComponent

    @Output() onAcceptEvent : EventEmitter<any> = new EventEmitter<any>();
    
    waiting: boolean;
    active: boolean = false;
    rejectLogInput: HISTORY_ENTITY = new HISTORY_ENTITY();

    @Input() title: string = '';
    @Input() reason_title : string = 'Nội dung';
    
    onShowEvent : EventEmitter<any> = new EventEmitter<any>();

    constructor(injector: Injector,
        private rejectService : RejectServiceProxy,
        public ref : ElementRef) {
        super(injector);
        this.rejectLogInput.trN_TYPE = 'REQ_ADVANCE_PAY';
        this.rejectLogInput.stage = 'SUG';
        this.rejectLogInput.trN_ID = this.inputModel.trN_ID;
    }
    ngAfterViewInit(): void {
        
    }

    ngOnInit(): void {
        this.rejectLogInput.reason = ''
    }
    

    show() {
        this.active = true;
        this.modal.show();
    }

    onShown() {
        this.onShowEvent.emit(null);
    }

    close() {
        this.active = false;
        this.modal.hide();
    }

    onAccept(){
        this.rejectLogInput.loG_DT = moment();
        this.rejectLogInput.rejecteD_DT = moment();
        this.rejectLogInput.rejecteD_BY = this.appSession.user.userName;
        this.rejectLogInput.reason = this.rejectLogInput.reason;
        
        abp.ui.setBusy();
        this.rejectService.hISTORY_Ins(this.rejectLogInput)
            .pipe(
                finalize(() => {
                    abp.ui.clearBusy();
                })
            )
            .subscribe((res) => {

                if (res.Result != '0') {
                    this.showErrorMessage(res['ErrorDesc']);
                } else {
                    this.showSuccessMessage(res.ErrorDesc);
                    //them emit
                    this.onAcceptEvent.emit();
                    this.updateView();
                }
            });    

        this.close();
    }

    onCancel(){
        this.close();
    }
}