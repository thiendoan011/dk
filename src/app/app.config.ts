import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
// import { ModalModule } from 'ngx-bootstrap/modal'; // Ví dụ nếu cần import global modules

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(
            routes,
            withComponentInputBinding(),
            withViewTransitions()
        ),
        provideHttpClient(
            withFetch()
        ),
        provideAnimations(),
        // importProvidersFrom(ModalModule.forRoot()) // Nếu dùng ngx-bootstrap global
    ]
};