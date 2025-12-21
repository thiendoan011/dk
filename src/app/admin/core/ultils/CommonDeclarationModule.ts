import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '@app/admin/core/controls/toolbar/toolbar.component';
import { TableModule } from 'primeng/table';
import { TreeModule } from 'primeng/tree';
import { UtilsModule } from '@shared/utils/utils.module';
import { ControlComponent } from '@app/admin/core/controls/control.component';
import { ModalModule, TabsModule, TooltipModule, PopoverModule, BsDropdownModule, BsDatepickerModule } from 'ngx-bootstrap';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { AutoCompleteModule, EditorModule, FileUploadModule as PrimeNgFileUploadModule, InputMaskModule, PaginatorModule, FileUploadModule, DragDropModule, ContextMenuModule, ProgressBarModule } from 'primeng/primeng';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TextMaskModule } from 'angular2-text-mask';
import { ImageCropperModule } from 'ngx-image-cropper';
import { TreeCheckboxSelectComponent } from '../controls/tree-checkbox-select/tree-checkbox-select.component';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { DateFormatPipe } from '../pipes/date-format.pipe';
import { MoneyFormatPipe } from '../pipes/money-format.pipe';
import { CustomFlatpickrComponent } from '../controls/custom-flatpickr/custom-flatpickr.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { CkeditorControlComponent } from '../controls/common/ckeditor-control/ckeditor-control.component';
import { RoleComboComponent } from '@app/admin/zero-base/shared/role-combo.component';
import { CodeScannerComponent } from '../controls/code-scanner/code-scanner/code-scanner.component';
import { AppInfoDialogComponent } from '../controls/code-scanner/app-info-dialog/app-info-dialog.component';
import { AppInfoComponent } from '../controls/code-scanner/app-info/app-info.component';
import { FormatsDialogComponent } from '../controls/code-scanner/formats-dialog/formats-dialog.component';
import { WebcamModule } from 'ngx-webcam';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import {ZXingScannerModule} from '@zxing/ngx-scanner'
import { DateTimeFormatPipe } from '../pipes/date-time-format.pipe';
import { TermFormatPipe } from '../pipes/term-format.pipe';
import { HttpModule } from '@angular/http';
import { SideBarMenuComponent } from '@app/shared/layout/nav/side-bar-menu.component';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import * as ngCommon from '@angular/common';
import { AppRoutingModule } from '@app/app-routing.module';
import { TopBarComponent } from '@app/shared/layout/topbar.component';
import { CoreModule } from '@metronic/app/core/core.module';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { AbpModule } from 'abp-ng2-module/dist/src/abp.module';
import { LSelect2Module } from 'ngx-select2';
import { DefaultBrandComponent } from '@app/shared/layout/themes/default/default-brand.component';
import { HeaderNotificationsComponent } from '@app/shared/layout/notifications/header-notifications.component';
import { ImpersonationService } from '@app/admin/zero-base/users/impersonation.service';
import { LinkedAccountService } from '@app/shared/layout/linked-account.service';
import { UserNotificationHelper } from '@app/shared/layout/notifications/UserNotificationHelper';
import { AttachFileServiceProxy } from '@shared/service-proxies/service-proxies';
import { ChatSignalrService } from '@app/shared/layout/chat/chat-signalr.service';
import { LayoutConfigService } from '@metronic/app/core/services/layout-config.service';
import { UtilsService } from 'abp-ng2-module/dist/src/utils/utils.service';
import { LayoutRefService } from '@metronic/app/core/services/layout/layout-ref.service';
import { UploadSystemFile } from '@app/admin/common/upload-system-file/upload-system-file.component';
import { RouterModule } from '@angular/router';
import { NumberFormatPipe } from '../pipes/number-format.pipe';
import { CMSendWithComboboxModalComponent } from '../controls/common/cm-send-with-combobox-modal/cm-send-with-combobox-modal.component';
import { AuthStatusInputPageComponent } from '../controls/status/auth-status-input-page/auth-status-input-page.component';
import { AuthStatusComponent } from '../controls/status/auth-status/auth-status.component';
import { AuthStatus2Component } from '../controls/status/auth-status-2/auth-status-2.component';
import { Select2CustomComponent } from '../controls/common/custom-select2/select2-custom.component';
import { AllCodeSelectComponent } from '../controls/common/allCodes/all-code-select.component';
import { CoreTableComponent } from '../controls/common/core-table/core-table.component';
import { AppPermissionTreeComponent } from '../controls/common/app-permission-tree/app-permission-tree.component';
import { CheckboxControlComponent } from '../controls/common/checkbox-control/checkbox-control.component';
import { EditableTableComponent } from '../controls/common/editable-table/editable-table.component';
import { FilePickerComponent } from '../controls/common/file-picker/file-picker.component';
import { BranchModalComponent } from '../controls/common/branch-modal/branch-modal.component';
import { DepartmentModalComponent } from '../controls/common/dep-modal/department-modal.component';
import { FileMultiComponent } from '../controls/common/file-picker/file-multi.component';
import { FileUploaderMultiModalComponent } from '../controls/common/file-uploader/file-uploader-multi-modal.component';
import { FileUploaderComponent } from '../controls/common/file-uploader/file-uploader.component';
import { FileSystemUploaderComponent } from '../controls/common/file-system-uploader/file-system-uploader.component';
import { ImportExcelComponent } from '../controls/common/import-excel/import-excel.component';
import { ImageCarouselComponent } from '../controls/common/image-carousel/image-carousel.component';
import { ImageCarouselUploadModalComponent } from '../controls/common/image-carousel/image-carousel-upload-modal.component';
import { InputSelectComponent } from '../controls/common/input-select-control/input-select-control.component';
import { TextareaAutoresizeDirective } from '../controls/common/auto-resize/auto-resize.component';
import { InputMultiSelectComponent } from '../controls/common/input-multi-select-control/input-select-control.component';
import { CMRejectModalComponent } from '../controls/common/cm-reject-modal/cm-reject-modal.component';
import { inputAutoComplete } from '../controls/common/input-autoComplete/input-autoComplete.component';
import { UserModalComponent } from '../controls/common/users-modal/user-modal.component';
import { TreeRadioSelectComponent } from '../controls/tree-checkbox-select/tree-select-radio/tree-radio-select.component';
import { TLRoleModalComponent } from '../controls/common/tl-role-modal/tl-role-modal.component';
import { ToolbarRejectExtComponent } from '../controls/toolbar-reject-ext/toolbar-reject-ext.component';
import { MoneyInputComponent } from '../controls/common/money-input/money-input.component';
import { Paginator2Component } from '../controls/common/p-paginator2/p-paginator2.component';
import { ReportNoteModalComponent } from '../controls/common/report-note-modal/report-note-modal.component';
import { ReportTemplateModalComponent } from '../controls/common/report-template-modal/report-template-modal.component';
import { RejectModalComponent } from '../controls/common/reject-modals/reject-modal.component';
import { PopupFrameComponent } from '../controls/common/popup-frames/popup-frame.component';
import { PopupTableBaseComponent } from '../controls/common/popup-table-base/popup-table-base.component';
import { POImageModalComponent } from '../modal/module-po/po-image-modal/po-image-modal.component';
import { PoCustomerModalComponent } from '../modal/module-po/po-customer-modal/po-customer-modal.component';
import { PoProductModalComponent } from '../modal/module-po/po-product-modal/po-product-modal.component';
import { PoPOModalComponent } from '../modal/module-po/po-po-modal/po-po-modal.component';
import { PoGroupProductModalComponent } from '../modal/module-po/po-group-product-modal/po-group-product-modal.component';
import { POHistoryModalComponent } from '../modal/module-po/po-history-modal/po-history-modal.component';
import { DocumentRoleModalComponent } from '../modal/module-po/document-role-modal/document-role-modal.component';
import { PoProductOfGroupProductModalComponent } from '../modal/module-po/po-product-of-group-product-modal/po-product-of-group-product-modal.component';
import { PoGroupProductOfPOModalComponent } from '../modal/module-po/po-group-product-of-po-modal/po-group-product-of-po-modal.component';
import { PoHardwareVTModalComponent } from '../modal/module-po/po-hardwarevt-modal/po-hardwarevt-modal.component';
import { PoHardwareDGModalComponent } from '../modal/module-po/po-hardwaredg-modal/po-hardwaredg-modal.component';
import { RModalComponent } from '../modal/module-po/r-modal/r-modal.component';
import { PoCoststatementModalComponent } from '../modal/module-po/po-coststatement-modal/po-coststatement-modal.component';
import { PDEProductWithConditionModalComponent } from '../modal/module-project-development/pde-product-with-condition-modal/pde-product-with-condition-modal.component';
import { PDEGroupProductModalComponent } from '../modal/module-project-development/pde-group-product-modal/pde-group-product-modal.component';
import { ProductDetailModalComponent } from '../modal/module-product/product-detail/product-detail-modal.component';
import { ProductGroupDetailModalComponent } from '../modal/module-product/product-group-detail-modal/product-group-detail-modal.component';
import { ProductDetailOfProductGroupDetailModalComponent } from '../modal/module-product/product-detail-of-product-group-detail-modal/product-detail-of-product-group-detail-modal.component';
import { GroupDetailOfProductModalComponent } from '../modal/module-product/group-detail-of-product-modal/group-detail-of-product-modal-modal.component';
import { HistoryModalComponent } from '../modal/history-modal/history-modal.component';
import { History2ModalComponent } from '../modal/history-2-modal/history-2-modal.component';
import { ProductCoststatementModalComponent } from '../modal/module-product/product-coststatement/product-coststatement-modal.component';
import { TTHistoryModalComponent } from '../modal/module-time-tracking/tt-history-modal/tt-history-modal.component';
import { TTRejectModalComponent } from '../modal/module-time-tracking/tt-reject_modal/tt-reject-modal.component';
import { TTSuggestModalComponent } from '../modal/module-time-tracking/tt-suggest-modal/tt-suggest-modal.component';
import {TimelineModule} from "angular2-timeline";
import { MoneyInput5Component } from '../controls/common/money-input-5/money-input-5.component';
import { ProductModalComponent } from '../modal/module-product/product/product-modal.component';
import { ProductOfGroupProductModalComponent } from '../modal/module-product/product-of-group-product/product-of-group-product-modal.component';
import { PoProductOfPOModalComponent } from '../modal/module-po/po-product-of-po-modal/po-product-of-po-modal.component';
import { DocumentModalComponent } from '../modal/module-po/document-modal/document-modal.component';
import { AuthStatus3Component } from '../controls/status/auth-status-3/auth-status-3.component';
import { MWTypeMaterialModalComponent } from '../modal/module-material/mw-type-material-modal/mw-type-material-modal.component';
import { AppShareModule } from '@app/shared/app-share-module';
import { AuthStatus4Component } from '../controls/status/auth-status-4/auth-status-4.component';
import { CMSupplierModalComponent } from '../modal/module-common/cm-supplier-modal/cm-supplier-modal.component';
import { GroupRModalComponent } from '../modal/module-po/group-r-modal/group-r-modal.component';
import { POHistory2ModalComponent } from '../modal/module-po/po-history-2-modal/po-history-2-modal.component';
import { POHistoryCreateModalComponent } from '../modal/module-po/po-history-create-modal/po-history-create-modal.component';
import { PURRequisitionMaterialModalComponent } from '../modal/module-purchase/pur-requisition-material-modal/pur-requisition-material-modal.component';
import { PURMaterialSummaryModalComponent } from '../modal/module-purchase/pur-material-summary-modal/pur-material-summary-modal.component';
import { PURRequisitionModalComponent } from '../modal/module-purchase/pur-requisition-modal/pur-requisition-modal.component';
import { MWTypeSupplierModalComponent } from '../modal/module-material/mw-type-supplier-modal/mw-type-supplier-modal.component';
import { PURRModalComponent } from '../modal/module-purchase/pur-r-modal/pur-r-modal.component';
import { PURPOModalComponent } from '../modal/module-purchase/pur-po-modal/pur-po-modal.component';
import { PURGroupProductModalComponent } from '../modal/module-purchase/pur-group-product-modal/pur-group-product-modal.component';
import { PURProductModalComponent } from '../modal/module-purchase/pur-product-modal/pur-product-modal.component';
import { PURProductGroupDetailModalComponent } from '../modal/module-purchase/pur-product-group-detail-modal/pur-product-group-detail-modal.component';
import { PURProductDetailModalComponent } from '../modal/module-purchase/pur-product-detail-modal/pur-product-detail-modal.component';
import { PURMaterialModalComponent } from '../modal/module-purchase/pur-material-modal/pur-material-modal.component';
import { PUROrderMaterialModalComponent } from '../modal/module-purchase/pur-order-material-modal/pur-order-material-modal.component';
import { PURUnitPriceOfMaterialModalComponent } from '../modal/module-purchase/pur-unit-price-of-material-modal/pur-unit-price-of-material-modal.component';
import { PURRequisitionRModalComponent } from '../modal/module-purchase/pur-requisition-r-modal/pur-requisition-r-modal.component';
import { TableNavigationDirective } from '../controls/common/tab-navigation/tab-navigation';
import { ProductHistoryModalComponent } from '../modal/module-product/product-history-modal/product-history-modal.component';
import { FRERejectModalComponent } from '../modal/module-fre/fre-reject-modal/fre-reject-modal.component';
import { FREHistoryModalComponent } from '../modal/module-fre/fre-history-modal/fre-history-modal.component';
import { VHERejectModalComponent } from '../modal/module-vehicle/vhe-reject-modal/vhe-reject-modal.component';
import { VHEHistoryModalComponent } from '../modal/module-vehicle/vhe-history-modal/vhe-history-modal.component';
import { VHEVehicleRequestModalComponent } from '../modal/module-vehicle/vhe-vehicle-request/vhe-vehicle-request-modal.component';
import { VHEVehicleRequestCreateModalComponent } from '../modal/module-vehicle/vhe-vehicle-request-create/vhe-vehicle-request-create-modal.component';
import { VHEVehicleModalComponent } from '../modal/module-vehicle/vhe-vehicle/vhe-vehicle-modal.component';
import { FREFreightModalComponent } from '../modal/module-fre/fre-freight/fre-freight-modal.component';
import { TLUserModalComponent } from '../modal/module-user/tl-user/tl-user-modal.component';
import { VHEDriverModalComponent } from '../modal/module-vehicle/vhe-driver/vhe-driver-modal.component';
import { FREGoodsModalComponent } from '../modal/module-fre/fre-goods/fre-goods-modal.component';
import { FRELocationModalComponent } from '../modal/module-fre/fre-location/fre-location-modal.component';
import { PoProductOfRModalComponent } from '../modal/module-po/po-product-of-r-modal/po-product-of-r-modal.component';
import { PoProductOfPurchaseOutsourcedModalComponent } from '../modal/module-po/po-product-of-purchase-outsourced-modal copy/po-product-of-purchase-outsourced-modal.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    // suppressScrollX: true
};

