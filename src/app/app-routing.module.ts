// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRouteGuard } from './shared/common/auth/auth-route-guard';
import { NotificationsComponent } from './shared/layout/notifications/notifications.component';
import { TermsOfUseComponent } from './main/terms-of-use/terms-of-use.component';

export const appRoutes: Routes = [
    {
        path: 'app',
        component: AppComponent, // Đây là Layout chính sau khi login
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'notifications', component: NotificationsComponent },
                    { path: 'terms-of-use', component: TermsOfUseComponent },
                    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
                ]
            },
            {
                path: 'main',
                // TODO: Sau khi convert MainModule sang Standalone Routes, sửa dòng này thành:
                // loadChildren: () => import('./main/main.routes').then(m => m.mainRoutes)
                loadChildren: () => import('./main/main.module').then(m => m.MainModule),
                data: { preload: true }
            },
            {
                path: 'admin',
                // TODO: Sau khi convert AdminModule sang Standalone Routes, sửa dòng này thành:
                // loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes)
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