import { AfterViewInit, Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { Select2CustomComponent } from "@app/admin/core/controls/common/custom-select2/select2-custom.component";
import { ListComponentBase } from "@app/ultilities/list-component-base";
import {TT_HISTORY_ENTITY, RejectServiceProxy, TTHistoryServiceProxy} from "@shared/service-proxies/service-proxies";
import * as moment from "moment";
import { ModalDirective } from "ngx-bootstrap";
import { finalize } from "rxjs/operators";

@Component({
	templateUrl: './tt-suggest-modal.component.html',
	encapsulation: ViewEncapsulation.None,
	selector: 'tt-suggest-modal'
})

export class TTSuggestModalComponent extends ListComponentBase<TT_HISTORY_ENTITY>
 implements OnInit, AfterViewInit {
    constructor(injector: Injector,
        private historyService : TTHistoryServiceProxy,
        public ref : ElementRef) {
        super(injector);
    }

    // required
    @Input() id: string;
    @Input() title: string = '';

    // option
    @Input() page: string = '';
    @Input() stage: string = '';
    @Input() process: string = '';

    @Output() onAcceptEvent : EventEmitter<any> = new EventEmitter<any>();
    
    @ViewChild('popupFrameModal') modal: ModalDirective;
    @ViewChild('custom_combobox') custom_combobox: Select2CustomComponent
    
    inputModel: TT_HISTORY_ENTITY = new TT_HISTORY_ENTITY();
    rejectLogInput: TT_HISTORY_ENTITY = new TT_HISTORY_ENTITY();
    waiting: boolean;
    active: boolean = false;
    
    onShowEvent : EventEmitter<any> = new EventEmitter<any>();
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
        // Phần data
        this.rejectLogInput.trN_ID = this.id;
        this.rejectLogInput.makeR_ID = this.appSession.user.userName;
        this.rejectLogInput.creatE_DT = moment();
        
        this.rejectLogInput.trN_PAGE = this.page;
        this.rejectLogInput.trN_STAGE = this.stage;
        this.rejectLogInput.process = this.process;
        
        abp.ui.setBusy();
        this.historyService.tT_HISTORY_Ins(this.rejectLogInput)
        .pipe(finalize(() => { abp.ui.clearBusy(); }))
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