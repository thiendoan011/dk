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

        ApiServiceProxies.FreightServiceProxy,
        ApiServiceProxies.FreightUtilitiesServiceProxy,
        ApiServiceProxies.FREHistoryServiceProxy,
        ApiServiceProxies.LocationServiceProxy,
        ApiServiceProxies.GoodsServiceProxy,

        //modal of other module
        ApiServiceProxies.VHEVehicleRequestServiceProxy,
       { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true }
    ]
})
export class FreightServiceProxyModule { }
