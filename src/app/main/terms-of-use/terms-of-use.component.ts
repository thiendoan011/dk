import { Component, Injector, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { LocalizePipe } from "../../../shared/common/pipes/localize.pipe";

@Component({
    templateUrl: './terms-of-use.component.html',
    selector: 'terms-of-use',
    animations: [appModuleAnimation()],
    encapsulation: ViewEncapsulation.None,
    standalone: true, // <--- Sửa thành true
    imports: [
        CommonModule,
        AppCommonModule,
        LocalizePipe
    ]
})
export class TermsOfUseComponent extends AppComponentBase implements OnInit {

    labelTile: string;

    // Sử dụng Signal Input nếu muốn (Angular 19), hoặc giữ @Input
    @Input() useWrapperDiv = false;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit(): void {
        // this.labelTile = AppConsts.releaseVersion;
    }
}