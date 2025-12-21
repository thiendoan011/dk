import { AbpHttpInterceptor } from '@abp/abpHttpInterceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import * as ApiServiceProxies from '../../../shared/service-proxies/service-proxies'

@NgModule({
    providers: [
        ApiServiceProxies.PoCustomerrServiceProxy,
        ApiServiceProxies.PoMasterServiceProxy,
        ApiServiceProxies.PoCustomerrServiceProxy,
        ApiServiceProxies.PoGroupProductServiceProxy,
        ApiServiceProxies.PoProductServiceProxy,
        ApiServiceProxies.PoPurchaseServiceProxy,
        ApiServiceProxies.PoProductedPartServiceProxy,
        ApiServiceProxies.BranchServiceProxy,
        ApiServiceProxies.DepartmentServiceProxy,
        ApiServiceProxies.PoAttachFileServiceProxy,
        ApiServiceProxies.PoDashboardServiceProxy,
        ApiServiceProxies.PoProductedPartDetailServiceProxy,
        ApiServiceProxies.PoReportServiceProxy,
        ApiServiceProxies.DocumentServiceProxy,
        ApiServiceProxies.UltilityServiceProxy,
        ApiServiceProxies.PoLayoutServiceProxy,
        ApiServiceProxies.PoProductedPartVeneerServiceProxy,
        ApiServiceProxies.PoHardwareVTServiceProxy,
        ApiServiceProxies.PoHardwareDGServiceProxy,
        ApiServiceProxies.PoImageServiceProxy,
        ApiServiceProxies.PoCoststatementServiceProxy,
        ApiServiceProxies.RServiceProxy,
        ApiServiceProxies.ProductProductServiceProxy,
        ApiServiceProxies.PoLoadContServiceProxy,
        ApiServiceProxies.PoBookingServiceProxy,
        ApiServiceProxies.PoModifiedServiceProxy,
        ApiServiceProxies.GroupRServiceProxy,
        ApiServiceProxies.PoUtilitiesServiceProxy,
        ApiServiceProxies.PoDailyKPIServiceProxy,
        ApiServiceProxies.PoDelayServiceProxy,
        ApiServiceProxies.POPOProductDetailServiceProxy,
        

        { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true }
    ]
})
export class PoMasterServiceProxyModule { }
