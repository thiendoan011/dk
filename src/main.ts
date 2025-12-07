// src/main.ts
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import 'moment-timezone';
import 'moment/min/locales.min';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component'; // Đảm bảo AppComponent đã là standalone: true
import { appConfig } from './app/app.config';

if (environment.production) {
    enableProdMode();
}

// Modern Bootstrap
bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err));