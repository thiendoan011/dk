import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { ProductDetailListComponent } from './product-detail/product-detail-list.component';
import { ProductDetailEditComponent } from './product-detail/product-detail-edit.component';
import { ProductGroupDetailListComponent } from './product-group-detail/product-group-detail-list.component';
import { ProductGroupDetailEditComponent } from './product-group-detail/product-group-detail-edit.component';
import { ProductProductEditComponent } from './product/product-product-edit.component';
import { ProductProductListComponent } from './product/product-product-list.component';
import { ProductCoststatementEditComponent } from './product-coststatement/product-coststatement-edit.component';
import { ProductCoststatementListComponent } from './product-coststatement/product-coststatement-list.component';
import { ProductImportComponent } from './product/product-import/product-import.component';
import { ProductDetailMaterialNNListComponent } from './product-detail/product-detail-material-nn/product-detail-material-nn-list.component';
import { ProductDetailMaterialNNEditComponent } from './product-detail/product-detail-material-nn/product-detail-material-nn-edit.component';
import { ProductGroupDetailImportComponent } from './product-group-detail/product-group-detail-import/product-group-detail-import.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    // Sản phẩm
                    { path: 'product-product', component: ProductProductListComponent, data: { permission: 'Pages.Administration.ProductProduct' } },
                    { path: 'product-product-add', component: ProductProductEditComponent, data: { permission: 'Pages.Administration.ProductProduct.Create', editPageState: EditPageState.add } },
                    { path: 'product-product-edit', component: ProductProductEditComponent, data: { permission: 'Pages.Administration.ProductProduct.Edit', editPageState: EditPageState.edit } },
                    { path: 'product-product-view', component: ProductProductEditComponent, data: { permission: 'Pages.Administration.ProductProduct.View', editPageState: EditPageState.viewDetail } },
                        // Sản phẩm Import
                    { path: 'product-import', component: ProductImportComponent, data: { permission: 'Pages.Administration.ProductImport' } },  
                    
                    // Cụm chi tiết
                    { path: 'product-group-detail', component: ProductGroupDetailListComponent, data: { permission: 'Pages.Administration.ProductGroupDetail' } },
                    { path: 'product-group-detail-add', component: ProductGroupDetailEditComponent, data: { permission: 'Pages.Administration.ProductGroupDetail.Create', editPageState: EditPageState.add } },
                    { path: 'product-group-detail-edit', component: ProductGroupDetailEditComponent, data: { permission: 'Pages.Administration.ProductGroupDetail.Edit', editPageState: EditPageState.edit } },
                    { path: 'product-group-detail-view', component: ProductGroupDetailEditComponent, data: { permission: 'Pages.Administration.ProductGroupDetail.View', editPageState: EditPageState.viewDetail } },
                        // Cụm chi tiết Import
                    { path: 'product-group-detail-import', component: ProductGroupDetailImportComponent, data: { permission: 'Pages.Administration.ProductGroupDetailImport' } },  
                
                    
                    // mô tả chi tiết
                    { path: 'product-detail', component: ProductDetailListComponent, data: { permission: 'Pages.Administration.ProductDetail' } },
                    { path: 'product-detail-add', component: ProductDetailEditComponent, data: { permission: 'Pages.Administration.ProductDetail.Create', editPageState: EditPageState.add } },
                    { path: 'product-detail-edit', component: ProductDetailEditComponent, data: { permission: 'Pages.Administration.ProductDetail.Edit', editPageState: EditPageState.edit } },
                    { path: 'product-detail-view', component: ProductDetailEditComponent, data: { permission: 'Pages.Administration.ProductDetail.View', editPageState: EditPageState.viewDetail } },
                    // mô tả chi tiết nguyên liệu
                    { path: 'product-detail-material-nn', component: ProductDetailMaterialNNListComponent, data: { permission: 'Pages.Administration.ProductDetailMaterialNN' } },
                    { path: 'product-detail-material-nn-add', component: ProductDetailMaterialNNEditComponent, data: { permission: 'Pages.Administration.ProductDetailMaterialNN.Create', editPageState: EditPageState.add } },
                    { path: 'product-detail-material-nn-edit', component: ProductDetailMaterialNNEditComponent, data: { permission: 'Pages.Administration.ProductDetailMaterialNN.Edit', editPageState: EditPageState.edit } },
                    { path: 'product-detail-material-nn-view', component: ProductDetailMaterialNNEditComponent, data: { permission: 'Pages.Administration.ProductDetailMaterialNN.View', editPageState: EditPageState.viewDetail } },
                    
                    
                    // Bảng chiết tính
                    { path: 'product-coststatement', component: ProductCoststatementListComponent, data: { permission: 'Pages.Administration.ProductCoststatement' } },
                    { path: 'product-coststatement-add', component: ProductCoststatementEditComponent, data: { permission: 'Pages.Administration.ProductCoststatement.Create', editPageState: EditPageState.add } },
                    { path: 'product-coststatement-edit', component: ProductCoststatementEditComponent, data: { permission: 'Pages.Administration.ProductCoststatement.Edit', editPageState: EditPageState.edit } },
                    { path: 'product-coststatement-view', component: ProductCoststatementEditComponent, data: { permission: 'Pages.Administration.ProductCoststatement.View', editPageState: EditPageState.viewDetail } },
                    
                    
                    
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ProductRoutingModule {

    constructor(
        router: Router
    ) {
        router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                window.scroll(0, 0);
            }
        });
    }
}
