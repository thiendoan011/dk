import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PO_PRODUCTED_PART_ENTITY } from '@shared/service-proxies/service-proxies';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { NgForm } from '@angular/forms';

@Component({
    templateUrl: './part-embryo.component.html',
    selector: 'part-embryo',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PartEmbryoWeeklyComponent extends DefaultComponentBase {

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
