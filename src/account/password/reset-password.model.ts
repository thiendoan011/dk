// src/account/password/reset-password.model.ts
import { ResetPasswordInput } from '@shared/service-proxies/service-proxies';

export class ResetPasswordModel extends ResetPasswordInput {
    // Kế thừa từ class sinh ra bởi NSwag/Swagger
    // Thêm field để confirm password trên UI
    passwordRepeat: string;
}