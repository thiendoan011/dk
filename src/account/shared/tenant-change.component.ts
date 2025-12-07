import { Component, Injector, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AccountServiceProxy } from '@shared/service-proxies/service-proxies';
import { TenantChangeModalComponent } from './tenant-change-modal.component';

@Component({
    selector: 'tenant-change',
    template: `
    @if (isMultiTenancyEnabled) {
        <span>
            {{l("CurrentTenant")}}: 
            
            @if (tenancyName) {
                <span title="{{name}}"><strong>{{tenancyName}}</strong></span>
            } @else {
                <span>{{l("NotSelected")}}</span>
            }
            
            (<a href="javascript:;" (click)="showChangeModal()">{{l("Change")}}</a>)
            
            <tenantChangeModal #tenantChangeModal></tenantChangeModal>
        </span>
    }
    `,
    standalone: true, // ✅ Standalone
    imports: [
        CommonModule,
        TenantChangeModalComponent // ✅ Import component con
    ]
})
export class TenantChangeComponent extends AppComponentBase implements OnInit {

    @ViewChild('tenantChangeModal') tenantChangeModal: TenantChangeModalComponent;

    tenancyName: string;
    name: string;

    // REFACTOR: inject()
    private _accountService = inject(AccountServiceProxy);

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        if (this.appSession.tenant) {
            this.tenancyName = this.appSession.tenant.tenancyName;
            this.name = this.appSession.tenant.name;
        }
    }

    get isMultiTenancyEnabled(): boolean {
        return abp.multiTenancy.isEnabled;
    }

    showChangeModal(): void {
        this.tenantChangeModal.show(this.tenancyName);
    }
}