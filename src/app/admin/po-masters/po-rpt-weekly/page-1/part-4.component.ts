import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { PO_PRODUCTED_PART_ENTITY } from '@shared/service-proxies/service-proxies';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { NgForm } from '@angular/forms';
import { EditableTableComponent } from '@app/admin/core/controls/common/editable-table/editable-table.component';

@Component({
    templateUrl: './part-4.component.html',
    selector: 'part-4',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class Part4WeeklyComponent extends DefaultComponentBase {

    constructor(
        injector: Injector,
    ) {
        super(injector);
    }
    
    group_product_name: string = '';
    po_name: string = '';

    @ViewChild('editForm') editForm: NgForm;
    @ViewChild('editTableProductedPartDetail') editTableProductedPartDetail: EditableTableComponent<PO_PRODUCTED_PART_ENTITY>;
}
