import { NgModule } from '@angular/core';
import { AppMenuListComponent } from './app-menus/app-menu-list.component';
import { commonDeclarationImports } from '../core/ultils/CommonDeclarationModule';
import { CommonRoutingModule } from './common-routing.module';
import { CommonServiceProxyModule } from './common-service-proxy.module';
import { AppMenuEditComponent } from './app-menus/app-menu-edit.component';
import { BranchEditComponent } from './branchs/branch-edit.component';
import { BranchListComponent } from './branchs/branch-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DepartmentEditComponent } from './departments/department-edit.component';
import { DepartmentListComponent } from './departments/department-list.component';
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
import { PreviewTemplateModalComponent } from './report-template/preview-template-modal.component';
import { PreviewTemplateComponent } from './preview-template/preview-template.component';
import { TestQrComponent } from './test-qr/test-qr.component';
import { ExecQueryComponent } from './exec-queries/exec-queries.component';
import { RouterModule } from '@angular/router';
import { TlUserListComponent } from './tlusers/tluser-list.component';
import { TlUserEditComponent } from './tlusers/tluser-edit.component';
import { MenuIconComponent } from './menu-icon/menu-icon.component';
import { ChartsModule } from 'ng2-charts';
import { CMSupplierListComponent } from './cm-supplier/cm-supplier-list.component';
import { CMSupplierEditComponent } from './cm-supplier/cm-supplier-edit.component';

@NgModule({
    imports: [
        ...commonDeclarationImports,
        ChartsModule,
        RouterModule,
        CommonRoutingModule,
        CommonServiceProxyModule
    ],
    declarations: [
        DashboardComponent,
        AppMenuListComponent,
        AppMenuEditComponent,
        BranchEditComponent,
        BranchListComponent,
        DepartmentListComponent,
        DepartmentEditComponent,
        UnitListComponent,
        UnitEditComponent,
        EmployeeListComponent,
        EmployeeEditComponent,
        AllCodeListComponent,
        AllCodeEditComponent,
        SysParameterListComponent,
        AsposeSampleComponent,
        SysParameterEditComponent,
        ReportTemplateListComponent,
        ReportTemplateEditComponent,
        PreviewTemplateComponent,
        TestQrComponent,
        ExecQueryComponent,
        PreviewTemplateModalComponent,
        MenuIconComponent,
        // Người dùng
        TlUserListComponent, TlUserEditComponent,
        CMSupplierListComponent, CMSupplierEditComponent
    ],
    exports: [

    ],
    providers: [
    ]
})
export class CCommonModule { }
