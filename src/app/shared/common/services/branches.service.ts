import { Injectable } from "@angular/core";
import { AuthStatusConsts } from "@app/admin/core/ultils/consts/AuthStatusConsts";
import { RecordStatusConsts } from "@app/admin/core/ultils/consts/RecordStatusConsts";
import { BranchServiceProxy, CM_BRANCH_ENTITY } from "@shared/service-proxies/service-proxies";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
  })
  export class BranchServices {
    constructor(
        private _branchService: BranchServiceProxy,
    ) 
    {}

    async getData(): Promise<CM_BRANCH_ENTITY[]> {
        let filterCombobox: any = {
          maxResultCount: -1,
          recorD_STATUS: RecordStatusConsts.Active,
          autH_STATUS: AuthStatusConsts.Approve
        };
    
        try {
          const response = await this._branchService.cM_BRANCH_Search(filterCombobox).toPromise();
          return response.items as CM_BRANCH_ENTITY[];
        } catch (error) {
          console.error('Error while fetching data:', error);
          return []; // hoặc xử lý lỗi khác tùy ý
        }
    }
  }