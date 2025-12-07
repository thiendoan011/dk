import { Component, Injector, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PO_COSTSTATEMENT_HISTORY_ENTITY, PoCoststatementServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { PCPHistoryEdittableComponent } from '../po-coststatement-production-history/pcp-history-edittable.component';

@Component({
    templateUrl: './po-coststatement-history-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PoCostStatementHistoryEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit {
//#region constructor
    constructor(
        injector: Injector,
        private poCoststatementService: PoCoststatementServiceProxy,
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.coststatemenT_HISTORY_ID = this.getRouteParam('id');
    }

    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: PO_COSTSTATEMENT_HISTORY_ENTITY = new PO_COSTSTATEMENT_HISTORY_ENTITY();
    filterInput: PO_COSTSTATEMENT_HISTORY_ENTITY;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
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
        this.navigatePassParam('/app/admin/po-coststatement-history', null, { filterInput: JSON.stringify(this.filterInput) });
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

//#region "EditTable"
    getDataEditTables(){
        // Lịch sử yêu cầu
        this.inputModel.coststatemenT_HISTORY_DTs = this.pcphistoryedittable.editTable;
    }
    setDataEditTables(){
        // Lịch sử yêu cầu
        if(this.inputModel.coststatemenT_HISTORY_DTs && this.inputModel.coststatemenT_HISTORY_DTs.length > 0){
            this.pcphistoryedittable.editTable = this.inputModel.coststatemenT_HISTORY_DTs;
            // Chưa đóng và( đã xử xử hoặc đang xử lý)
            if(this.inputModel.iS_CLOSE && this.inputModel.iS_CLOSE == 'N'
            && this.inputModel.autH_STATUS && (this.inputModel.autH_STATUS == 'P' || this.inputModel.autH_STATUS == 'A')){
                this.pcphistoryedittable.onAddForResponse();
            }
        }
    }

    get isapp(): boolean{
        if(this.inputModel.iS_CLOSE && this.inputModel.iS_CLOSE == 'N'
        && this.inputModel.autH_STATUS && (this.inputModel.autH_STATUS == 'P' || this.inputModel.autH_STATUS == 'A')){
            return true;
        }
        else
        return false
    }

    // Lịch sử yêu cầu
    @ViewChild('pcphistoryedittable') pcphistoryedittable: PCPHistoryEdittableComponent;

//#endregion "EditTable"

//#region Status Page
    setViewToolBar(){
    }

    get disableInput(): boolean {
        return false;
    }
//#endregion Status Page
    onReCeceive(){
        this.getDataEditTables();
        this.inputModel.typE_SEND = 'CHECKER_RECEIVE'
        abp.ui.setBusy();
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
    onApp(){
        this.getDataEditTables();
        this.inputModel.typE_SEND = 'CHECKER_SEND'
        abp.ui.setBusy();
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
