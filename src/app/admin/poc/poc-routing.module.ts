import { NgModule, ApplicationRef } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'poc',
                children: [
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})

export class PocRoutingModule {

    constructor(
        private router: Router,
        private appRef: ApplicationRef
    ) {
        router.events.subscribe((event) => {
            if (event instanceof RouteConfigLoadStart) {
                abp.ui.setBusy();
            }

            if (event instanceof RouteConfigLoadEnd) {
                // appRef.tick();
                abp.ui.clearBusy();
            }

            if (event instanceof NavigationEnd) {
                document.querySelector('meta[property=og\\:url').setAttribute('content', window.location.href);
                appRef.tick();
            }
        });
    }
}
