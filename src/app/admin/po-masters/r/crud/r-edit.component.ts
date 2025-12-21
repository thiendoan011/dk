import { Component, Injector, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { AsposeServiceProxy, CM_BRANCH_ENTITY, GROUP_R_ENTITY, PO_CUSTOMER_ENTITY, RServiceProxy, R_ENTITY, ReportInfo } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { IUiActionEdit } from '@app/ultilities/ui-action-edit';
import { BranchModalComponent } from '@app/admin/core/controls/common/branch-modal/branch-modal.component';
import { PoCustomerModalComponent } from '@app/admin/core/modal/module-po/po-customer-modal/po-customer-modal.component';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { ReportTypeConsts } from '@app/admin/core/ultils/consts/ReportTypeConsts';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { RManageDateEdittableComponent } from './r-manage-date-edittable.component';
import * as moment from 'moment';
import { RRequestDTEdittableComponent } from './edittable/r-request-dt-edittable.component';
import { RGroupProductEdittableComponent } from './edittable/r-group-product-edittable.component';
import { GroupRModalComponent } from '@app/admin/core/modal/module-po/group-r-modal/group-r-modal.component';
import { POHistory2ModalComponent } from '@app/admin/core/modal/module-po/po-history-2-modal/po-history-2-modal.component';
import { ROrderEdittableComponent } from './edittable/r-order-edittable.component';
import { RAttachFileComponent } from './edittable/r-attach-file.component';
import { RPOEdittableComponent } from './edittable/r-po-edittable.component';

@Component({
    templateUrl: './r-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class REditComponent extends DefaultComponentBase implements OnInit, IUiActionEdit<R_ENTITY>, AfterViewInit {
//#region constructor
    constructor(
        injector: Injector,
		private asposeService: AsposeServiceProxy,
		private fileDownloadService: FileDownloadService,
        private rService: RServiceProxy
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.r_ID = this.getRouteParam('id');
    }

    EditPageState = EditPageState;
    editPageState: EditPageState;
    inputModel: R_ENTITY = new R_ENTITY();
    filterInput: R_ENTITY;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.appToolbar.setRole('R', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.initDefaultValue();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('R', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDataPages();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('R', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getDataPages();
                break;
        }
        this.appToolbar.setUiActionEdit(this);
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    initDefaultValue(){
        // P.DAPT CUNG CẤP HỒ SƠ SẢN PHẨM CHO P. KỸ THUẬT               (13)
        this.inputModel.pdE_PRODUCT_PROFILE_REQUEST_NBDAY = 3;
        // PKT TRIỂN KHAI PPS                                           (11)
        this.inputModel.tecH_REQUEST_NBDAY = 6;
        // P. KỸ THUẬT CUNG CẤP HỒ SƠ SẢN PHẨM CHO CÁC PHÒNG LIÊN QUAN  (12)
        this.inputModel.tecH_PRODUCT_PROFILE_REQUEST_NBDAY = 7;
        // BỘ PHẬN VẬT TƯ CUNG CẤP NGUYÊN LIỆU                          (10)
        this.inputModel.warehousE_MATERIAL_REQUEST_NBDAY = 6;
        // CONG DOAN PHOI                                               (7)
        this.inputModel.embryO_REQUEST_NBDAY = 15;
        // CONG DOAN DINH HINH                                          (5)
        this.inputModel.structurE_REQUEST_NBDAY = 15;
        // CONG DOAN LAP RAP                                            (3)
        this.inputModel.assemblY_REQUEST_NBDAY = 7;
        // CONG DOAN SON                                                (2)
        this.inputModel.painT_REQUEST_NBDAY = 4;
        // CONG DOAN DONG GOI                                           (1) 
        this.inputModel.wraP_REQUEST_NBDAY = 4;
        // BỘ PHẬN VẬT TƯ CUNG CẤP VẬT TƯ SƠN + ĐÓNG GÓI                (4)
        this.inputModel.warehousE_PAINT_REQUEST_NBDAY = Math.round(this.inputModel.assemblY_REQUEST_NBDAY * 1.3);
        // BỘ PHẬN VẬT TƯ CUNG CẤP VẬT TƯ LẮP RÁP                       (6) 
        this.inputModel.warehousE_ASSEMBLY_REQUEST_NBDAY = Math.round(this.inputModel.structurE_REQUEST_NBDAY * 1.3);
        // BỘ PHẬN VẬT TƯ CUNG CẤP VẬT TƯ ĐỊNH HÌNH                     (8)
        this.inputModel.warehousE_STRUCTURE_REQUEST_NBDAY = Math.round(this.inputModel.embryO_REQUEST_NBDAY*1.3);
    }

//#endregion constructor

//#region CRUD   
    goBack() {
        this.navigatePassParam('/app/admin/r', null, undefined);
    }

    getDataPages() {
        this.rService.r_ById(this.inputModel.r_ID).subscribe(response => {
            this.inputModel = response;
            this.setViewToolBar();
            // lịch sử xử lý
            this.history_modal.getDetail();
            this.setDataEditTables();
            this.updateView();
        });
    }

    onSave(): void {
        this.saveInput();
    }

    saveInput() {
        this.getDataEditTables();

        if(this.editPageState != EditPageState.viewDetail) {
            if(!this.inputModel.r_ID) {
                this.onAdd();
            } else {
                this.onUpdate();
            }
        } 
    }
    onAdd(): void {
        this.saving = true;
        this.rService.r_Ins(this.inputModel)
        .pipe(finalize(() => {this.saving = false}))
        .subscribe(res => {
            if(res['Result'] != '0'){
                this.showErrorMessage(res['ErrorDesc']);
                this.updateView();
            } else {
                this.inputModel.r_ID = res['ID'];
                this.showSuccessMessage(res['ErrorDesc']);
                this.getDataPages();
                this.updateView();
            }
        })
    }

    onUpdate(): void {
        this.saving = true;
        this.rService.r_Upd(this.inputModel)
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

    onApprove(item: R_ENTITY): void {
        this.message.confirm(
            this.l('ApproveWarningMessage', (this.inputModel.r_CODE)),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.rService.r_App(this.inputModel.r_ID, this.appSession.user.userName)
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
    
    onRefreshPage(){
        this.getDataPages();
        this.updateView();
    }
//#endregion CRUD   
    
//#region Status Page
    setViewToolBar(){
        // Button lưu
        if(this.editPageState == EditPageState.viewDetail){
            this.appToolbar.setButtonSaveEnable(false);
        }
        else{
            if(this.inputModel.autH_STATUS != AuthStatusConsts.Approve){
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

//#region "EditTable"
    getDataEditTables(){
        // File đính kèm
        this.inputModel.r_ATTACH_FILEs = this.rAttachFile.editTable.allData;
        // PO
        this.inputModel.r_POs = this.rPOEdittable.editTable.allData;
    }
    setDataEditTables(){
        // File đính kèm
        if (this.inputModel.r_ATTACH_FILEs && this.inputModel.r_ATTACH_FILEs.length > 0) {
            this.rAttachFile.editTable.setList(this.inputModel.r_ATTACH_FILEs);
            this.rAttachFile.refreshTable();
        }
        // Danh sách PO
        if (this.inputModel.r_POs && this.inputModel.r_POs.length > 0) {
            this.rPOEdittable.editTable.setList(this.inputModel.r_POs);
            this.rPOEdittable.refreshTable();
        }
        // File đính kèm đơn hàng
        // if (this.inputModel.r_PURCHASE_ATTACH_FILEs && this.inputModel.r_PURCHASE_ATTACH_FILEs.length > 0) {
        //     //this.rPurchaseAttachFile.editTable.setList(this.inputModel.r_PURCHASE_ATTACH_FILEs);
        //     this.rPurchaseAttachFile.editTable.setList
        //     (this.inputModel.r_PURCHASE_ATTACH_FILEs
        //         .filter ((item, index, self) => {
        //                                             // Kiểm tra nếu giá trị của cột đã xuất hiện trước đó
        //                                             return self.findIndex(obj => obj.filE_NAME_OLD === item.filE_NAME_OLD) === index;
        //                                         }
        //                 )
        //     );
        //     this.rPurchaseAttachFile.refreshTable();
        // }
        // Thay đổi ngày yêu cầu hoàn thành
        if (this.inputModel.r_REQUEST_DTs && this.inputModel.r_REQUEST_DTs.length > 0) {
            this.rRequestDTEdittable.editTable.setList(this.inputModel.r_REQUEST_DTs);
            this.rRequestDTEdittable.refreshTable();
        }
        // Danh sách hệ hàng
        if (this.inputModel.r_GROUP_PRODUCTs && this.inputModel.r_GROUP_PRODUCTs.length > 0) {
            this.rGroupProductEdittable.editTable.setList(this.inputModel.r_GROUP_PRODUCTs);
            this.rGroupProductEdittable.refreshTable();
        }
        // Danh sách đơn hàng
        if (this.inputModel.r_ORDERs && this.inputModel.r_ORDERs.length > 0) {
            this.rOrderEdittable.editTable.setList(this.inputModel.r_ORDERs);
            this.rOrderEdittable.refreshTable();
        }
    }

    // File đính kèm
    @ViewChild('rAttachFile') rAttachFile: RAttachFileComponent;
    // PO
    @ViewChild('rPOEdittable') rPOEdittable: RPOEdittableComponent;
    // File đính kèm đơn hàng
    //@ViewChild('rPurchaseAttachFile') rPurchaseAttachFile: RPurchaseAttachFileComponent;
    // Ngày yêu cầu hoàn thành
    @ViewChild('rManageDateEdittable') rManageDateEdittable: RManageDateEdittableComponent;
    // Thay đổi ngày yêu cầu hoàn thành
    @ViewChild('rRequestDTEdittable') rRequestDTEdittable: RRequestDTEdittableComponent;
    // Danh sách hệ hàng
    @ViewChild('rGroupProductEdittable') rGroupProductEdittable: RGroupProductEdittableComponent;
    // Danh sách đơn hàng
    @ViewChild('rOrderEdittable') rOrderEdittable: ROrderEdittableComponent;
    // lịch sử xử lý
    @ViewChild('history_modal') history_modal: POHistory2ModalComponent;
    
//#endregion "EditTable"

//#region Control
// branch
    @ViewChild('branchModal') branchModal: BranchModalComponent;
    showBranchModal(): void {
        this.branchModal.show();
    }

    onSelectBranch(event: CM_BRANCH_ENTITY): void {

        if(this.inputModel.brancH_ID != event.brancH_ID){
            
            this.inputModel.brancH_ID = event.brancH_ID;
            this.inputModel.brancH_NAME = event.brancH_NAME;
        }
        else{
            this.inputModel.brancH_ID = event.brancH_ID;
            this.inputModel.brancH_NAME = event.brancH_NAME;
        }

        this.updateView();
    }
    deleteBranch(){
        this.inputModel.brancH_ID = '';
        this.inputModel.brancH_NAME = '';
        this.updateView();
    }

// customer
    @ViewChild('poCusModal') poCusModal: PoCustomerModalComponent;
    showCusModal(): void {
		this.poCusModal.filterInput.recorD_STATUS = RecordStatusConsts.Active;
		this.poCusModal.filterInput.top = null;
		this.poCusModal.show();
	}

	onSelectCustomer(event: PO_CUSTOMER_ENTITY): void {
		if (event) {
			this.inputModel.customeR_ID = event.customeR_ID;
			this.inputModel.customeR_NAME = event.customeR_NAME;
			this.updateView();
		}
	}
    onDeleteCustomer(){
        this.inputModel.customeR_ID = '';
        this.inputModel.customeR_NAME = '';
        this.updateView();
    }
//#endregion Control

//#region ChangePage
    onChangeIns(): void {
        if(this.inputModel.r_REQUEST_DT && this.inputModel.numbeR_OF_DAY_REQUEST){
            this.inputModel.implemenT_DT = moment(this.inputModel.r_REQUEST_DT).add(-this.inputModel.numbeR_OF_DAY_REQUEST, 'day');
            this.inputModel.requesT_DT = this.inputModel.r_REQUEST_DT;
            this.updateView();
        }
        else if(this.inputModel.r_REQUEST_DT && !this.inputModel.numbeR_OF_DAY_REQUEST){
            this.inputModel.implemenT_DT = moment();
            this.inputModel.numbeR_OF_DAY_REQUEST = this.inputModel.r_REQUEST_DT.diff(moment(), "day");
            this.updateView();
        }
    }

    onChangeUpd(){
        this.inputModel.numbeR_OF_DAY_REQUEST = this.inputModel.requesT_DT.diff(this.inputModel.implemenT_DT, "day");
        this.updateView();
    }
//#endregion ChangePage

 //#region popup  
    // hệ hàng 
    @ViewChild('groupRModal') groupRModal: GroupRModalComponent;
    showGroupR():void{
        this.groupRModal.show();
    }
    onSelectGroupR(item: GROUP_R_ENTITY): void {
        this.inputModel.grouP_R_ID = item.grouP_R_ID;
        this.inputModel.grouP_R_CODE = item.grouP_R_CODE;
        this.inputModel.grouP_R_NAME = item.grouP_R_NAME;
        this.updateView();
    }
    deleteGroupR(event) {
        this.inputModel.grouP_R_ID = '';
        this.inputModel.grouP_R_CODE = '';
        this.inputModel.grouP_R_NAME = '';
        this.updateView();
    }
//#endregion popup


    onExportReport(){
        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        let reportFilter =  {   R_ID: this.inputModel.r_ID, 
                                USER_LOGIN: this.appSession.user.userName
                            };
        reportInfo.parameters = this.GetParamsFromFilter(reportFilter)

        
        if(this.inputModel.r_TYPE == 'lsx45'){
            reportInfo.pathName = '/PO_MASTER/R_DETAIL_45.xlsx';
            reportInfo.storeName = 'R_DETAIL_RPT';
        }
        else if(this.inputModel.r_TYPE == 'lsx60'){
            reportInfo.pathName = '/PO_MASTER/R_DETAIL_60_75.xlsx';
            reportInfo.storeName = 'R_DETAIL_RPT';
        }
        else if(this.inputModel.r_TYPE == 'lsx90'){
            reportInfo.pathName = '/PO_MASTER/R_DETAIL_90_100.xlsx';
            reportInfo.storeName = 'R_DETAIL_RPT';
        }
        else{
            this.showErrorMessage('Vui lòng chọn loại lệnh sản xuất!');
            this.updateView();
            return;
        }
        this.asposeService.getReport(reportInfo).subscribe((res) => {
            this.fileDownloadService.downloadTempFile(res);
        });
    }

}
