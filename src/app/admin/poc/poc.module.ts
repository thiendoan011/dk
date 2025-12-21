import { commonDeclarationImports, SideBarMenuModule } from "../core/ultils/CommonDeclarationModule";
import { PocRoutingModule } from "./poc-routing.module";
import { PocServiceProxyModule } from "./poc-service-proxy.module";
import { NgModule } from "@angular/core";
import { ChartsModule } from 'ng2-charts';
import { ImpersonationService } from "../zero-base/users/impersonation.service";
import { LinkedAccountService } from "@app/shared/layout/linked-account.service";
import { UserNotificationHelper } from "@app/shared/layout/notifications/UserNotificationHelper";
import { LayoutConfigService } from "@metronic/app/core/services/layout-config.service";
import { UtilsService } from "abp-ng2-module/dist/src/utils/utils.service";
import { LayoutRefService } from "@metronic/app/core/services/layout/layout-ref.service";

@NgModule({
    imports: [
        commonDeclarationImports,
        PocRoutingModule,
        PocServiceProxyModule,
    ],
    declarations: [
	],
    exports: [

    ],
    providers: [
    ]
})
export class PocModule { }
