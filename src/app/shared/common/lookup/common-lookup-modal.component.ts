import { Component, EventEmitter, Injector, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';

import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { NameValueDto, PagedResultDtoOfNameValueDto } from '@shared/service-proxies/service-proxies';
import { UtilsModule } from '@shared/utils/utils.module'; // Import module chứa busyIf, autoFocus

export interface ICommonLookupModalOptions {
    title?: string;
    isFilterEnabled?: boolean;
    dataSource: (skipCount: number, maxResultCount: number, filter: string, tenantId?: number) => Observable<PagedResultDtoOfNameValueDto>;
    canSelect?: (item: NameValueDto) => boolean | Observable<boolean>;
    loadOnStartup?: boolean;
    pageSize?: number;
}

@Component({
    selector: 'commonLookupModal',
    templateUrl: './common-lookup-modal.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ModalModule,
        TableModule,
        PaginatorModule,
        UtilsModule
    ],
    encapsulation: ViewEncapsulation.None
})
export class CommonLookupModalComponent extends AppComponentBase {

    static defaultOptions: ICommonLookupModalOptions = {
        dataSource: undefined,
        canSelect: () => true,
        loadOnStartup: true,
        isFilterEnabled: true,
        pageSize: AppConsts.grid.defaultPageSize
    };

    @ViewChild('modal', { static: true }) modal: ModalDirective;
    @ViewChild('paginator', { static: true }) paginator: any; // Fix type nếu Paginator không import được class
    @ViewChild('dataTable', { static: true }) dataTable: any; // Fix type

    @Output() itemSelected: EventEmitter<NameValueDto> = new EventEmitter<NameValueDto>();

    options: ICommonLookupModalOptions = _.merge({});
    filterText = '';
    tenantId?: number;
    active = false;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    configure(options: ICommonLookupModalOptions): void {
        this.options = _.merge({}, CommonLookupModalComponent.defaultOptions, options);
    }

    show(): void {
        this.active = true;
        this.modal.show();
    }

    refreshTable(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    shown(): void {
        if (this.options.loadOnStartup) {
            this.getRecordsIfNeeds(null);
        }
    }

    getRecordsIfNeeds(event?: any): void {
        if (!this.active) {
            return;
        }

        this.getRecords(event);
    }

    getRecords(event?: any): void {
        // Fix logic pagination
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        const maxResultCount = this.primengTableHelper.getMaxResultCount(this.paginator, event);
        const skipCount = this.primengTableHelper.getSkipCount(this.paginator, event);

        this.options
            .dataSource(skipCount, maxResultCount, this.filterText, this.tenantId)
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    selectItem(item: NameValueDto) {
        const boolOrPromise = this.options.canSelect(item);
        if (!boolOrPromise) {
            return;
        }

        if (boolOrPromise === true) {
            this.itemSelected.emit(item);
            this.close();
            return;
        }

        // assume as observable
        (boolOrPromise as Observable<boolean>)
            .subscribe(result => {
                if (result) {
                    this.itemSelected.emit(item);
                    this.close();
                }
            });
    }
}