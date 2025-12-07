import { Component, Injector, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule để dùng @for
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TenantRegistrationServiceProxy, EditionsSelectOutput, EditionSelectDto, EditionPaymentType } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';

@Component({
    templateUrl: './select-edition.component.html',
    styleUrls: ['./select-edition.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [accountModuleAnimation()],
    standalone: true, // ✅ Standalone
    imports: [CommonModule]
})
export class SelectEditionComponent extends AppComponentBase implements OnInit {

    editionsSelectOutput: EditionsSelectOutput = new EditionsSelectOutput();

    private _tenantRegistrationService = inject(TenantRegistrationServiceProxy);
    private _router = inject(Router);

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        this._tenantRegistrationService.getEditionsForSelect()
            .subscribe((result) => {
                this.editionsSelectOutput = result;
            });
    }

    // Logic chọn edition
    upgrade(edition: EditionSelectDto, upgradeEdition: EditionSelectDto): void {
        this._router.navigate(['/account/upgrade'], { queryParams: { upgradeEditionId: upgradeEdition.id, editionPaymentType: EditionPaymentType.Upgrade } });
    }
}