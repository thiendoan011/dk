import { PocRoutingModule } from "./poc-routing.module";
import { PocServiceProxyModule } from "./poc-service-proxy.module";
import { NgModule } from "@angular/core";
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PocRoutingModule,
        PocServiceProxyModule,
        BaseChartDirective
    ],
    declarations: [
    ],
    exports: [

    ],
    providers: [
    ]
})
export class PocModule { }
