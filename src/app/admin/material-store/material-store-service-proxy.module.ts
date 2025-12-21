import { AbpHttpInterceptor } from '@abp/abpHttpInterceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import * as ApiServiceProxies from '../../../shared/service-proxies/service-proxies'

@NgModule({
    providers: [
        ApiServiceProxies.BranchServiceProxy,
        ApiServiceProxies.DepartmentServiceProxy,
        ApiServiceProxies.UltilityServiceProxy,
        ApiServiceProxies.UnitServiceProxy,
        ApiServiceProxies.MWWarehouseServiceProxy,
        ApiServiceProxies.MWGroupServiceProxy,
        ApiServiceProxies.MWTypeServiceProxy,
        { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true }
    ]
})
export class MaterialStoreServiceProxyModule { }
