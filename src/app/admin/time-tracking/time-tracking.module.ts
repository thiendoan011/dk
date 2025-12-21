import { commonDeclarationImports, SideBarMenuModule } from "../core/ultils/CommonDeclarationModule";
import { TTLeaveNSEditComponent } from "./leave/crud-ns/leave-ns-edit.component";
import { TTLeaveNSListComponent } from "./leave/crud-ns/leave-ns-list.component";
import { TTLeaveEditComponent } from "./leave/crud/leave-edit.component";
import { TTLeaveListComponent } from "./leave/crud/leave-list.component";
import { LeaveTransferListComponent } from "./leave/transfer/leave-transfer-list.component";
import { TimeTrackingRoutingModule } from "./time-tracking-routing.module";
import { TimeTrackingServiceProxyModule } from "./time-tracking-service-proxy.module";
import { NgModule } from "@angular/core";

@NgModule({
    imports: [
        commonDeclarationImports,
        TimeTrackingRoutingModule,
        TimeTrackingServiceProxyModule,
    ],
    declarations: [
        // Đơn xin nghỉ
        TTLeaveListComponent, TTLeaveEditComponent, LeaveTransferListComponent,
        // Đơn xin nghỉ NS
        TTLeaveNSListComponent, TTLeaveNSEditComponent,
	],
    exports: [

    ],
    providers: [
    ]
})
export class TimeTrackingModule { }
