import { AbpHttpInterceptor } from '@abp/abpHttpInterceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import * as ApiServiceProxies from '../../../shared/service-proxies/service-proxies'
import { PreviewTemplateService } from './preview-template/preview-template.service';
import { AccentsCharService } from '../core/ultils/accents-char.service';

@NgModule({
    providers: [
        ApiServiceProxies.AppMenuServiceProxy,
        ApiServiceProxies.TlUserServiceProxy,
        ApiServiceProxies.AppPermissionServiceProxy,
        ApiServiceProxies.SupplierServiceProxy,
        ApiServiceProxies.UnitServiceProxy,
        ApiServiceProxies.EmployeeServiceProxy,
        ApiServiceProxies.AllCodeServiceProxy,
        ApiServiceProxies.SysParametersServiceProxy,
        ApiServiceProxies.UltilityServiceProxy,
        ApiServiceProxies.ReportTemplateServiceProxy,
        ApiServiceProxies.CmUserServiceProxy,
        ApiServiceProxies.ExecQueryServiceProxy,
        ApiServiceProxies.AttachFileServiceProxy,
        PreviewTemplateService,
        AccentsCharService,
       { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true }
    ]
})
export class CommonServiceProxyModule { }
