import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { AuthStatusConsts } from "@app/admin/core/ultils/consts/AuthStatusConsts";
import { ListComponentBase } from "@app/ultilities/list-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { LeaveNSServiceProxy, TT_LEAVE_ENTITY, TT_LEAVE_TRANSFER_ENTITY, PoCoststatementServiceProxy, TL_USER_ENTITY, TlUserServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    templateUrl: './leave-transfer-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class LeaveTransferListComponent extends ListComponentBase<TT_LEAVE_TRANSFER_ENTITY> implements OnInit, AfterViewInit {
    constructor(injector: Injector,
        private leaveNSService: LeaveNSServiceProxy,
        private userService: TlUserServiceProxy
    ) {
        super(injector);
    }
    filterInput: TT_LEAVE_TRANSFER_ENTITY = new TT_LEAVE_TRANSFER_ENTITY();

    @ViewChild('editTable') editTable: EditableTableComponent<TT_LEAVE_ENTITY>;

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
        this.filterInput.useR_LOGIN = this.appSession.user.userName;
        this.filterInput.leavEs = this.editTable.allData.filter(x => x['isChecked'] == true);

        this.filterInput.leavEs.forEach(x => {
            x.checkeR2_ID = this.appSession.user.userName;
        });

        this.leaveNSService.tT_LEAVE_NS_Transfer_Upd(this.filterInput)
        .pipe(finalize(() => {this.saving = false;}))
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
        this.filterInputSearch.useR_LOGIN = this.appSession.user.userName;
        abp.ui.setBusy();

        this.leaveNSService
        .tT_LEAVE_NS_Transfer_Search(this.filterInputSearch)
        .pipe(finalize(() => abp.ui.clearBusy()))
        .subscribe((res) => {
            this.editTable.setList(res);
            this.updateView();
        });
    }

    onResetSearch(): void {
        this.filterInput = new TT_LEAVE_TRANSFER_ENTITY();
        this.updateView();
    }

    onViewDetail(item: TT_LEAVE_TRANSFER_ENTITY): void {
        //window.open("/app/admin/req-temp-pay-list-kt-view;id="+item.coststatemenT_HISTORY_ID);
        
    }

    refreshPage(e): void {
        this.filterInput = new TT_LEAVE_TRANSFER_ENTITY();
        this.editTable.setList([]);
        
        this.updateView();
    }
    
    userList: TL_USER_ENTITY[] = [];
    getUserList(): void {
        let filter_user = this.getFillterForCombobox();
        filter_user.tlsubbrid = this.appSession.user.subbrId;
        filter_user.deP_ID = this.appSession.user.deP_ID;
        filter_user.level = 'ALL';
        this.userService.tL_USER_COMBOBOX_Search(filter_user).subscribe(res => {
            this.userList = res.items;
            this.updateView();
        });
    }

    onClickRow(event): void {
    }

    onUpdate(item: TT_LEAVE_TRANSFER_ENTITY): void {}
    onAdd(): void {}
    onDelete(item: TT_LEAVE_TRANSFER_ENTITY): void { }
    onApprove(item: TT_LEAVE_TRANSFER_ENTITY): void { }
}
