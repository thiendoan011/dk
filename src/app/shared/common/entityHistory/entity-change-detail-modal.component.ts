import { Component, Injector, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import moment from 'moment';

import { AppComponentBase } from '@shared/common/app-component-base';
import { AuditLogServiceProxy, EntityChangeListDto, EntityPropertyChangeDto } from '@shared/service-proxies/service-proxies';
import { AppCommonModule } from '../app-common.module';
import { LocalizePipe } from "../../../../shared/common/pipes/localize.pipe";

@Component({
    selector: 'entityChangeDetailModal',
    templateUrl: './entity-change-detail-modal.component.html',
    standalone: true,
    imports: [
        CommonModule,
        ModalModule,
        AppCommonModule // Chứa localize pipe
        ,
        LocalizePipe
    ]
})
export class EntityChangeDetailModalComponent extends AppComponentBase {

    @ViewChild('entityChangeDetailModal') modal: ModalDirective;

    active = false;
    entityPropertyChanges: EntityPropertyChangeDto[];
    entityChange: EntityChangeListDto;

    // Inject service
    private readonly _auditLogService = inject(AuditLogServiceProxy);

    constructor(injector: Injector) {
        super(injector);
    }

    getPropertyChangeValue(propertyChangeValue, propertyTypeFullName) {
        if (!propertyChangeValue) {
            return propertyChangeValue;
        }
        propertyChangeValue = propertyChangeValue.replace(/^['"]+/g, '').replace(/['"]+$/g, '');
        if (this.isDate(propertyChangeValue, propertyTypeFullName)) {
            return moment(propertyChangeValue).format('YYYY-MM-DD HH:mm:ss');
        }

        if (propertyChangeValue === 'null') {
            return '';
        }

        return propertyChangeValue;
    }

    isDate(date, propertyTypeFullName): boolean {
        return propertyTypeFullName.includes('DateTime') && !isNaN(Date.parse(date).valueOf());
    }

    show(record: EntityChangeListDto): void {
        const self = this;
        self.active = true;
        self.entityChange = record;

        this._auditLogService.getEntityPropertyChanges(record.id).subscribe((result) => {
            self.entityPropertyChanges = result;
        });

        self.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}