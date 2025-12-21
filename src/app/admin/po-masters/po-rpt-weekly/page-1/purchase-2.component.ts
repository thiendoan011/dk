import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PO_PRODUCTED_PART_ENTITY, PO_PRODUCT_ENTITY, PO_PURCHASE_ORDERS_ENTITY } from '@shared/service-proxies/service-proxies';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { NgForm } from '@angular/forms';
import * as moment from 'moment'
import { EditableTableComponent } from '@app/admin/core/controls/common/editable-table/editable-table.component';

@Component({
    templateUrl: './purchase-2.component.html',
    selector: 'purchase-2',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class Purchase2WeeklyComponent extends DefaultComponentBase {

    constructor(
        injector: Injector,
    ) {
        super(injector);
    }
    
    group_product_name: string = '';
    po_name: string = '';
    
    @ViewChild('editForm') editForm: NgForm;
    @ViewChild('editTablePurchaseOrder') editTablePurchaseOrder: EditableTableComponent<PO_PURCHASE_ORDERS_ENTITY>;

}
