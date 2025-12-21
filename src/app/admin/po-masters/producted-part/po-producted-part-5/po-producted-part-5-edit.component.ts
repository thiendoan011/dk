import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { PO_PRODUCT_ENTITY, PoProductServiceProxy, CM_DEPARTMENT_ENTITY, UltilityServiceProxy, PO_ENTITY, PoProductedPartDetailServiceProxy, PO_PRODUCTED_PART_ENTITY } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes } from '@app/ultilities/enum/all-codes';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { IUiActionRejectExt } from '@app/ultilities/ui-action-re';
import { ToolbarRejectExtComponent } from '@app/admin/core/controls/toolbar-reject-ext/toolbar-reject-ext.component';
import { NgForm } from '@angular/forms';
import * as moment from 'moment'
import { PPPEPartDetailEditTableComponent } from '../po-producted-part-embryo/pppe-part-detail-edittable.component';
import { PPPEGroupProductEditTableComponent } from '../po-producted-part-embryo/pppe-group-product-edittable.component';
import { ProductProductedPartEditTableComponent } from '../edittable/product-producted-part-edittable.component';
import { PPPoductOfPOEditTableComponent } from '../edittable/pp-product-of-po-edittable.component';
import { POHistoryModalComponent } from '@app/admin/core/modal/module-po/po-history-modal/po-history-modal.component';

