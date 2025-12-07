// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { RootComponent } from './root.component'; // Dùng RootComponent làm vỏ bọc

bootstrapApplication(RootComponent, appConfig)
    .catch((err) => console.error(err));