export const commonDeclarationDeclarations = [
// Dùng chung toàn hệ thống
    ToolbarComponent,
    AuthStatusComponent,
    ControlComponent,
    TreeCheckboxSelectComponent,
    DateFormatPipe,
    DateTimeFormatPipe,
    TermFormatPipe,
    MoneyFormatPipe,
    NumberFormatPipe,
    CustomFlatpickrComponent,
    CkeditorControlComponent,
    RoleComboComponent,
    AppInfoDialogComponent,
    AppInfoComponent,
    CodeScannerComponent,
    FormatsDialogComponent,
    UploadSystemFile,
    //common
    ReportNoteModalComponent,
    ReportTemplateModalComponent,
    RejectModalComponent,
    PopupFrameComponent,
    PopupTableBaseComponent,
    MoneyInputComponent,
    MoneyInput5Component,
    UserModalComponent,
    ToolbarRejectExtComponent,
    TreeRadioSelectComponent,
    Paginator2Component,
    Select2CustomComponent,
    AllCodeSelectComponent,
    CoreTableComponent,
    AppPermissionTreeComponent,
    CheckboxControlComponent,
    EditableTableComponent,
    FilePickerComponent,
    BranchModalComponent,
    DepartmentModalComponent,
    FileMultiComponent,
    FileUploaderMultiModalComponent,
    FileUploaderComponent,
    FileSystemUploaderComponent,
    ImportExcelComponent,
    ImageCarouselComponent,
    ImageCarouselUploadModalComponent,
    InputSelectComponent,
    TextareaAutoresizeDirective,
    TableNavigationDirective,
    InputMultiSelectComponent,
    CMRejectModalComponent,
    inputAutoComplete,
    // Popup gửi yêu cầu có combobox
    CMSendWithComboboxModalComponent,
    TLRoleModalComponent,

//Status
    AuthStatusInputPageComponent,
    AuthStatus2Component,
    AuthStatus3Component,
    AuthStatus4Component,

// module user
    TLUserModalComponent,

// module common
    CMSupplierModalComponent,

// module PO
    //Hình ảnh PO
    POImageModalComponent,
    PoCustomerModalComponent,
    PoProductModalComponent,
    PoPOModalComponent,
    PoGroupProductModalComponent,
    POHistoryModalComponent,
    DocumentRoleModalComponent,
    POHistory2ModalComponent,
    HistoryModalComponent,
    POHistoryCreateModalComponent,
    History2ModalComponent,
    PoProductOfGroupProductModalComponent,
    PoGroupProductOfPOModalComponent,
    PoProductOfPOModalComponent,
    PoProductOfRModalComponent,
    PoProductOfPurchaseOutsourcedModalComponent,
    // vật tư hardware
    PoHardwareVTModalComponent,
    PoHardwareDGModalComponent,
    // R
    RModalComponent,
    // Bảng chiết tính
    PoCoststatementModalComponent,
    // Văn bản
    DocumentModalComponent,
    // Group R
    GroupRModalComponent,


// Module Phát triển dự án: projectdevelopment
    // Sản phẩm thuộc hệ hàng
    PDEProductWithConditionModalComponent,
    // popup hệ hàng mẫu
    PDEGroupProductModalComponent,
    
// Module Sản phẩm sản xuất: product
    //lich su
    ProductHistoryModalComponent,
    
    ProductDetailModalComponent, ProductGroupDetailModalComponent,
    ProductDetailOfProductGroupDetailModalComponent,
    GroupDetailOfProductModalComponent,
    ProductCoststatementModalComponent,
    ProductOfGroupProductModalComponent,
    ProductModalComponent,

// Module Kho vật liệu
    MWTypeMaterialModalComponent, MWTypeSupplierModalComponent,

// Module Chấm công
    TTHistoryModalComponent, TTRejectModalComponent, TTSuggestModalComponent,

// Module mua hàng
    PURRequisitionModalComponent, PURRequisitionMaterialModalComponent, PURMaterialSummaryModalComponent,
    PURRModalComponent, PURPOModalComponent, PURGroupProductModalComponent, PURProductModalComponent,
    PURProductGroupDetailModalComponent, PURProductDetailModalComponent, PURMaterialModalComponent,
    PUROrderMaterialModalComponent, PURUnitPriceOfMaterialModalComponent, PURRequisitionRModalComponent,

// Module vận chuyển hàng hóa
    FREHistoryModalComponent, FRERejectModalComponent, FREFreightModalComponent, FREGoodsModalComponent,
    FRELocationModalComponent,
// Module xe
    VHEHistoryModalComponent, VHERejectModalComponent, VHEDriverModalComponent,
    VHEVehicleRequestModalComponent, VHEVehicleRequestCreateModalComponent, VHEVehicleModalComponent,
];

