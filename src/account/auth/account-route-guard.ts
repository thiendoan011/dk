import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AppSessionService } from '@shared/common/session/app-session.service';

export const accountRouteGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const sessionService = inject(AppSessionService);

    // Nếu đã có user (đã login), không cho vào trang login/register nữa -> đá về trang chính
    if (sessionService.user) {
        router.navigate(['/app/main/dashboard']);
        return false;
    }

    return true;
};