import { Component, Injector, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PRODUCT_DETAIL_ENTITY, ProductDetailServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { ProductProductDetailMaterialNNEdittableComponent } from './edittable/product-product-detail-material-nn-edittable.component';

@Component({
    templateUrl: './product-detail-material-nn-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ProductDetailMaterialNNEditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionEdit<PRODUCT_DETAIL_ENTITY> {
//#region constructor
    constructor(
        injector: Injector,
        private productDetailService: ProductDetailServiceProxy
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.producT_DETAIL_ID = this.getRouteParam('id');
    }

    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: PRODUCT_DETAIL_ENTITY = new PRODUCT_DETAIL_ENTITY();
    filterInput: PRODUCT_DETAIL_ENTITY;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.appToolbar.setRole('ProductDetail', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('ProductDetail', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('ProductDetail', false, false, false, false, false, false, true, false);
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
        this.navigatePassParam('/app/admin/product-detail-material-nn', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    getDataPages() {
        this.productDetailService.pRODUCT_DETAIL_ById(this.inputModel.producT_DETAIL_ID).subscribe(response => {
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
            if(!this.inputModel.producT_DETAIL_ID) {
                this.onAdd();
            } else {
                this.onUpdate();
            }
        } 
    }

    onAdd(): void {}

    onUpdate(): void {
        this.saving = true;
        this.productDetailService
        .pRODUCT_DETAIL_MATERIAL_Upd(this.inputModel)
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

    onApprove(item: PRODUCT_DETAIL_ENTITY): void{}
//#endregion CRUD

//#region "EditTable"
    getDataEditTables(){
        this.inputModel.typE_MATERIAL_UPD = 'NN';
        // Vật tư
        this.inputModel.producT_DETAIL_MATERIALs = this.productProductDetailMaterialEdittable.editTable.allData;
    }
    setDataEditTables(){
        // // Vật tư
        if (this.inputModel.producT_DETAIL_MATERIALs && this.inputModel.producT_DETAIL_MATERIALs.length > 0) {
            this.productProductDetailMaterialEdittable.editTable.setList(this.inputModel.producT_DETAIL_MATERIALs);
            this.productProductDetailMaterialEdittable.refreshTable();
        }
    }
    
    // Vật tư
    @ViewChild('productProductDetailMaterialEdittable') productProductDetailMaterialEdittable: ProductProductDetailMaterialNNEdittableComponent;
    
//#endregion "EditTable"

//#region Status Page
    setViewToolBar(){
        // Button lưu
        if(this.editPageState == EditPageState.viewDetail){
            this.appToolbar.setButtonSaveEnable(false);
        }
        else{
            if(this.inputModel.producT_DETAIL_ID != AuthStatusConsts.Approve){
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

}
