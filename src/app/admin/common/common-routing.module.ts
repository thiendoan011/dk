import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouteReuseStrategy } from '@angular/router';
import { AppMenuListComponent } from './app-menus/app-menu-list.component';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AppMenuEditComponent } from './app-menus/app-menu-edit.component';
import { BranchListComponent } from './branchs/branch-list.component';
import { BranchEditComponent } from './branchs/branch-edit.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DepartmentListComponent } from './departments/department-list.component';
import { DepartmentEditComponent } from './departments/department-edit.component';
import { UnitListComponent } from './units/unit-list.component';
import { UnitEditComponent } from './units/unit-edit.component';
import { EmployeeListComponent } from './employees/employee-list.component';
import { EmployeeEditComponent } from './employees/employee-edit.component';
import { AllCodeListComponent } from './all-codes/all-code-list.component';
import { AllCodeEditComponent } from './all-codes/all-code-edit.component';
import { SysParameterListComponent } from './sysparameters/sysparameter-list.component';
import { SysParameterEditComponent } from './sysparameters/sysparameter-edit.component';
import { AsposeSampleComponent } from './aspose-sample/aspose-sample.component';
import { ReportTemplateListComponent } from './report-template/report-template-list.component';
import { ReportTemplateEditComponent } from './report-template/report-template-edit.component';
import { PreviewTemplateComponent } from './preview-template/preview-template.component';
import { TestQrComponent } from './test-qr/test-qr.component';
import { ExecQueryComponent } from './exec-queries/exec-queries.component';
import { TlUserListComponent } from './tlusers/tluser-list.component';
import { TlUserEditComponent } from './tlusers/tluser-edit.component';
import { MenuIconComponent } from './menu-icon/menu-icon.component';
import { UploadSystemFile } from './upload-system-file/upload-system-file.component';
import { CMSupplierListComponent } from './cm-supplier/cm-supplier-list.component';
import { CMSupplierEditComponent } from './cm-supplier/cm-supplier-edit.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'dashboard', component: DashboardComponent},

                    // Thông tin trang
                    { path: 'app-menu', component: AppMenuListComponent, data: { permission: 'Pages.Administration.Menu' } },
                    { path: 'app-menu-add', component: AppMenuEditComponent, data: { permission: 'Pages.Administration.Menu.Create', editPageState: EditPageState.add } },
                    { path: 'app-menu-edit', component: AppMenuEditComponent, data: { permission: 'Pages.Administration.Menu.Edit', editPageState: EditPageState.edit } },
                    { path: 'app-menu-view', component: AppMenuEditComponent, data: { permission: 'Pages.Administration.Menu.View', editPageState: EditPageState.viewDetail } },

                    // Upload system file
                    { path: 'upload-system', component : UploadSystemFile, data: { permission: 'Pages.Administration.UploadSystemFile' }},

                    // Danh mục đơn vị
                    { path: 'branch', component: BranchListComponent, data: { permission: 'Pages.Administration.Branch' } },
                    { path: 'branch-add', component: BranchEditComponent, data: { permission: 'Pages.Administration.Branch.Create', editPageState: EditPageState.add } },
                    { path: 'branch-edit', component: BranchEditComponent, data: { permission: 'Pages.Administration.Branch.Edit', editPageState: EditPageState.edit } },
                    { path: 'branch-view', component: BranchEditComponent, data: { permission: 'Pages.Administration.Branch.View', editPageState: EditPageState.viewDetail } },

                    // Danh mục người dùng
                    { path: 'tluser', component: TlUserListComponent, data: { permission: 'Pages.Administration.TlUser' } },
                    { path: 'tluser-add', component: TlUserEditComponent, data: { permission: 'Pages.Administration.TlUser.Create', editPageState: EditPageState.add } },
                    { path: 'tluser-edit', component: TlUserEditComponent, data: { permission: 'Pages.Administration.TlUser.Edit', editPageState: EditPageState.edit } },
                    { path: 'tluser-view', component: TlUserEditComponent, data: { permission: 'Pages.Administration.TlUser.View', editPageState: EditPageState.viewDetail } },

                    // Danh mục phòng
                    { path: 'department', component: DepartmentListComponent, data: { permission: 'Pages.Administration.Department' } },
                    { path: 'department-add', component: DepartmentEditComponent, data: { permission: 'Pages.Administration.Department.Create', editPageState: EditPageState.add } },
                    { path: 'department-edit', component: DepartmentEditComponent, data: { permission: 'Pages.Administration.Department.Edit', editPageState: EditPageState.edit } },
                    { path: 'department-view', component: DepartmentEditComponent, data: { permission: 'Pages.Administration.Department.View', editPageState: EditPageState.viewDetail } },

                    // Danh mục nhà cung cấp
                    { path: 'cm-supplier', component: CMSupplierListComponent, data: { permission: 'Pages.Administration.CMSupplier' } },
                    { path: 'cm-supplier-add', component: CMSupplierEditComponent, data: { permission: 'Pages.Administration.CMSupplier.Create', editPageState: EditPageState.add } },
                    { path: 'cm-supplier-edit', component: CMSupplierEditComponent, data: { permission: 'Pages.Administration.CMSupplier.Edit', editPageState: EditPageState.edit } },
                    { path: 'cm-supplier-view', component: CMSupplierEditComponent, data: { permission: 'Pages.Administration.CMSupplier.View', editPageState: EditPageState.viewDetail } },

                    // Danh mục đơn vị tính
                    { path: 'unit', component: UnitListComponent, data: { permission: 'Pages.Administration.Unit' } },
                    { path: 'unit-add', component: UnitEditComponent, data: { permission: 'Pages.Administration.Unit.Create', editPageState: EditPageState.add } },
                    { path: 'unit-edit', component: UnitEditComponent, data: { permission: 'Pages.Administration.Unit.Edit', editPageState: EditPageState.edit } },
                    { path: 'unit-view', component: UnitEditComponent, data: { permission: 'Pages.Administration.Unit.View', editPageState: EditPageState.viewDetail } },

                    // Danh mục nhân viên
                    { path: 'employee', component: EmployeeListComponent, data: { permission: 'Pages.Administration.Employee' } },
                    { path: 'employee-add', component: EmployeeEditComponent, data: { permission: 'Pages.Administration.Employee.Create', editPageState: EditPageState.add } },
                    { path: 'employee-edit', component: EmployeeEditComponent, data: { permission: 'Pages.Administration.Employee.Edit', editPageState: EditPageState.edit } },
                    { path: 'employee-view', component: EmployeeEditComponent, data: { permission: 'Pages.Administration.Employee.View', editPageState: EditPageState.viewDetail } },

                    // Danh mục trường giao dịch
                    { path: 'all-code', component: AllCodeListComponent, data: { permission: 'Pages.Administration.AllCode' } },
                    { path: 'all-code-add', component: AllCodeEditComponent, data: { permission: 'Pages.Administration.AllCode.Create', editPageState: EditPageState.add } },
                    { path: 'all-code-edit', component: AllCodeEditComponent, data: { permission: 'Pages.Administration.AllCode.Edit', editPageState: EditPageState.edit } },
                    { path: 'all-code-view', component: AllCodeEditComponent, data: { permission: 'Pages.Administration.AllCode.View', editPageState: EditPageState.viewDetail } },

                    // Tham số hệ thống
                    { path: 'argument', component: SysParameterListComponent, data: { permission: 'Pages.Administration.SysParameter' } },
                    { path: 'argument-add', component: SysParameterEditComponent, data: { permission: 'Pages.Administration.SysParameter.Create', editPageState: EditPageState.add } },
                    { path: 'argument-edit', component: SysParameterEditComponent, data: { permission: 'Pages.Administration.SysParameter.Edit', editPageState: EditPageState.edit } },
                    { path: 'argument-view', component: SysParameterEditComponent, data: { permission: 'Pages.Administration.SysParameter.View', editPageState: EditPageState.viewDetail } },

                    { path: 'aspose-sample', component: AsposeSampleComponent },

                    // Mẫu báo cáo
                    { path: 'reporttemplate', component: ReportTemplateListComponent, data: { permission: 'Pages.Administration.ReportTemplate' } },
                    { path: 'reporttemplate-add', component: ReportTemplateEditComponent, data: { permission: 'Pages.Administration.ReportTemplate.Create', editPageState: EditPageState.add } },
                    { path: 'reporttemplate-edit', component: ReportTemplateEditComponent, data: { permission: 'Pages.Administration.ReportTemplate.Edit', editPageState: EditPageState.edit } },
                    { path: 'reporttemplate-view', component: ReportTemplateEditComponent, data: { permission: 'Pages.Administration.ReportTemplate.View', editPageState: EditPageState.viewDetail } },

                    // Menu icon
                    { path: 'menu-icon', component: MenuIconComponent },

                    { path: 'previewtemplate', component: PreviewTemplateComponent, data: { permission: 'Pages.Administration.PreviewTemplate' } },
                    { path: 'test-qr', component: TestQrComponent },
                    { path: 'exec-query', component: ExecQueryComponent },
                ]
            }
        ])
    ],
    providers: [
    ],
    exports: [
        RouterModule
    ]
})
export class CommonRoutingModule {

    constructor(
        private router: Router
    ) {
        router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                window.scroll(0, 0);
            }
        });
    }
}
