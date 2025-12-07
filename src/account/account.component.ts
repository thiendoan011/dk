import { Component, ViewEncapsulation, Injector, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LoginService } from './login/login.service';
import { LanguageSwitchComponent } from './language-switch.component';
import { TenantChangeComponent } from './shared/tenant-change.component'; // Đảm bảo component này cũng Standalone

@Component({
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.less'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        RouterOutlet,
        LanguageSwitchComponent,
        TenantChangeComponent
    ]
})
export class AccountComponent extends AppComponentBase implements OnInit, OnDestroy {
    private _loginService = inject(LoginService);

    constructor() {
        super(inject(Injector));
    }

    ngOnInit(): void {
        // FIX: Xóa bỏ this._loginService.init() và getSkin() gây lỗi
        // Thay bằng logic chuẩn Angular:

        // 1. Gán class cho body để nhận diện trang login (thay cho getSkin cũ)
        document.body.className = 'header-fixed header-mobile-fixed subheader-enabled subheader-fixed aside-enabled aside-fixed aside-minimize-hoverable page-loading';

        // 2. Clear session nếu cần thiết (tùy logic dự án cũ của bạn)
        // this._loginService.clear(); 
    }

    ngOnDestroy(): void {
        // Cleanup class khi rời khỏi trang account
        document.body.className = '';
    }
}