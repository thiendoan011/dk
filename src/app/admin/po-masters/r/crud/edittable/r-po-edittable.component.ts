import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input, ViewChild, ViewEncapsulation } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { PoPOModalComponent } from "@app/admin/core/modal/module-po/po-po-modal/po-po-modal.component";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PRODUCT_PRODUCT_ENTITY, PO_ENTITY } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'r-po-edittable',
    templateUrl: './r-po-edittable.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [appModuleAnimation()]
})

export class RPOEdittableComponent extends ChangeDetectionComponent implements AfterViewInit {
    //#region "Constructor"
    constructor(
        injector: Injector,
    ) {
        super(injector);
    }

    _disableInput: boolean;
    @Input() set disableInput(value: boolean) {
        this._disableInput = value;
    }
    get disableInput(): boolean {
        return this._disableInput;
    }

    _inputModel: PRODUCT_PRODUCT_ENTITY;
    @Input() set inputModel(value: PRODUCT_PRODUCT_ENTITY) {
        this._inputModel = value;
    }
    get inputModel(): PRODUCT_PRODUCT_ENTITY {
        return this._inputModel;
    }
    //#endregion "Constructor"    

    @ViewChild('editTable') editTable: EditableTableComponent<PO_ENTITY>;

    ngOnInit(): void {
        this.updateView();
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    refreshTable() {
        this.updateView();
    }

    //#region popup PO modal
    onAdd(): void {
        this.showPopup();
    }

    onRemove(): void {
        this.editTable.removeAllCheckedItem();
        this.updateView();
    }
    @ViewChild('poPOModal') poPOModal: PoPOModalComponent;
    showPopup(): void {
        this.poPOModal.filterInput.r_ID = '';
        this.poPOModal.filterInput.typE_SEARCH = 'R';
        this.poPOModal.show();
        this.poPOModal.onSearch();
    }
    onSelectPopup(items: PO_ENTITY[]): void {
        items.forEach(x => {
            var item = new PO_ENTITY();
            item.pO_ID = x.pO_ID;
            item.pO_CODE = x.pO_CODE;
            item.pO_NAME = x.pO_NAME;
            item.exporT_DATE = x.exporT_DATE;
            item.pO_GROUP_PRODUCT_CODEs = x.pO_GROUP_PRODUCT_CODEs;
            item.creatE_DT = x.creatE_DT;
            item.qtY_CONT = x.qtY_CONT;
            item.customeR_NAME = x.customeR_NAME;
            item.cusT_PO = x.cusT_PO;

            this.editTable.allData.push(item);
        });

        this.editTable.resetNoAndPage();
        this.editTable.changePage(0);
        this.updateView();
    }
    //#endregion popup PO modal    

    //#region Hyperlink
    onViewDetailPO(item) {
        window.open("/app/admin/po-master-view;id=" + item.pO_ID);
    }
    onViewDetailGroupProduct(item) {
        window.open("/app/admin/po-group-product-view;id=" + item.grouP_PRODUCT_ID);
    }
    //#endregion Hyperlink    

}