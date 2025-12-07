import { Component, Input } from "@angular/core";

@Component({
    templateUrl: './auth-status.component.html',
    selector: 'auth-status',
    standalone: false
})
export class AuthStatusComponent {
    @Input() authStatus: string;
}
