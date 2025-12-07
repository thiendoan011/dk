import { Component, Injector, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PO_COSTSTATEMENT_ENTITY, PO_COSTSTATEMENT_HISTORY_ENTITY, PO_GROUP_PRODUCT_ENTITY, PO_PRODUCT_ENTITY, PRODUCT_DETAIL_ENTITY, PRODUCT_GROUP_DETAIL_ENTITY, PoCoststatementServiceProxy, PoGroupProductServiceProxy, ProductProductServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { PCPHistoryEdittableComponent } from './pcp-history-edittable.component';
import { PoCoststatementModalComponent } from '@app/admin/core/modal/module-po/po-coststatement-modal/po-coststatement-modal.component';

@Component({
    templateUrl: './po-coststatement-production-history-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PoCostStatementProductionHistoryEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit {
//#region constructor
    constructor(
        injector: Injector,
        private poCoststatementService: PoCoststatementServiceProxy,
        private poGroupProductService: PoGroupProductServiceProxy,
        private productProductService: ProductProductServiceProxy,
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.coststatemenT_HISTORY_ID = this.getRouteParam('id');
    }

    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: PO_COSTSTATEMENT_HISTORY_ENTITY = new PO_COSTSTATEMENT_HISTORY_ENTITY();
    filterInput: PO_COSTSTATEMENT_HISTORY_ENTITY;

    inIt(){
        this.pcphistoryedittable.editTable = [];
        this.pcphistoryedittable.onAddForRequest();
    }

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.inIt();
                break;
            case EditPageState.edit:
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.getDataPages();
                break;
        }
    }

    ngAfterViewInit(): void {
        this.updateView();
    }
//#endregion constructor

//#region CRUD    
    goBack() {
        this.navigatePassParam('/app/admin/po-coststatement-production-history', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.poCoststatementService.pO_COSTSTATEMENT_HISTORY_ById(this.inputModel.coststatemenT_HISTORY_ID).subscribe(response => {
            // set data
            if (!response) this.goBack()
            this.inputModel = response;

            this.setDataEditTables();

            // set role, view button(detail at region Status Page)
            this.setViewToolBar();

            this.updateView();
        });
    }
//#endregion CRUD

//#region CRUD
    // Bảng chiết tính
    @ViewChild('poCoststatementModal') poCoststatementModal       : PoCoststatementModalComponent;
    showCostStatement(): void {
        this.poCoststatementModal.filterInput.autH_STATUS = 'A';
        this.poCoststatementModal.show();
        this.poCoststatementModal.search();
    }
    onSelectCoststatement(item: PO_COSTSTATEMENT_ENTITY){
        // Bảng chiết tính
        this.inputModel.coststatemenT_ID = item.coststatemenT_ID;
        this.inputModel.coststatemenT_CODE = item.coststatemenT_CODE;
        this.inputModel.coststatemenT_CODE = item.coststatemenT_NAME;

        // hệ hàng
        this.inputModel.grouP_PRODUCT_ID = item.grouP_PRODUCT_ID;

        this.updateView();
    }
    onViewDetailCostStatement(){
        window.open("/app/admin/po-coststatement-production-view;id="+ this.inputModel.coststatemenT_ID);
    }
    
    
//#endregion CRUD

//#region "EditTable"
    getDataEditTables(){
        // Lịch sử yêu cầu
        this.inputModel.coststatemenT_HISTORY_DTs = this.pcphistoryedittable.editTable;
    }
    setDataEditTables(){
        // Lịch sử yêu cầu
        if(this.inputModel.coststatemenT_HISTORY_DTs && this.inputModel.coststatemenT_HISTORY_DTs.length > 0){
            this.pcphistoryedittable.editTable = this.inputModel.coststatemenT_HISTORY_DTs;
            if(this.inputModel.iS_CLOSE && this.inputModel.iS_CLOSE == 'N'){
                this.pcphistoryedittable.onAddForRequest();
            }
        }
    }

    // Lịch sử yêu cầu
    @ViewChild('pcphistoryedittable') pcphistoryedittable: PCPHistoryEdittableComponent;

//#endregion "EditTable"

//#region Status Page
    setViewToolBar(){
    }

    get disableInput(): boolean {
        return this.editPageState == EditPageState.viewDetail;
    }
//#endregion Status Page

    onSend(){
        this.getDataEditTables();
        this.inputModel.typE_SEND = 'MAKER_SEND'
        abp.ui.setBusy();
        if(this.isNullOrEmpty(this.inputModel.coststatemenT_HISTORY_ID)){
            this.poCoststatementService
            .pO_COSTSTATEMENT_HISTORY_Ins(this.inputModel)
            .pipe(
                finalize(() => {
                    abp.ui.clearBusy();
                })
            )
            .subscribe((res) => {
                if (res['Result'] != '0') {
                    this.showErrorMessage(res['ErrorDesc']);
                } else {
                    this.showSuccessMessage(res['ErrorDesc']);
                    this.inputModel.coststatemenT_HISTORY_ID = res['ID'];
                    this.getDataPages();
                    this.updateView();
                }
            });
        }
        else{
            this.poCoststatementService
            .pO_COSTSTATEMENT_HISTORY_Upd(this.inputModel)
            .pipe(
                finalize(() => {
                    abp.ui.clearBusy();
                })
            )
            .subscribe((res) => {
                if (res['Result'] != '0') {
                    this.showErrorMessage(res['ErrorDesc']);
                } else {
                    this.showSuccessMessage(res['ErrorDesc']);
                    this.getDataPages();
                    this.updateView();
                }
            });
        }
        
    }
    
    onClose(){
    }
}
