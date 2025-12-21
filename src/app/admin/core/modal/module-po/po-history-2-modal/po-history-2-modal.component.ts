
import { Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { EditableTableComponent } from '@app/admin/core/controls/common/editable-table/editable-table.component';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { TTHistoryServiceProxy, PO_HISTORY_ENTITY, PoMasterServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'po-history-2-modal',
    templateUrl: './po-history-2-modal.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class POHistory2ModalComponent extends DefaultComponentBase implements OnInit {

    // required
    @Input() id: string;
    @Input() title: string = '';

    // option
    @Input() page: string = '';
    @Input() stage: string = '';
    @Input() process: string = '';

    constructor(injector: Injector, 
        private historyService : PoMasterServiceProxy,) {
        super(injector);
    }

    ngOnInit() {
        this.getDetail();
    }

    getDetail(){
        this.getProcess();
    }

    // Lưới lịch sử xử lý
    @ViewChild('tableProcessLog') tableProcessLog: EditableTableComponent<PO_HISTORY_ENTITY>;
    getProcess(): void {
        this.historyService
        .pO_HISTORY_2_Search(this.id, this.page, this.stage, this.process, this.appSession.user.userName)
        .subscribe(response => {
            this.tableProcessLog.setList(response);
            this.updateView();
        });
    }

}
