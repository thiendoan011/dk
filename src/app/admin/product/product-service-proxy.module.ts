import { AbpHttpInterceptor } from '@abp/abpHttpInterceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import * as ApiServiceProxies from '../../../shared/service-proxies/service-proxies'

@NgModule({
    providers: [
        ApiServiceProxies.BranchServiceProxy,
        ApiServiceProxies.DepartmentServiceProxy,
        ApiServiceProxies.UltilityServiceProxy,
        ApiServiceProxies.ProductDetailServiceProxy,
        ApiServiceProxies.ProductGroupDetailServiceProxy,
        ApiServiceProxies.ProductProductServiceProxy,
        ApiServiceProxies.ProductCoststatementServiceProxy,
        ApiServiceProxies.ProductUtilitiesServiceProxy,
        { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true }
    ]
})
export class ProductServiceProxyModule { }
