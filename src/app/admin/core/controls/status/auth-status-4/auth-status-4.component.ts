import { Input, Component, ViewEncapsulation, Injector, AfterViewInit } from "@angular/core";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";

@Component({
    templateUrl: './auth-status-4.component.html',
    selector: 'auth-status-4',
    styleUrls: ["./auth-status-4.css"],
    encapsulation: ViewEncapsulation.None
})
export class AuthStatus4Component extends ChangeDetectionComponent implements AfterViewInit {
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

    constructor(injector: Injector) {
        super(injector);
    }
}