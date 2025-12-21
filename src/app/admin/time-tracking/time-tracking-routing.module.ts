import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TTLeaveEditComponent } from './leave/crud/leave-edit.component';
import { TTLeaveListComponent } from './leave/crud/leave-list.component';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { LeaveTransferListComponent } from './leave/transfer/leave-transfer-list.component';
import { TTLeaveNSEditComponent } from './leave/crud-ns/leave-ns-edit.component';
import { TTLeaveNSListComponent } from './leave/crud-ns/leave-ns-list.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    // Đơn xin nghỉ
                    { path: 'leave', component: TTLeaveListComponent, data: { permission: 'Pages.Administration.TTLeave' } },
                    { path: 'leave-add', component: TTLeaveEditComponent, data: { permission: 'Pages.Administration.TTLeave.Create', editPageState: EditPageState.add } },
                    { path: 'leave-edit', component: TTLeaveEditComponent, data: { permission: 'Pages.Administration.TTLeave.Edit', editPageState: EditPageState.edit } },
                    { path: 'leave-view', component: TTLeaveEditComponent, data: { permission: 'Pages.Administration.TTLeave.View', editPageState: EditPageState.viewDetail } },
                    // Điều phối đơn xin nghỉ
                    { path: 'leave-transfer-list', component: LeaveTransferListComponent, data: { permission: 'Pages.Administration.LeaveTransferList' } },
                    // Đơn xin nghỉ NS
                    { path: 'leave-ns', component: TTLeaveNSListComponent, data: { permission: 'Pages.Administration.TTLeaveNS' } },
                    { path: 'leave-ns-add', component: TTLeaveNSEditComponent, data: { permission: 'Pages.Administration.TTLeaveNS.Create', editPageState: EditPageState.add } },
                    { path: 'leave-ns-edit', component: TTLeaveNSEditComponent, data: { permission: 'Pages.Administration.TTLeaveNS.Edit', editPageState: EditPageState.edit } },
                    { path: 'leave-ns-view', component: TTLeaveNSEditComponent, data: { permission: 'Pages.Administration.TTLeaveNS.View', editPageState: EditPageState.viewDetail } },
                    
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class TimeTrackingRoutingModule {

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
