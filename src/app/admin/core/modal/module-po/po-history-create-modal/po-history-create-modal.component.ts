
import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PoMasterServiceProxy, PO_HISTORY_ENTITY } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'po-history-create-modal',
    templateUrl: './po-history-create-modal.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class POHistoryCreateModalComponent extends DefaultComponentBase implements OnInit {

    constructor(injector: Injector, 
        private poMasterService: PoMasterServiceProxy,) {
        super(injector);
    }

    // required
    @Input() type: string = ''; // dùng để phân biệt các chức năng trong 1 PO
    @Input() id: string = '';
    @Input() page: string = ''; 
    @Input() stage: string = '';
    @Input() process: string = '';
    @Input() process_desc: string = ''; 
    @Input() title: string = '';
    // option
    @Output() complete: EventEmitter<any> = new EventEmitter<any>(); // dùng để handle việc gửi thành công
    
    inputModel: PO_HISTORY_ENTITY = new PO_HISTORY_ENTITY();

    ngOnInit() {}
    
    onIns() {
        this.inputModel.trN_TYPE = this.type;
        this.inputModel.trN_ID = this.id;
        this.inputModel.trN_PAGE = this.page;
        this.inputModel.trN_STAGE = this.stage;
        this.inputModel.makeR_ID = this.appSession.user.userName;
        this.inputModel.creatE_DT = moment();
        this.inputModel.process = this.process;
        this.inputModel.procesS_DESC = this.process_desc;

        if (!this.inputModel.reason) {
            this.showErrorMessage(this.l('Vui lòng nhập nội dung xử lý trước khi gửi'));
            return;
        }

        abp.ui.setBusy();
        this.poMasterService.pO_HISTORY_Ins(this.inputModel)
            .pipe( finalize(() => { abp.ui.clearBusy(); }) )
            .subscribe((res) => {
                if (res.Result != '0') {
                    this.showErrorMessage(res['ErrorDesc']);
                } else {
                    this.showSuccessMessage(res['ErrorDesc']);
                    this.complete.emit(null);
                    this.updateView();
                }
            });
    }

}
