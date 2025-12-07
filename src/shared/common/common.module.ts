
import * as ngCommon from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AppUrlService } from './nav/app-url.service';
import { AppUiCustomizationService } from './ui/app-ui-customization.service';
import { AppSessionService } from './session/app-session.service';
import { CookieConsentService } from './session/cookie-consent.service';
import { ProfileServiceProxy } from '@shared/service-proxies/service-proxies';

@NgModule({
    imports: [
        ngCommon.CommonModule
    ],
    exports: [
        ngCommon.CommonModule
    ]
})
export class CommonModule {
    static forRoot(): ModuleWithProviders<CommonModule> {
        return {
            ngModule: CommonModule,
            providers: [
                AppUiCustomizationService,
                CookieConsentService,
                AppSessionService,
                ProfileServiceProxy,
                AppUrlService
            ]
        };
    }
}
