
import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { EditableTableComponent } from '@app/admin/core/controls/common/editable-table/editable-table.component';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PoMasterServiceProxy, PO_HISTORY_ENTITY, RejectServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'po-history-modal',
    templateUrl: './po-history-modal.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class POHistoryModalComponent extends DefaultComponentBase implements OnInit {

    @Input() id: string;
    @Input() process_id: string = '';
    @Input() trN_TYPE: string;
    @Input() stage: string;
    @Input() isShowEnterRejectContent: boolean = false;
    @Input() rejectMessage: string;
    @Input() buttonRejectKT: boolean = false;
    @Input() rejectHC: boolean = false;
    @Input() autH_STATUS: AuthStatusConsts;
    @Input() title: string = 'Bấm vào đây để xem lịch sử xử lý';

    @Output() rejectLabel: EventEmitter<any> = new EventEmitter<any>();
    
    isShowError: boolean = true;
    rejectLogInput: PO_HISTORY_ENTITY = new PO_HISTORY_ENTITY();
    rejectLogInput2: PO_HISTORY_ENTITY = new PO_HISTORY_ENTITY();
    rejectLog: PO_HISTORY_ENTITY[];

    @ViewChild('rejectTable') rejectTable: EditableTableComponent<PO_HISTORY_ENTITY>;

    constructor(injector: Injector, 
        private poMasterService: PoMasterServiceProxy,) {
        super(injector);
    }

    ngOnInit() {
        this.getReject();
    }

    // Thêm mới một tin nhắn
    onIns() {
        this.rejectLogInput.trN_TYPE = this.trN_TYPE;
        this.rejectLogInput.stage = this.stage;
        this.rejectLogInput.trN_ID = this.id;
        this.rejectLogInput.loG_DT = moment();
        this.rejectLogInput.rejecteD_DT = moment();
        this.rejectLogInput.rejecteD_BY = this.appSession.user.userName;
        this.rejectLogInput.reason = this.rejectLogInput.reason;
        this.rejectLogInput.department = this.appSession.user.deP_NAME;
        if (!this.rejectLogInput.reason) {
            this.showErrorMessage(this.l('Vui lòng nhập nội dung xử lý trước khi gửi'));
            return;
        }
        abp.ui.setBusy();
        this.isShowError = false;
        this.poMasterService.pO_HISTORY_Ins(this.rejectLogInput)
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
                    //this.autH_STATUS = AuthStatusConsts.Reject;
                    //this.isShowEnterRejectContent = false;

                    this.getReject();
                    this.rejectLabel.emit(null);
                    this.updateView();
                }
            });
    }


    @ViewChild('tableProcessLog') tableProcessLog: EditableTableComponent<PO_HISTORY_ENTITY>;

    getReject(): void {
        this.poMasterService.pO_HISTORY_Search(this.id, this.process_id, this.appSession.user.userName).subscribe(response => {

            if (response.length > 0) {
                let rejectLasted = response[0];
                this.rejectLogInput2.lasteD_REASON = rejectLasted.procesS_DESC;
                this.rejectLogInput2.rejecteD_BY = rejectLasted.checkeR_NAME;
            }

            this.tableProcessLog.setList(response);
            this.updateView();
        });
    }

}
