import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { AuthStatusConsts } from "@app/admin/core/ultils/consts/AuthStatusConsts";
import { ListComponentBase } from "@app/ultilities/list-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PO_COSTSTATEMENT_HISTORY_ENTITY, PO_COSTSTATEMENT_HISTORY_TRANSFER_ENTITY, PoCoststatementServiceProxy, TL_USER_ENTITY, TlUserServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    templateUrl: './po-coststatement-history-transfer-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class POCostStatementHistoryTransferListComponent extends ListComponentBase<PO_COSTSTATEMENT_HISTORY_TRANSFER_ENTITY> implements OnInit, AfterViewInit {
    constructor(injector: Injector,
        private poCoststatementService: PoCoststatementServiceProxy,
        private userService: TlUserServiceProxy
    ) {
        super(injector);
    }
    filterInput: PO_COSTSTATEMENT_HISTORY_TRANSFER_ENTITY = new PO_COSTSTATEMENT_HISTORY_TRANSFER_ENTITY();

    @ViewChild('editTable') editTable: EditableTableComponent<PO_COSTSTATEMENT_HISTORY_ENTITY>;

    ngOnInit(): void {
        this.getUserList();
        this.editTable.allData = [];
    }

    ngAfterViewInit(): void {
        this.filterInput.iS_TRANSFER = 'N';
        this.updateView();
    }

    saveInput(): void {

        if (this.editTable.allData.filter(x => x['isChecked'] == true).length == 0) {
            this.showErrorMessage(this.l('Vui lòng tích chọn vào ô checkbox đầu dòng để chọn ít nhất 1 phiếu yêu cầu xử lý'));
            this.updateView();
            return;
        }

        this.saving = true;
        this.filterInput.coststatemenT_HISTORYs = this.editTable.allData.filter(x => x['isChecked'] == true);

        this.filterInput.coststatemenT_HISTORYs.forEach(x => {
            x.transfeR_ID = this.appSession.user.userName;
        });

        this.poCoststatementService.pO_COSTSTATEMENT_HISTORY_TRANSFER_Upd(this.filterInput)
        .pipe(
            finalize(() => {
                this.saving = false;
            })
        )
        .subscribe(res => {
            if (res['Result'] != 0) {
                this.showErrorMessage(res['ErrorDesc']);
            } 
            else {
                this.showSuccessMessage(res['ErrorDesc']);
                this.updateView();
            }
        })

    }

    onSearch(): void {
        this.copyFilterInput();
        this.search();
    }
    search(): void {
        abp.ui.setBusy();
        this.filterInputSearch.maxResultCount = -1;
        this.filterInputSearch.totalCount = this.isNull(this.filterInputSearch.totalCount) ? 0 : this.filterInputSearch.totalCount;
        this.filterInputSearch.skipCount = 0;

        this.poCoststatementService
        .pO_COSTSTATEMENT_HISTORY_TRANSFER_Search(this.filterInputSearch)
        .pipe(finalize(() => abp.ui.clearBusy()))
        .subscribe((res) => {
            this.editTable.setList(res);
            this.updateView();
        });
    }

    onResetSearch(): void {
        this.filterInput = new PO_COSTSTATEMENT_HISTORY_TRANSFER_ENTITY();
        this.filterInput.creatE_DT = undefined;
        this.updateView();
    }

    onViewDetail(item: PO_COSTSTATEMENT_HISTORY_TRANSFER_ENTITY): void {
        window.open("/app/admin/req-temp-pay-list-kt-view;id="+item.coststatemenT_HISTORY_ID);
        
    }

    refreshPage(e): void {
        this.filterInput = new PO_COSTSTATEMENT_HISTORY_TRANSFER_ENTITY();
        this.editTable.setList([]);
        
        this.updateView();
    }
    
    userList: TL_USER_ENTITY[] = [];
    getUserList(): void {
        var filter = new TL_USER_ENTITY();
        filter.maxResultCount = -1,
        filter.autH_STATUS = AuthStatusConsts.Approve;
        filter.tlsubbrid = this.appSession.user.subbrId;
        filter.deP_ID = this.appSession.user.deP_ID;
        filter.level = 'UNIT';
        
        this.userService.tL_USER_Search(filter).subscribe(res => {
            this.userList = res.items;
            this.updateView();
        })
    }

    onClickRow(event): void {
    }

    onUpdate(item: PO_COSTSTATEMENT_HISTORY_TRANSFER_ENTITY): void {}
    onAdd(): void {}
    onDelete(item: PO_COSTSTATEMENT_HISTORY_TRANSFER_ENTITY): void { }
    onApprove(item: PO_COSTSTATEMENT_HISTORY_TRANSFER_ENTITY): void { }
}
