import { Component, Input, ViewChild, OnInit, Injector } from "@angular/core";
import { AppPermissionServiceProxy } from "@shared/service-proxies/service-proxies";
import { ControlComponent } from "../../control.component";
import { TreeRadioSelectComponent } from "../../tree-checkbox-select/tree-select-radio/tree-radio-select.component";

@Component({
    templateUrl: './app-permission-tree.component.html',
    selector: 'app-permission-tree',
})
export class AppPermissionTreeComponent extends ControlComponent implements OnInit {

    @Input() ngModel: any;
    @Input() required: boolean;
    @ViewChild('permissionTree') permissionTree: TreeRadioSelectComponent;

    constructor(injector: Injector, private appPermissionService: AppPermissionServiceProxy) {
        super(injector);
    }

    showPermissionModal() {
        this.permissionTree.show();
    }

    selectPermission(permissionValue) {
        this.ngModel = permissionValue;
    }

    ngOnInit(): void {
        this.appPermissionService.getAllAppPermissions().subscribe((result) => {
            this.permissionTree.setTreeData(result);
        });
    }
}
