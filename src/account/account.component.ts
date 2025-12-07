import { Component, ViewEncapsulation, Injector, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Thêm CommonModule để dùng @if, ngStyle
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts'; // Import AppConsts
import { LoginService } from './login/login.service';
import { LanguageSwitchComponent } from './language-switch.component';
import { TenantChangeComponent } from './shared/tenant-change.component';
// import { LocalizePipe } from "../shared/common/pipes/localize.pipe"; // Nếu dùng pipe | localize
// Nếu template bạn đã sửa dùng hàm l('key') thì KHÔNG CẦN import LocalizePipe

import moment from 'moment';
import { LocalizePipe } from "../shared/common/pipes/localize.pipe";

@Component({
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.less'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule, // Quan trọng: Cung cấp @if, [style], v.v.
        RouterOutlet,
        LanguageSwitchComponent,
        TenantChangeComponent,
        LocalizePipe
    ]
})
export class AccountComponent extends AppComponentBase implements OnInit, OnDestroy {

    private _loginService = inject(LoginService);

    // ✅ BỔ SUNG CÁC BIẾN CÒN THIẾU CHO TEMPLATE
    currentYear: number = moment().year();
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    logoLogin: string;

    constructor(injector: Injector) {
        super(injector);
        // Khởi tạo logo
        this.logoLogin = this.remoteServiceBaseUrl + '/assets/common/images/app-logo-on-light.svg';
        // Hoặc lấy từ setting nếu có: this.s('gAMSProCore.LogoLogin');
    }

    ngOnInit(): void {
        // 1. Gán class cho body
        document.body.className = 'header-fixed header-mobile-fixed subheader-enabled subheader-fixed aside-enabled aside-fixed aside-minimize-hoverable page-loading';

        // 2. Logic init cũ (nếu cần giữ lại logic redirect/clear)
        // this._loginService.clear(); 
    }

    ngOnDestroy(): void {
        document.body.className = '';
    }
}