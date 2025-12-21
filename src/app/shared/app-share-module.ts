import { NgModule } from "@angular/core";
import { ChartModule } from "primeng/chart";
import {CardModule} from 'primeng/card';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import { HttpClientModule } from '@angular/common/http'
import {DialogModule} from 'primeng/dialog';

@NgModule({
    imports: [
        ChartModule,
        CardModule,
        DynamicDialogModule,
        HttpClientModule,
        DialogModule
    ],
    exports:[
        ChartModule,
        CardModule,
        DynamicDialogModule,
        HttpClientModule,
        DialogModule
    ]
})
export class AppShareModule { }