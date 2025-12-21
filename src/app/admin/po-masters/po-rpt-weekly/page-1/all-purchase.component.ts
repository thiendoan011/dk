import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, ElementRef, AfterViewInit, Input } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PoPurchaseServiceProxy, PO_PRODUCTED_PART_ENTITY, PO_PRODUCT_ENTITY, PO_PURCHASE_ENTITY, PO_PURCHASE_ORDERS_ENTITY } from '@shared/service-proxies/service-proxies';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { NgForm } from '@angular/forms';
import * as moment from 'moment'
import { EditableTableComponent } from '@app/admin/core/controls/common/editable-table/editable-table.component';

@Component({
    templateUrl: './all-purchase.component.html',
    selector: 'all-purchase',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class AllPurchaseWeeklyComponent extends DefaultComponentBase {

    constructor(
        injector: Injector,
        private poPurchaseService: PoPurchaseServiceProxy
    ) {
        super(injector);
    }
    
    group_product_name: string = '';
    po_name: string = '';
    purchase_selected: string = '';
    
    @ViewChild('editForm') editForm: NgForm;
    @ViewChild('editTablePurchase') editTablePurchase: EditableTableComponent<PO_PURCHASE_ENTITY>;
    @ViewChild('editTablePurchaseState') editTablePurchaseState: EditableTableComponent<PO_PURCHASE_ORDERS_ENTITY>;

    getPoPurchase(id:any, po_id:any, purchase_name:any, po_name:any) {

        this.poPurchaseService.pO_Purchase_Dashboard_ById(id, po_id).subscribe(response => {
            this.purchase_selected = purchase_name;

            // Danh sách vật tư
			if (response.pO_PURCHASE_ORDERs && response.pO_PURCHASE_ORDERs.length > 0) {
				this.editTablePurchaseState.setList(response.pO_PURCHASE_ORDERs);
                this.editTablePurchaseState.updateView();
            }
            else{
                this.editTablePurchaseState.setList([]);
                this.editTablePurchaseState.updateView();
            }

            this.updateView();
        });

    }

}
