// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// Import các module legacy cần thiết (ABP modules)
import { AbpModule } from 'abp-ng2-module';
import { RootRoutingModule } from 'root-routing.module';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }), // Tối ưu hiệu năng Change Detection
        provideRouter([
            {
                path: 'account',
                loadChildren: () => import('../account/account.routes').then(m => m.accountRoutes)
            }
        ], withComponentInputBinding(), withViewTransitions()), // Router hiện đại
        provideAnimationsAsync(),
        provideHttpClient(withInterceptorsFromDi()), // HTTP Client mới

        // Cầu nối cho các thư viện cũ (Legacy Modules)
        importProvidersFrom(
            AbpModule,
            RootRoutingModule
            // Thêm các module khác nếu chưa kịp migrate sang standalone
        )
    ]
};