@NgModule({
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        ModalModule.forRoot(),
        TreeModule,
        NgxCleaveDirectiveModule,
        UtilsModule,
        CKEditorModule,
        PaginatorModule,
        AutoCompleteModule,
        MatDialogModule,
        HttpModule,
        ZXingScannerModule,
        MatSelectModule,
        MatListModule,
        TableModule,
        RouterModule,
        WebcamModule,
        // module share
        AppShareModule,
    ],
    declarations: [
        commonDeclarationDeclarations
    ],
    exports: [
        commonDeclarationDeclarations,
        // module share
        AppShareModule,
    ],
    providers: [

    ]
})
export class CommonDeclarationDeclarationModule {

}

export const commonDeclarationImports = [
    ReactiveFormsModule,
    FileUploadModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    AppCommonModule,

    // PrimeNgFileUploadModule,
    InputMaskModule,
    TextMaskModule,
    ImageCropperModule,
    TableModule,
    TreeModule,
    DragDropModule,
    ContextMenuModule,
    PaginatorModule,
    AutoCompleteModule,
    UtilsModule,
    EditorModule,
    FormsModule,
    HttpModule,
    NgxCleaveDirectiveModule,
    CKEditorModule,
    CommonDeclarationDeclarationModule,
    WebcamModule,
    ZXingScannerModule,
    MatSelectModule,
    MatListModule,
    NgxChartsModule,
    TimelineModule
];

