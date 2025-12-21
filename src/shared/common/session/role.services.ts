import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service';
import { Injectable } from '@angular/core';
import { ApplicationInfoDto, GetCurrentLoginInformationsOutput, SessionServiceProxy, TenantLoginInfoDto, UserLoginInfoDto, UiCustomizationSettingsDto, ProfileServiceProxy, TL_ROLE_ENTITY, CurrentUserProfileEditDto, UserListRoleDto } from '@shared/service-proxies/service-proxies';

@Injectable()
export class RoleService {
    private _listRoleUser: UserListRoleDto[];

    constructor(
        private _profileService: ProfileServiceProxy) {
    }

    get listRoleUser(): UserListRoleDto[] {
        return this._listRoleUser;
    }

    init() {
        this._profileService.getCurrentUserProfileForEdit().subscribe(response => {
            this._listRoleUser = response.roles;
        });
    }
}