@Component({
    templateUrl: './po-producted-part-5-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PoProductedPart5EditComponent extends DefaultComponentBase implements OnInit, AfterViewInit, IUiActionRejectExt<PO_ENTITY> {
    ngAfterViewInit(): void {
        this.updateView();
    }

    constructor(
        injector: Injector,
        private ultilityService: UltilityServiceProxy,
        private poProductedPartDetailService: PoProductedPartDetailServiceProxy
    ) {
        super(injector);

        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.pO_ID = this.getRouteParam('po_id');
        this.inputModel.pO_PRODUCTED_PART_CODE = this.getRouteParam('producted_part_code');
        this.title = this.getRouteParam('title');
        this.initFilter();
        this.initIsApproveFunct();
    }

    isApproveFunct: boolean;
    initIsApproveFunct(): void {
        this.ultilityService.isApproveFunct(this.getCurrentFunctionId()).subscribe((res) => {
			this.isApproveFunct = res;
		});
    }

    @ViewChild('editForm') editForm: NgForm;

    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;

    inputModel: PO_ENTITY = new PO_ENTITY();
    filterInput: PO_ENTITY;
    disableAssetInput: boolean;
    disablePoEdit: boolean;
    title: string = '';

    isInitPoType: boolean = false

    get disableInput(): boolean {
        return this.editPageState == EditPageState.viewDetail || this.inputModel.autH_STATUS == 'A';
    }

    get hiddenButtonStartProductedPart(): boolean {
        return this.inputModel.iS_START == "1";
    }

    departments: CM_DEPARTMENT_ENTITY[];

    isShowError = false;

    totalAmt: number = 0;
    processValue: number = 0;

    dataInTables: PO_ENTITY[] = [];

    get apptoolbar(): ToolbarRejectExtComponent {
        return this.appToolbar as ToolbarRejectExtComponent;
    }

    ngOnInit(): void {

        switch (this.editPageState) {
            case EditPageState.add:
                this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
                this.appToolbar.setRole('PoProductedPart5', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.disablePoEdit = false;
                break;
            case EditPageState.edit:
                this.disablePoEdit = true;
                this.appToolbar.setRole('PoProductedPart5', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getPoProductedPartDetail();
                break;
            case EditPageState.viewDetail:
                this.disablePoEdit = true;
                this.appToolbar.setRole('PoProductedPart5', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getPoProductedPartDetail();
                break;
        }
        this.appToolbar.setUiAction(this);
        this.disableAssetInput = true;
    }

    getPoProductedPartDetail() {
        this.poProductedPartDetailService.pO_Producted_Part_Detail_ById(this.inputModel.pO_ID, this.inputModel.pO_PRODUCTED_PART_CODE).subscribe(response => {
            if (!response) this.goBack()
            this.inputModel = response;
            // lịch sử xử lý
            this.history_modal.getReject();

            this.setDataEditTables();

            if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
                this.appToolbar.setButtonApproveEnable(false);
                this.appToolbar.setButtonSaveEnable(true);
            }

            // CM_ATTACH_FILE
			this.getFile(this.inputModel.pO_PRODUCTED_PART_ID, this.inputModel);

            this.updateView();
        });
    }

    


    saveInput() {
        if (this.isApproveFunct == undefined) {
            this.showErrorMessage(this.l('PageLoadUndone'));
			this.updateView();
			return;
		}

        this.getDataEditTables();

        if(this.editPageState != EditPageState.viewDetail) {
            this.onUpdate();
        } 
    }

    goBack() {
        this.navigatePassParam('/app/admin/po-producted-part-5', null, { filterInput: JSON.stringify(this.filterInput) });
    }

    onAdd(): void {
        /*
        this.poProductedPartDetailService
        .pO_Producted_Part_Detail_Ins(this.inputModel)
        .pipe(
            finalize(() => {
                this.saving = false
            })
        )
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc'])
            } else {
                this.inputModel.producT_ID = res['ID'];
                this.showSuccessMessage(res['ErrorDesc']);
                // CM_ATTACH_FILE
                this.addFile(this.inputModel, 'po-product', undefined, res['ID']);
            }
            this.updateView();
        })
        */
    }

    onUpdate(): void {
        this.saving = false;
        this.poProductedPartDetailService
			.pO_Producted_Part_Detail_Upd(this.inputModel)
			.pipe(
				finalize(() => {
					this.saving = true;
				})
			)
			.subscribe((res) => {
				if (res['Result'] != '0') {
					this.showErrorMessage(res['ErrorDesc']);
                    this.inputModel.autH_STATUS = AuthStatusConsts.NotApprove;
				} else {
					this.updateSuccess();
                    // CM_ATTACH_FILE
					this.updateFile(this.inputModel, 'po-producted-part-5', undefined, this.inputModel.pO_PRODUCTED_PART_ID);
                    this.getPoProductedPartDetail();
                    this.updateView();
				}
			});
    }

    onAddProductedPartDetail(): void {
        let datas = this.editTableProductedPartDetail.allData;
		let data = new PO_PRODUCTED_PART_ENTITY();
        data.expecteD_DT = moment();
		datas.push(data);
		this.editTableProductedPartDetail.setList(datas);
		this.updateView();
    }

    onStartProductedPart(){
        abp.ui.setBusy()
        this.poProductedPartDetailService
			.pO_PRODUCTED_PART_DETAIL_Start(this.inputModel.pO_ID, "CD5", "Sơn 3")
			.pipe(finalize(() => {abp.ui.clearBusy();}))
			.subscribe((res) => {
				if (res['Result'] != '0') {
					this.showErrorMessage(res['ErrorDesc']);
                    this.inputModel.autH_STATUS = AuthStatusConsts.NotApprove;
				} else {
					this.showSuccessMessage(res['ErrorDesc']);
                    this.getPoProductedPartDetail();
                    this.updateView();
				}
			});
    }

    onDelete(item: PO_ENTITY): void {

    }

    onApprove(item: PO_ENTITY): void {
        
    }
    
    onViewDetail(item: PO_ENTITY): void {
    }

    onSave(): void {
        this.saveInput();
    }

    onSearch(): void {
    }

    onResetSearch(): void {
    }

    onReject(item: PO_ENTITY): void {

    }

    onReturn(notes: string) {
    }
    select2Change($event) {
        var tmp = $event;
    }

    onTemp(){
        
    }

    onChangePercentCompleted(){
        this.inputModel.percenT_COMPLETED = this.editTableProductedPartDetail.getSumPercent('percenT_COMPLETED').toString() + '%';
        this.updateView();
    }

    //#region "EditTable"
        getDataEditTables(){
            // Danh sách tiến độ
            this.inputModel.pO_PRODUCTED_PARTs_DETAIL = this.editTableProductedPartDetail.allData;
            // Danh sách hệ hàng
            //this.inputModel.pO_GROUP_PRODUCTs = this.pppeGroupProductEditTable.editTable.allData;
            // Chi tiết tiến độ hệ hàng
            this.inputModel.pO_GROUP_PRODUCT_PART_DETAILs = this.pppePartDetailEditTable.editTable.allData;
            // Chi tiết tiến độ sản phẩm
            this.inputModel.pO_PRODUCT_PART_DETAILs = this.ppePartDetailEditTable.editTable.allData;
            // Sản phẩm thuộc PO
            this.inputModel.producT_OF_POs = this.ppProductOfPOEditTable.editTable.allData;
        }
        setDataEditTables(){
            // Danh sách tiến độ
            if (this.inputModel.pO_PRODUCTED_PARTs_DETAIL && this.inputModel.pO_PRODUCTED_PARTs_DETAIL.length > 0) {
                this.editTableProductedPartDetail.setList(this.inputModel.pO_PRODUCTED_PARTs_DETAIL);
            }
            // Danh sách hệ hàng
            // if (this.inputModel.pO_GROUP_PRODUCTs && this.inputModel.pO_GROUP_PRODUCTs.length > 0) {
            //     this.pppeGroupProductEditTable.editTable.setList(this.inputModel.pO_GROUP_PRODUCTs);
            //     this.pppeGroupProductEditTable.refreshTable();
            // }
            // Chi tiết tiến độ hệ hàng
            if (this.inputModel.pO_GROUP_PRODUCT_PART_DETAILs && this.inputModel.pO_GROUP_PRODUCT_PART_DETAILs.length > 0) {
                this.pppePartDetailEditTable.editTable.setList(this.inputModel.pO_GROUP_PRODUCT_PART_DETAILs);
                this.pppePartDetailEditTable.refreshTable();
            }
            // Chi tiết tiến độ sản phẩm
            if (this.inputModel.pO_PRODUCT_PART_DETAILs && this.inputModel.pO_PRODUCT_PART_DETAILs.length > 0) {
                this.ppePartDetailEditTable.editTable.setList(this.inputModel.pO_PRODUCT_PART_DETAILs);
                this.ppePartDetailEditTable.refreshTable();
            }
            // Sản phẩm thuộc PO
            if (this.inputModel.producT_OF_POs && this.inputModel.producT_OF_POs.length > 0) {
                this.ppProductOfPOEditTable.editTable.setList(this.inputModel.producT_OF_POs);
                this.ppProductOfPOEditTable.refreshTable();
            }
        }
        // Danh sách tiến độ
        @ViewChild('editTableProductedPartDetail') editTableProductedPartDetail: EditableTableComponent<PO_PRODUCTED_PART_ENTITY>;
        // Danh sách hệ hàng
        //@ViewChild('pppeGroupProductEditTable') pppeGroupProductEditTable: PPPEGroupProductEditTableComponent;
        // Chi tiết tiến độ hệ hàng
        @ViewChild('pppePartDetailEditTable') pppePartDetailEditTable: PPPEPartDetailEditTableComponent;
        // Chi tiết tiến độ sản phẩm
        @ViewChild('ppePartDetailEditTable') ppePartDetailEditTable: ProductProductedPartEditTableComponent;
        // Sản phẩm thuộc PO
        @ViewChild('ppProductOfPOEditTable') ppProductOfPOEditTable: PPPoductOfPOEditTableComponent;
        // lịch sử xử lý
        @ViewChild('history_modal') history_modal: POHistoryModalComponent;
    
    //#endregion "EditTable"
}
