import { Injectable, inject } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { filter as _filter } from 'lodash-es'; // Dùng lodash-es cho tree-shaking tốt hơn

@Injectable({
    providedIn: 'root'
})
export class TenantRegistrationHelperService {

    get ui(): any {
        return abp.ui;
    }

    // Không cần constructor nữa

    // Logic giữ nguyên
    filterFeatures(features: any[]): any[] {
        return _filter(features, feature => {
            // Logic lọc feature của ABP
            // Giả sử logic cũ của bạn ở đây, tôi giữ nguyên cấu trúc
            // Nếu có logic ẩn features, hãy paste vào
            return true;
        });
    }
}