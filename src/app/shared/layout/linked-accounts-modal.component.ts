import { Component, EventEmitter, Injector, Output, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbpMultiTenancyService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LinkedUserDto, UnlinkUserInput, UserLinkServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { Table, TableModule } from 'primeng/table';
import { LinkAccountModalComponent } from './link-account-modal.component';
import { LinkedAccountService } from './linked-account.service';
import { UtilsModule } from '@shared/utils/utils.module'; // Cho busyIf directive

@Component({
    selector: 'linkedAccountsModal',
    templateUrl: './linked-accounts-modal.component.html',
    standalone: true,
    imports: [
        CommonModule,
        ModalModule,
        TableModule,
        PaginatorModule,
        UtilsModule,
        LinkAccountModalComponent
    ]
})
export class LinkedAccountsModalComponent extends AppComponentBase {

    @ViewChild('linkedAccountsModal') modal: ModalDirective;
    @ViewChild('linkAccountModal') linkAccountModal: LinkAccountModalComponent;
    @ViewChild('dataTable') dataTable: Table;
    @ViewChild('paginator') paginator: Paginator;

    @Output() modalClose: EventEmitter<any> = new EventEmitter<any>();

    private readonly _userLinkService = inject(UserLinkServiceProxy);
    private readonly _linkedAccountService = inject(LinkedAccountService);
    public readonly abpMultiTenancyService = inject(AbpMultiTenancyService);

    constructor(injector: Injector) {
        super(injector);
    }

    getLinkedUsers(event?: any): void {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._userLinkService.getLinkedUsers(
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getSorting(this.dataTable)
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    getShownUserName(linkedUser: LinkedUserDto): string {
        if (!this.abpMultiTenancyService.isEnabled) {
            return linkedUser.username;
        }
        return (linkedUser.tenantId ? linkedUser.tenancyName : '.') + '\\' + linkedUser.username;
    }

    deleteLinkedUser(linkedUser: LinkedUserDto): void {
        this.message.confirm(
            this.l('LinkedUserDeleteWarningMessage', linkedUser.username),
            this.l('AreYouSure'),
            isConfirmed => {
                if (isConfirmed) {
                    const unlinkUserInput = new UnlinkUserInput();
                    unlinkUserInput.userId = linkedUser.id;
                    unlinkUserInput.tenantId = linkedUser.tenantId;

                    this._userLinkService.unlinkUser(unlinkUserInput).subscribe(() => {
                        this.reloadPage();
                        this.notify.success(this.l('SuccessfullyUnlinked'));
                    });
                }
            }
        );
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    manageLinkedAccounts(): void {
        this.linkAccountModal.show();
    }

    switchToUser(linkedUser: LinkedUserDto): void {
        this._linkedAccountService.switchToAccount(linkedUser.id, linkedUser.tenantId);
    }

    show(): void {
        this.modal.show();
    }

    close(): void {
        this.modal.hide();
        this.modalClose.emit(null);
    }
}