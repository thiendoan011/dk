
import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { HISTORY_ENTITY, PoMasterServiceProxy, PO_HISTORY_ENTITY, RejectServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { AuthStatusConsts } from '../../ultils/consts/AuthStatusConsts';
import { EditableTableComponent } from '../../controls/common/editable-table/editable-table.component';

@Component({
    selector: 'history-modal',
    templateUrl: './history-modal.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class HistoryModalComponent extends DefaultComponentBase implements OnInit {

    @Input() id: string;
    @Input() trN_TYPE: string;
    @Input() table: string;
    @Input() stage: string;
    @Input() showEnterRejectLog: boolean = false;
    @Input() showRejectLog: boolean = false;
    @Input() showProcessLog: boolean = false;
    @Input() rejectMessage: string;
    @Input() buttonRejectKT: boolean = false;
    @Input() rejectHC: boolean = false;
    @Input() autH_STATUS: AuthStatusConsts;
    @Output() reject_out: EventEmitter<any> = new EventEmitter<any>();
    
    isShowError: boolean = true;
    rejectLogInput: HISTORY_ENTITY = new HISTORY_ENTITY();
    rejectLogInput2: HISTORY_ENTITY = new HISTORY_ENTITY();
    rejectLog: HISTORY_ENTITY[];

    @ViewChild('rejectTable') rejectTable: EditableTableComponent<HISTORY_ENTITY>;

    constructor(injector: Injector, 
        private rejectService : RejectServiceProxy,) {
        super(injector);
    }

    ngOnInit() {
        this.getDetail();
    }

    getDetail(){
        this.getReject();
        this.getProcess();
    }

    // Lưới nhập lý do trả về
    onRejectHC() {
        // Phần data
        this.rejectLogInput.trN_ID = this.id;
        this.rejectLogInput.trN_TYPE = this.trN_TYPE;
        this.rejectLogInput.stage = this.stage;
        this.rejectLogInput.loG_DT = moment();
        this.rejectLogInput.rejecteD_DT = moment();
        this.rejectLogInput.rejecteD_BY = this.appSession.user.userName;
        this.rejectLogInput.reason = this.rejectLogInput.reason;
        if (!this.rejectLogInput.reason) {
            this.showErrorMessage(this.l('Vui lòng nhập nội dung xử lý trước khi gửi'));
            return;
        }
        abp.ui.setBusy();
        this.isShowError = false;
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

                this.getDetail();
                this.reject_out.emit(null);
                this.updateView();
            }
        });
    }

    onRejectKT() {
        // Phần data
        this.rejectLogInput.trN_TYPE = this.trN_TYPE;
        this.rejectLogInput.stage = this.stage;
        this.rejectLogInput.trN_ID = this.id;
        this.rejectLogInput.loG_DT = moment();
        this.rejectLogInput.rejecteD_DT = moment();
        this.rejectLogInput.rejecteD_BY = this.appSession.user.userName;
        this.rejectLogInput.reason = this.rejectLogInput.reason;
        if (!this.rejectLogInput.reason) {
            this.showErrorMessage(this.l('Vui lòng nhập nội dung xử lý trước khi gửi'));
            return;
        }
        abp.ui.setBusy();
        this.isShowError = false;
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

                this.getReject();
                this.reject_out.emit(null);
                this.updateView();
            }
        });
    }




    // Lưới lịch sử trả về
    @ViewChild('tableRejectLog') tableRejectLog: EditableTableComponent<HISTORY_ENTITY>;
    _reject_infor: boolean = false;
    get reject_infor():boolean{
        return this._reject_infor;
    }
    getReject(): void {
        if(this.showRejectLog){
            this.rejectService.hISTORY_Search(this.id, this.trN_TYPE, this.appSession.user.userName, 'REJECT').subscribe(response => {

                if (response.length > 0) {
                    let rejectLasted = response[0];
                    this.rejectLogInput2.latesteD_REASON = rejectLasted.reason;
                    this.rejectLogInput2.rejecteD_DT = rejectLasted.rejecteD_DT;
                    this.rejectLogInput2.rejecteD_BY = rejectLasted.rejecteD_BY;
                    this._reject_infor = true;
                }
    
                this.tableRejectLog.setList(response);
                this.updateView();
            });
        }
        
    }

    // Lưới lịch sử xử lý
    @ViewChild('tableProcessLog') tableProcessLog: EditableTableComponent<HISTORY_ENTITY>;
    getProcess(): void {
        this.rejectService.hISTORY_Search(this.id, this.trN_TYPE, this.appSession.user.userName, '').subscribe(response => {
            this.tableProcessLog.setList(response);
            this.updateView();
        });
    }

}
