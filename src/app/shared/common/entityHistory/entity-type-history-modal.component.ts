import { Component, Injector, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { Table, TableModule } from 'primeng/table';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';

import { AppComponentBase } from '@shared/common/app-component-base';
import { AuditLogServiceProxy, EntityChangeListDto } from '@shared/service-proxies/service-proxies';
import { EntityChangeDetailModalComponent } from './entity-change-detail-modal.component';
import { UtilsModule } from '@shared/utils/utils.module'; // Chứa busyIf, momentFormat
import { AppCommonModule } from '../app-common.module';

export interface IEntityTypeHistoryModalOptions {
    entityTypeFullName: string;
    entityTypeDescription: string;
    entityId: string;
}

@Component({
    selector: 'entityTypeHistoryModal',
    templateUrl: './entity-type-history-modal.component.html',
    standalone: true,
    imports: [
        CommonModule,
        ModalModule,
        TableModule,
        PaginatorModule,
        UtilsModule,     // Import module tiện ích (busyIf)
        AppCommonModule, // Import module chung (localize)
        EntityChangeDetailModalComponent // Component con standalone
    ]
})
export class EntityTypeHistoryModalComponent extends AppComponentBase {

    @ViewChild('entityChangeDetailModal') entityChangeDetailModal: EntityChangeDetailModalComponent;
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('dataTable') dataTable: Table;
    @ViewChild('paginator') paginator: Paginator;

    options: IEntityTypeHistoryModalOptions;
    isShown = false;
    isInitialized = false;
    filterText = '';
    tenantId?: number;
    entityHistoryEnabled: false;

    private readonly _auditLogService = inject(AuditLogServiceProxy);

    constructor(injector: Injector) {
        super(injector);
    }

    show(options: IEntityTypeHistoryModalOptions): void {
        this.options = options;
        this.modal.show();
    }

    refreshTable(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    close(): void {
        this.modal.hide();
    }

    shown(): void {
        this.isShown = true;
        this.getRecordsIfNeeds(null);
    }

    getRecordsIfNeeds(event?: any): void {
        if (!this.isShown) {
            return;
        }

        // Fix logic LazyLoadEvent của PrimeNG
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.getRecords(event);
        this.isInitialized = true;
    }

    getRecords(event?: any): void {
        this.primengTableHelper.showLoadingIndicator();

        this._auditLogService.getEntityTypeChanges(
            this.options.entityTypeFullName,
            this.options.entityId,
            0,
            this.primengTableHelper.getSorting(this.dataTable),
            this.appSession.user.subbrId,
            this.appSession.user.deP_ID,
            this.appSession.user.userName,
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)
        ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    showEntityChangeDetails(record: EntityChangeListDto): void {
        this.entityChangeDetailModal.show(record);
    }
}