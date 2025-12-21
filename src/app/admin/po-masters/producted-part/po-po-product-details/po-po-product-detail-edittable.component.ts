import { Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation, Output, EventEmitter } from "@angular/core";
import { EditableTableComponent } from "@app/admin/core/controls/common/editable-table/editable-table.component";
import { PoGroupProductOfPOModalComponent } from "@app/admin/core/modal/module-po/po-group-product-of-po-modal/po-group-product-of-po-modal.component";
import { ProductOfGroupProductModalComponent } from "@app/admin/core/modal/module-product/product-of-group-product/product-of-group-product-modal.component";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import * as moment from "@node_modules/moment/moment";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { 
    POPOProductDetailServiceProxy, 
    PRODUCT_PRODUCT_DETAILS_VIEW_DTO, 
    PRODUCT_PRODUCT_DETAILS_FILTER_DTO, 
    PO_GROUP_PRODUCT_ENTITY,
    PO_PRODUCT_PRODUCTED_PART_ENTITY,
    PRODUCT_PRODUCT_ENTITY,
    PoProductedPartDetailServiceProxy
} from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'po-po-product-detail-edittable',
    templateUrl: './po-po-product-detail-edittable.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class POPOProductDetailEdittableComponent extends DefaultComponentBase implements OnInit {

    constructor(
        injector: Injector,
        private poProductedPartDetailService: PoProductedPartDetailServiceProxy,
        private poPOProductDetailService: POPOProductDetailServiceProxy
    ) {
        super(injector);
    }

    // --- Inputs ---
    @Input() poId: string;
    @Input() productedPartCode: string;
    @Input() disableInput: boolean = false;

    @Output() onSaveCompleted: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('editTable') editTable: EditableTableComponent<PRODUCT_PRODUCT_DETAILS_VIEW_DTO>;
    
    // Dùng record để binding data lên UI (Input Hệ hàng/Sản phẩm)
    record: PO_PRODUCT_PRODUCTED_PART_ENTITY = new PO_PRODUCT_PRODUCTED_PART_ENTITY();
    filterInput: PRODUCT_PRODUCT_DETAILS_FILTER_DTO = new PRODUCT_PRODUCT_DETAILS_FILTER_DTO();

    ngOnInit(): void {
        if (this.poId) {
            this.initData();
        }
    }

    /**
     * Hàm load data chính cho bảng
     * Lấy tham số từ this.record (được cập nhật qua Modal)
     */
    initData() {
        if (!this.poId) return;

        // Prepare Filter DTO
        this.filterInput.pO_ID = this.poId;
        this.filterInput.grouP_PRODUCT_ID = this.record.grouP_PRODUCT_ID;
        this.filterInput.producT_ID = this.record.producT_ID;

        // --- CHUẨN BỊ DỮ LIỆU MẶC ĐỊNH (FACTORY & DATE) ---
        // Logic xác định nhà máy dựa trên chi nhánh đăng nhập
        const branchCode = this.appSession.user.branchCode;
        let defaultFactory = '';
        if (branchCode === 'T100000007') {
            defaultFactory = 'DK';
        } else if (branchCode === 'T100000008') {
            defaultFactory = 'HDP';
        }
        
        // Ngày hiện tại
        const defaultDate = moment();

        this.saving = true;
        this.poPOProductDetailService.pO_PO_PRODUCT_DETAILs_Input(this.filterInput)
            .pipe(finalize(() => this.saving = false))
            .subscribe(result => {
                if (result && result.length > 0) {
                    result.forEach(item => {
                        item['editableIsSelected'] = false;
                        
                        // Reset giá trị nhập
                        if (item.quantitY_COMPLETED == null) item.quantitY_COMPLETED = 0;
                        if (item.quantitY_OUTSOURCED == null) item.quantitY_OUTSOURCED = 0;

                        // --- GÁN DỮ LIỆU MẶC ĐỊNH VÀO ITEM ---
                        item.producteD_PART_CODE = this.productedPartCode; // Gán mã công đoạn
                        item.factory = defaultFactory;                     // Gán nhà máy
                        item.productioN_DT = defaultDate;                  // Gán ngày thực hiện
                    });
                    this.editTable.setList(result);
                } else {
                    this.editTable.setList([]);
                }
            });
    }

    save() {
        const allData = this.editTable.allData;
        const inputData = [];

        // Validate nhà máy (Trường hợp tài khoản không thuộc 2 chi nhánh quy định)
        // Kiểm tra dòng đầu tiên vì logic gán giống nhau cho cả bảng
        // if (allData.length > 0 && (!allData[0].factory || allData[0].factory === '')) {
        //      this.showErrorMessage(this.l('Thông tin nhà máy không được để trống!'));
        //      return;
        // }

        for (const item of allData) {
            const qtyCompleted = item.quantitY_COMPLETED || 0;
            const qtyOutsourced = item.quantitY_OUTSOURCED || 0;

            // Bỏ qua những dòng không nhập gì cả
            if (qtyCompleted === 0 && qtyOutsourced === 0) {
                continue;
            }

            // --- VALIDATE LOGIC ---
            
            // 2.1. Không được nhập cả 2 cột cùng lúc
            if (qtyCompleted !== 0 && qtyOutsourced !== 0) {
                this.showErrorMessage(this.l('Dòng số {0}: Mã {1} không hợp lệ! Chỉ được nhập SL hoàn thành HOẶC SL gia công.', item["no"], item.producT_DETAIL_CODE));
                return;
            }

            // 2.2. Không được vượt quá số lượng còn lại
            if ((qtyCompleted + qtyOutsourced) > (item.remaininG_PREVIOUS || 0)) {
                this.showErrorMessage(this.l('Dòng số {0}: Mã {1} vượt quá số lượng còn lại!', item["no"], item.producT_DETAIL_CODE));
                return;
            }

            // 2.3. Phải là bội số của BOM (SLDM)
            const bomQty = item.boM_Qty || 1;
            if ((qtyCompleted % bomQty !== 0) || (qtyOutsourced % bomQty !== 0)) {
                this.showErrorMessage(this.l('Dòng số {0}: Số lượng nhập của mã {1} phải là bội số của SLDM ({2})!', item["no"], item.producT_DETAIL_CODE, bomQty));
                return;
            }

            // Dữ liệu hợp lệ -> Đưa vào danh sách gửi đi
            inputData.push(item);
        }

        // 3. Kiểm tra rỗng trước khi gửi
        if (inputData.length === 0) {
            this.showErrorMessage(this.l('Vui lòng nhập số lượng chi tiết!'));
            return;
        }

        // 4. Gọi API Upsert
        this.saving = true;
        this.poPOProductDetailService.pO_PO_PRODUCT_DETAILs_Upsert(inputData)
            .pipe(finalize(() => this.saving = false))
            .subscribe(res => {
                if (res['Result'] !== '0') {
                    this.showErrorMessage(res['ErrorDesc']);
                } else {
                    this.showSuccessMessage(this.l('Lưu thành công!'));
                    this.initData();
                    this.onSaveCompleted.emit();
                }
            });
    }

    refresh() {
        this.initData();
    }

    onFind() {
        this.initData();
    }

    // #region POPUP HANDLERS

    // 1. Hệ hàng 
    @ViewChild('poGroupProductOfPOModal') poGroupProductOfPOModal: PoGroupProductOfPOModalComponent;
    
    showGroupProduct(): void {
        this.poGroupProductOfPOModal.filterInput.pO_ID = this.poId; // Dùng poId từ Input
        this.poGroupProductOfPOModal.show();
        this.poGroupProductOfPOModal.search();
    }

    onSelectGroupProduct(item: PO_GROUP_PRODUCT_ENTITY) {
        this.record.grouP_PRODUCT_ID = item.grouP_PRODUCT_ID;
        this.record.grouP_PRODUCT_CODE = item.grouP_PRODUCT_CODE;
        
        // Reset sản phẩm khi chọn lại hệ hàng để đảm bảo tính nhất quán
        this.record.producT_ID = undefined;
        this.record.producT_CODE = undefined;
        this.record.producT_NAME = undefined;
    }

    // 2. Sản phẩm
    @ViewChild('productModal') productModal: ProductOfGroupProductModalComponent;
    
    showProduct(): void {
        if (this.isNullOrEmpty(this.record.grouP_PRODUCT_ID)) {
            this.showErrorMessage(this.l('Vui lòng chọn hệ hàng trước khi chọn sản phẩm'));
            return;
        }
        this.productModal.group_product_id = this.record.grouP_PRODUCT_ID;
        this.productModal.show();
        this.productModal.search();
    }

    onSelectProductModal(item: PRODUCT_PRODUCT_ENTITY) {
        this.record.producT_ID = item.producT_ID;
        this.record.producT_CODE = item.producT_CODE;
        this.record.producT_NAME = item.producT_NAME;

        // Nếu bạn muốn lấy thông tin chi tiết (Tồn kho, BOM...) hiển thị lên Form nhập liệu (Header)
        // thì giữ lại đoạn này. Nếu chỉ để filter bảng lưới thì có thể bỏ qua.
        this.getProductInfoSummary();
    }

    // Tách logic lấy thông tin phụ ra hàm riêng cho gọn
    getProductInfoSummary() {
        if (!this.filterInput.pO_ID || !this.record.grouP_PRODUCT_ID || !this.record.producT_ID) return;

        abp.ui.setBusy();
        this.poProductedPartDetailService
            .pO_PRODUCTED_PART_DETAIL_GET_INFOR_Product(
                this.poId, 
                this.record.grouP_PRODUCT_ID, 
                this.record.producT_ID, 
                this.productedPartCode
            )
            .pipe(finalize(() => abp.ui.clearBusy()))
            .subscribe((res) => {
                this.record.quantitY_TOTAL = res['QUANTITY_TOTAL'];
                this.record.quantitY_USED = res['QUANTITY_USED'];
                this.record.quantitY_REMAIN = res['QUANTITY_TOTAL'] - res['QUANTITY_USED'];
                this.updateView();
            });
    }

    // #endregion
}