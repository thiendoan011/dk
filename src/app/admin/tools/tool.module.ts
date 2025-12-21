import { NgModule } from '@angular/core';
import { commonDeclarationImports } from '../core/ultils/CommonDeclarationModule';
import { ToolRoutingModule } from './tool-routing.module';
import { ToolServiceProxyModule } from './tool-service-proxy.module';
@NgModule({
    imports: [
        ...commonDeclarationImports,
        ToolRoutingModule,
        ToolServiceProxyModule
    ],
    declarations: [
    ],
    exports: [

    ],
    providers: [

    ]
})
export class ToolModule { }
