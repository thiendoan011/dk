import { Component, Injector, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    templateUrl: './register-tenant-result.component.html',
    animations: [accountModuleAnimation()],
    standalone: true, // ✅ Standalone
    imports: [
        CommonModule,
        RouterLink
    ]
})
export class RegisterTenantResultComponent extends AppComponentBase implements OnInit {

    tenantId: number;
    isActive: boolean;
    tenantLoginAddress: string;

    private _router = inject(Router);
    private _activatedRoute = inject(ActivatedRoute);

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        // Lấy params từ query string
        this.tenantId = parseInt(this._activatedRoute.snapshot.queryParams['tenantId']);
        this.isActive = this._activatedRoute.snapshot.queryParams['isActive'] === 'true';

        // Tạo URL login giả định cho tenant (tùy logic Subdomain hay Path)
        // this.tenantLoginAddress = ... 
    }
}