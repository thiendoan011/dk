import { Component, Injector, ViewEncapsulation, inject, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppUiCustomizationService } from '@shared/common/ui/app-ui-customization.service';
import { AppConsts } from '@shared/AppConsts';

@Component({
    selector: 'default-brand',
    templateUrl: './default-brand.component.html',
    standalone: true,
    imports: [CommonModule, RouterModule], // Import CommonModule nếu dùng *ngIf trong html
    encapsulation: ViewEncapsulation.None
})
export class DefaultBrandComponent extends AppComponentBase {

    // Inject UI Service để lấy logo
    uiCustomization = inject(AppUiCustomizationService);

    defaultLogo = '';
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;

    constructor(
        injector: Injector,
        @Inject(DOCUMENT) private document: Document
    ) {
        super(injector);
    }

    ngOnInit() {
        this.defaultLogo = this.appSession.theme.baseSettings.menu.asideSkin === 'light'
            ? 'logo.png'
            : 'logo_light.png';
    }

    clickTopbarToggle(): void {
        this.document.body.classList.toggle('m-topbar--on');
    }
    clickLeftAsideHideToggle(): void {
        this.document.body.classList.toggle('m-aside-left--hide');
    }
}