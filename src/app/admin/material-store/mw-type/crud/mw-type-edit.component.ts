import { Component, Injector, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AsposeServiceProxy, CM_UNIT_ENTITY, MW_GROUP_ENTITY, MW_TYPE_ENTITY, MW_WAREHOUSE_ENTITY, MWGroupServiceProxy, MWTypeServiceProxy, MWWarehouseServiceProxy, UnitServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { MWTypeSupplierPriceEdittableComponent } from './edittable/mw-type-supplier-price-edittable.component';

@Component({
    templateUrl: './mw-type-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class MWTypeEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<MW_TYPE_ENTITY> {
//#region constructor
    constructor(
        injector: Injector,
        private mwTypeService: MWTypeServiceProxy,
        private asposeService: AsposeServiceProxy,
        private fileDownloadService: FileDownloadService,
        private mwGroupService: MWGroupServiceProxy,
        private unitService: UnitServiceProxy
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.mW_TYPE_ID = this.getRouteParam('id');
        this.initDefaultFilter();
    }

    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: MW_TYPE_ENTITY = new MW_TYPE_ENTITY();
    filterInput: MW_TYPE_ENTITY;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.appToolbar.setRole('MWType', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('MWType', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('MWType', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getDataPages();
                break;
        }
        this.appToolbar.setUiActionEdit(this);
    }

    ngAfterViewInit(): void {
        this.updateView();
    }
//#endregion constructor

//#region CRUD    
    goBack() {
        this.navigatePassParam('/app/admin/mw-type', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.mwTypeService.mW_TYPE_ById(this.inputModel.mW_TYPE_ID).subscribe(response => {
            // set data
            if (!response) this.goBack()
            this.inputModel = response;

            this.setDataEditTables();

            // set role, view button(detail at region Status Page)
            this.setViewToolBar();

            this.updateView();
        });
    }

    onSave(): void {
        this.saveInput();
    }

    saveInput() {
        
        this.getDataEditTables();

        if(this.editPageState != EditPageState.viewDetail) {
            if(!this.inputModel.mW_TYPE_ID) {
                this.onAdd();
            } else {
                this.onUpdate();
            }
        } 
    }

    onAdd(): void {
        this.saving = true;
        this.mwTypeService
        .mW_TYPE_Ins(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.inputModel.mW_TYPE_ID = res['ID'];
                this.showSuccessMessage(res['ErrorDesc']);
                this.getDataPages();
                this.updateView();
            }
        })
    }

    onUpdate(): void {
        this.saving = true;
        this.mwTypeService
        .mW_TYPE_Upd(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe((res) => {
            if (res['Result'] != '0') {
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.updateSuccess();
                this.getDataPages();
                this.updateView();
            }
        });
    }

    onApprove(item: MW_TYPE_ENTITY): void{
        this.message.confirm(
            this.l('ApproveWarningMessage', (this.inputModel.mW_TYPE_CODE)),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.mwTypeService
                    .mW_TYPE_App(this.inputModel.mW_TYPE_ID, this.appSession.user.userName)
                    .pipe(finalize(() => {this.saving = false}))
                    .subscribe((res) => {
                        if (res['Result'] != '0') {
                            this.showErrorMessage(res['ErrorDesc']);
                            this.updateView();
                        } 
                        else {
                            this.approveSuccess();
                            this.getDataPages();
                            this.updateView();
                        }
                    });
                }
            }
        );
    }
//#endregion CRUD

//#region "EditTable"
    getDataEditTables(){
        // Thông tin báo giá cho khách
        this.inputModel.mW_TYPE_SUPPLIER_PRICEs = this.mwTypeSupplierPriceEditTable.editTable.allData;
    }
    setDataEditTables(){
        // Thông tin báo giá cho khách
        if (this.inputModel.mW_TYPE_SUPPLIER_PRICEs && this.inputModel.mW_TYPE_SUPPLIER_PRICEs.length > 0) {
            this.mwTypeSupplierPriceEditTable.editTable.setList(this.inputModel.mW_TYPE_SUPPLIER_PRICEs);
            this.mwTypeSupplierPriceEditTable.refreshTable();
        }
    }

    // Thông tin báo giá cho khách
    @ViewChild('mwTypeSupplierPriceEditTable') mwTypeSupplierPriceEditTable: MWTypeSupplierPriceEdittableComponent;

//#endregion "EditTable"


//#region Status Page
    setViewToolBar(){
        // Button lưu
        if(this.editPageState == EditPageState.viewDetail){
            this.appToolbar.setButtonSaveEnable(false);
        }
        else{
            if(this.inputModel.mW_TYPE_ID != AuthStatusConsts.Approve){
                this.appToolbar.setButtonSaveEnable(true);
            }
            else{
                this.appToolbar.setButtonSaveEnable(false);
            }
        }

        // Button duyệt
        if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
            this.appToolbar.setButtonApproveEnable(false);
            this.appToolbar.setButtonSaveEnable(false);
        }
    }

    get disableInput(): boolean {
        return this.editPageState == EditPageState.viewDetail || this.inputModel.autH_STATUS == 'A';
    }
//#endregion Status Page

//#region combobox and default filter

    // call in region constructor
    initDefaultFilter() {
        this.initCombobox();
        // set other filter here
    }
// begin combobox
// edit step 3: search
    initCombobox() {
        let filterCombobox = this.getFillterForCombobox();
        this.mwGroupService.mW_GROUP_Search(filterCombobox).subscribe((res) => {
            this.mw_groups = res.items;
            this.updateView();
        });
        this.unitService.cM_UNIT_Search(filterCombobox).subscribe((res) => {
            this.units = res.items;
            this.updateView();
        });
    }

// edit step 1: init variable
    mw_groups: MW_GROUP_ENTITY[] = [];
    units: CM_UNIT_ENTITY[] = [];

// edit step 2: handle event
    onSelectMWGroup(event){
        
    }

// end combobox

//#endregion combobox and default filter

}
