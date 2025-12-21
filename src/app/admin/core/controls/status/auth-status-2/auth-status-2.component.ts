import { Input, Component, ViewEncapsulation, Injector, AfterViewInit } from "@angular/core";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";
import { AuthStatusConsts } from "@app/admin/core/ultils/consts/AuthStatusConsts";
import { ComponentBase } from "@app/ultilities/component-base";

@Component({
    templateUrl: './auth-status-2.component.html',
    selector: 'auth-status-2',
    styleUrls: ["./auth-status-2.css"],
    encapsulation: ViewEncapsulation.None
})
export class AuthStatus2Component extends ChangeDetectionComponent implements AfterViewInit {
    ngAfterViewInit(): void {
        // COMMENT: this.stopAutoUpdateView();
    }

    _authStatus: string;

    @Input() get authStatus() : string{
        return this._authStatus;
    }

    set authStatus(auth : string){
        this._authStatus = auth;
        this.updateView();
    }

    AuthStatusConsts = AuthStatusConsts;

    constructor(injector: Injector) {
        super(injector);
    }
}