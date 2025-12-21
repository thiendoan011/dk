
import { Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { EditableTableComponent } from '@app/admin/core/controls/common/editable-table/editable-table.component';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { HISTORY_DTO, ProductUtilitiesServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'product-history-modal',
    templateUrl: './product-history-modal.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class ProductHistoryModalComponent extends DefaultComponentBase implements OnInit {

    // required
    @Input() id: string;
    @Input() title: string = '';

    // option
    @Input() page: string = '';
    @Input() stage: string = '';
    @Input() process: string = '';

    constructor(injector: Injector, 
        private historyService : ProductUtilitiesServiceProxy,) {
        super(injector);
    }

    ngOnInit() {
        this.getDetail();
    }

    getDetail(){
        this.getProcess();
    }

    // Lưới lịch sử xử lý
    @ViewChild('tableProcessLog') tableProcessLog: EditableTableComponent<HISTORY_DTO>;
    getProcess(): void {
        this.historyService
        .pRODUCT_HISTORY_Search(this.id, this.page, this.stage, this.process, this.appSession.user.userName)
        .subscribe(response => {
            this.tableProcessLog.setList(response);
            this.updateView();
        });
    }

}
