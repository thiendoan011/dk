import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'moment-timezone';
import 'moment/min/locales.min';
import { environment } from './environments/environment';

import './polyfills.ts';
import { RootModule } from './root.module';


if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(RootModule)
    .catch(err => console.error(err));

