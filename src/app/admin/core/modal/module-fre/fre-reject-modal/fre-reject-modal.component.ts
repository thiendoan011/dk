
import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EditableTableComponent } from '@app/admin/core/controls/common/editable-table/editable-table.component';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { FREHistoryServiceProxy, HISTORY_DTO, TT_HISTORY_ENTITY } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'fre-reject-modal',
    templateUrl: './fre-reject-modal.component.html',
})

export class FRERejectModalComponent extends DefaultComponentBase implements OnInit {
    constructor(injector: Injector, 
        private historyService : FREHistoryServiceProxy,) {
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

    rejectLogInput: HISTORY_DTO = new HISTORY_DTO();
    rejectLatest: HISTORY_DTO = new HISTORY_DTO();
    rejectLog: HISTORY_DTO[];

    @ViewChild('rejectTable') rejectTable: EditableTableComponent<HISTORY_DTO>;

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
        
        //truyền từ component cha xuống
        this.rejectLogInput.trN_PAGE = this.page;
        this.rejectLogInput.trN_STAGE = this.stage;
        this.rejectLogInput.process = this.process;


        if (!this.rejectLogInput.reason) {
            this.showErrorMessage(this.l('Vui lòng nhập nội dung xử lý trước khi gửi'));
            return;
        }
        abp.ui.setBusy();
        this.historyService.fRE_HISTORY_Ins(this.rejectLogInput)
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
    @ViewChild('tableRejectLog') tableRejectLog: EditableTableComponent<HISTORY_DTO>;

    _reject_infor: boolean = false;
    get reject_infor():boolean{
        return this._reject_infor;
    }

    getReject(): void {
        if(this.showRejectLog){
            this.historyService.fRE_HISTORY_Search(this.id, this.page, this.stage, this.process, this.appSession.user.userName).subscribe(response => {

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
