import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TermsOfUseComponent } from './main/terms-of-use/terms-of-use.component';
import { AppRouteGuard } from './shared/common/auth/auth-route-guard';
import { NotificationsComponent } from './shared/layout/notifications/notifications.component';

export const routes: Routes = [
    {
        path: 'app',
        component: AppComponent,
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'notifications', component: NotificationsComponent },
                    { path: 'terms-of-use', component: TermsOfUseComponent },
                    { path: '', redirectTo: '/app/main/dashboard', pathMatch: 'full' }
                ]
            },
            {
                path: 'main',
                // Lưu ý: Khi refactor xong MainModule sang Standalone, hãy đổi thành loadComponent
                loadChildren: () => import('./main/main.module').then(m => m.MainModule),
                data: { preload: true }
            },
            {
                path: 'admin',
                // Lưu ý: Tương tự cho AdminModule
                loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
                data: { preload: true },
                canLoad: [AppRouteGuard]
            },
            {
                path: '**', redirectTo: 'notifications'
            }
        ]
    }
];