@NgModule({
    imports: [
        ngCommon.CommonModule,
        FormsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        TabsModule.forRoot(),
        BsDropdownModule.forRoot(),
        FileUploadModule,
        AbpModule,
        AppRoutingModule,
        UtilsModule,
        AppCommonModule.forRoot(),
        ServiceProxyModule,
        TableModule,
        PaginatorModule,
        AutoCompleteModule,
        PrimeNgFileUploadModule,
        ProgressBarModule,
        PerfectScrollbarModule,
        CoreModule,
        NgxChartsModule,
        TextMaskModule,
        ImageCropperModule,
        CommonDeclarationDeclarationModule,
        LSelect2Module,
        TimelineModule
    ],
    declarations: [
        HeaderNotificationsComponent,
        TopBarComponent,
        DefaultBrandComponent,
        SideBarMenuComponent
    ],
    exports: [
        HeaderNotificationsComponent,
        TopBarComponent,
        DefaultBrandComponent,
        SideBarMenuComponent,
    ],
    providers: [
        ImpersonationService,
        LinkedAccountService,
        UserNotificationHelper,
        AttachFileServiceProxy,
        ChatSignalrService,
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        LayoutConfigService,
        UtilsService,
        LayoutRefService
    ]
})
export class SideBarMenuModule {

}
