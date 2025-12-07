import { Component, Injector, ViewEncapsulation, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppUiCustomizationService } from '@shared/common/ui/app-ui-customization.service';

@Component({
    selector: 'theme2-brand',
    templateUrl: './theme2-brand.component.html',
    standalone: true,
    imports: [CommonModule],
    encapsulation: ViewEncapsulation.None
})
export class Theme2BrandComponent extends AppComponentBase implements OnInit {

    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    defaultLogo = '';

    // Inject Service
    uiCustomization = inject(AppUiCustomizationService);

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.defaultLogo = this.appSession.theme.baseSettings.menu.asideSkin === 'light'
            ? 'logo.png'
            : 'logo_light.png';
    }
}