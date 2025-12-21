
import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EditableTableComponent } from '@app/admin/core/controls/common/editable-table/editable-table.component';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { TTHistoryServiceProxy, TT_HISTORY_ENTITY } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'tt-reject-modal',
    templateUrl: './tt-reject-modal.component.html',
})

export class TTRejectModalComponent extends DefaultComponentBase implements OnInit {
    constructor(injector: Injector, 
        private historyService : TTHistoryServiceProxy,) {
        super(injector);
    }

    // required
    @Input() id: string;
    @Input() title: string = '';

    // option
    @Input() page: string = '';
    @Input() stage: string = '';
    @Input() process: string = '';

    @Input() showEnterRejectLog: boolean = false;
    @Input() showRejectLog: boolean = false;

    @Output() reject_out: EventEmitter<any> = new EventEmitter<any>();

    rejectLogInput: TT_HISTORY_ENTITY = new TT_HISTORY_ENTITY();
    rejectLatest: TT_HISTORY_ENTITY = new TT_HISTORY_ENTITY();
    rejectLog: TT_HISTORY_ENTITY[];

    @ViewChild('rejectTable') rejectTable: EditableTableComponent<TT_HISTORY_ENTITY>;

    ngOnInit() {
        this.getDetail();
    }

    getDetail(){
        this.getReject();
    }

// Lưới nhập lý do trả về
    onReject(type_reject: string) {
        // Phần data
        this.rejectLogInput.trN_ID = this.id;
        this.rejectLogInput.makeR_ID = this.appSession.user.userName;
        this.rejectLogInput.creatE_DT = moment();
        
        this.rejectLogInput.trN_PAGE = this.page;
        this.rejectLogInput.trN_STAGE = this.stage;

        if(type_reject == 'HC' && this.stage == 'HC'){
            this.rejectLogInput.process = 'REJECT';
        }
        else if(type_reject == 'HC' && this.stage == 'NS'){
            this.rejectLogInput.process = 'REJECT_HC';
        }
        else if(type_reject == 'NS' && this.stage == 'NS'){
            this.rejectLogInput.process = 'REJECT_NS';
        }
        else{
            this.showErrorMessage(this.l('Xảy ra lỗi khi từ chối phiếu! Vui lòng thực hiện lại sau hoặc liên hệ IT để được xử lý'));
            return;
        }


        if (!this.rejectLogInput.reason) {
            this.showErrorMessage(this.l('Vui lòng nhập nội dung xử lý trước khi gửi'));
            return;
        }
        abp.ui.setBusy();
        this.historyService.tT_HISTORY_Ins(this.rejectLogInput)
        .pipe(finalize(() => { abp.ui.clearBusy(); }))
        .subscribe((res) => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
            } else {
                this.showSuccessMessage(res['ErrorDesc']);

                this.getDetail();
                this.reject_out.emit(null);
                this.updateView();
            }
        });
    }


// Lưới lịch sử trả về
    @ViewChild('tableRejectLog') tableRejectLog: EditableTableComponent<TT_HISTORY_ENTITY>;

    _reject_infor: boolean = false;
    get reject_infor():boolean{
        return this._reject_infor;
    }

    getReject(): void {
        if(this.showRejectLog){
            this.historyService.tT_HISTORY_Search(this.id, this.page, this.stage, this.process, this.appSession.user.userName).subscribe(response => {

                if (response.length > 0) {
                    let rejectLasted = response[0];
                    this.rejectLatest.reason = rejectLasted.reason;
                    this.rejectLatest.creatE_DT = rejectLasted.creatE_DT;
                    this.rejectLatest.makeR_ID = rejectLasted.makeR_ID;
                    this._reject_infor = true;
                }
    
                this.tableRejectLog.setList(response);
                this.updateView();
            });
        }
        
    }
}
