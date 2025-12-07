import { NgModule } from '@angular/core';
import { commonDeclarationImports } from '../core/ultils/CommonDeclarationModule';
import { ProductRoutingModule } from './product-routing.module';
import { ProductServiceProxyModule } from './product-service-proxy.module';
import { ProductDetailEditComponent } from './product-detail/product-detail-edit.component';
import { ProductDetailListComponent } from './product-detail/product-detail-list.component';
import { ProductGroupDetailListComponent } from './product-group-detail/product-group-detail-list.component';
import { ProductGroupDetailEditComponent } from './product-group-detail/product-group-detail-edit.component';
import { ProductGroupDetailProductDetailEdittableComponent } from './product-group-detail/product-detail-edittable.component';
import { ProductProductListComponent } from './product/product-product-list.component';
import { ProductProductEditComponent } from './product/product-product-edit.component';
import { ProductCoststatementListComponent } from './product-coststatement/product-coststatement-list.component';
import { ProductCoststatementEditComponent } from './product-coststatement/product-coststatement-edit.component';
import { ProductCoststatementPGDEdittableComponent } from './product-coststatement/edittable/product-coststatement-pgd-edittable.component';
import { ProductCoststatementPDEdittableComponent } from './product-coststatement/edittable/product-coststatement-pd-edittable.component';
import { ProductCoststatementEdittableComponent } from './product/edittable/product-coststatement-edittable.component';
import { ProductGroupDetailEdittableComponent } from './product-group-detail/edittable-out/product-group-detail-edittable.component';
import { ProductImportComponent } from './product/product-import/product-import.component';
import { ProductProductDetailMaterialEdittableComponent } from './product-detail/edittable/product-product-detail-material-edittable.component';
import { ProductProductDetailMaterialNNEdittableComponent } from './product-detail/product-detail-material-nn/edittable/product-product-detail-material-nn-edittable.component';
import { ProductDetailMaterialNNListComponent } from './product-detail/product-detail-material-nn/product-detail-material-nn-list.component';
import { ProductDetailMaterialNNEditComponent } from './product-detail/product-detail-material-nn/product-detail-material-nn-edit.component';
import { ProductGroupDetailImportEdittabeComponent } from './product-group-detail/product-group-detail-import/product-group-detail-import-edittable/product-group-detail-import-edittable.component';
import { ProductGroupDetailImportComponent } from './product-group-detail/product-group-detail-import/product-group-detail-import.component';


export const ProductComponent = [
    
]

@NgModule({
    imports: [
        ProductRoutingModule,
        ProductServiceProxyModule,
        ...commonDeclarationImports,
    ],
    declarations: [
        // Sản phẩm
        ProductProductListComponent, ProductProductEditComponent,
        ProductCoststatementEdittableComponent, ProductImportComponent,
        // Mô tả chi tiết
        ProductDetailListComponent, ProductDetailEditComponent, ProductProductDetailMaterialEdittableComponent,
        ProductDetailMaterialNNListComponent, ProductDetailMaterialNNEditComponent, ProductProductDetailMaterialNNEdittableComponent,
        // Cụm chi tiết
        ProductGroupDetailListComponent, ProductGroupDetailEditComponent,
        ProductGroupDetailEdittableComponent,   // edittable-out
        ProductGroupDetailProductDetailEdittableComponent,
            //Cụm chi tiết import
            ProductGroupDetailImportComponent, ProductGroupDetailImportEdittabeComponent,
        // Bảng chiết tính
        ProductCoststatementListComponent, ProductCoststatementEditComponent, 
        ProductCoststatementPGDEdittableComponent, ProductCoststatementPDEdittableComponent
    ],
    exports: [

    ],
    providers: [

    ]
})
export class ProductModule { }
