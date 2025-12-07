
import { Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { HISTORY_ENTITY, RejectServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditableTableComponent } from '../../controls/common/editable-table/editable-table.component';

@Component({
    selector: 'history-2-modal',
    templateUrl: './history-2-modal.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class History2ModalComponent extends DefaultComponentBase implements OnInit {

    // required
    @Input() id: string;
    @Input() title: string = '';

    @Input() trN_TYPE: string = '';  // để trống nếu lấy tất cả lịch sử
    @Input() stage: string = '';
    @Input() process: string = '';

    constructor(injector: Injector, 
        private rejectService : RejectServiceProxy,) {
        super(injector);
    }

    ngOnInit() {
        this.getDetail();
    }

    getDetail(){
        this.getProcess();
    }

    // Lưới lịch sử xử lý
    @ViewChild('tableProcessLog') tableProcessLog: EditableTableComponent<HISTORY_ENTITY>;
    getProcess(): void {
        this.rejectService.hISTORY_2_Search(this.id, this.trN_TYPE, this.stage, this.appSession.user.userName, this.process).subscribe(response => {
            this.tableProcessLog.setList(response);
            this.updateView();
        });
    }

}
