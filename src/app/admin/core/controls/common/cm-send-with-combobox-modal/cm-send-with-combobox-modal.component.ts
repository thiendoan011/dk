import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild, ViewEncapsulation} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { PDEProductServiceProxy } from "@shared/service-proxies/service-proxies";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import { Select2CustomComponent } from "../custom-select2/select2-custom.component";

@Component({
    templateUrl: "./cm-send-with-combobox-modal.component.html",
    encapsulation: ViewEncapsulation.None,
    selector: "cm-send-with-combobox-modal",
})
export class CMSendWithComboboxModalComponent extends DefaultComponentBase implements OnInit {
    constructor(
        injector: Injector,
        private pdeProductService: PDEProductServiceProxy,
        public ref: ElementRef
    ) {
        super(injector);
    }

    @ViewChild("popupFrameModal") modal: ModalDirective;
    @ViewChild("combobox") combobox: Select2CustomComponent;

    _header: string;
    @Input() set header(value: string) {
        this._header = value;
    }
    @Input() _title: string;
    @Input() set title(value: string) {
        this._title = value;
    }
    _type: string;
    @Input() set type(value: string) {
        this._type = value;
    }

    // combobox
    _title_combobox: string;
    @Input() set title_combobox(value: string) {
        this._title_combobox = value;
    }
    _combobox_list: any;
    @Input() set combobox_list(value: any) {
        this._combobox_list = value;
    }
    _combobox_valueMember: string;
    @Input() set combobox_valueMember(value: string) {
        this._combobox_valueMember = value;
    }
    _combobox_displayMember: string;
    @Input() set combobox_displayMember(value: string) {
        this._combobox_displayMember = value;
    }

    @Output() onSendEvent: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCancelEvent: EventEmitter<any> = new EventEmitter<any>();

    // Private popup
    onShowEvent: EventEmitter<any> = new EventEmitter<any>();
    waiting: boolean;
    active: boolean = false;
    combobox_value: string = '';

    ngOnInit(): void {
    }

    show() {
        this.active = true;
        this.modal.show();
    }

    onShown() {
        this.onShowEvent.emit(null);
    }

    close() {
        this.active = false;
        this.modal.hide();
    }

    onSend() {
        this.onSendEvent.emit({
            type: this._type,
            value: this.combobox_value
        });
        this.close();
    }

    onCancel() {
        this.onCancelEvent.emit();
        this.close();
    }
}
