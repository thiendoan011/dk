import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { ControlComponent } from "../../control.component";

@Component({
    selector: "input-multi-select",
    templateUrl: "./input-multi-select-control.component.html",
    encapsulation: ViewEncapsulation.None,
})

export class InputMultiSelectComponent extends ControlComponent implements OnInit {

    @Input() displayText: string;
    @Input() labelTitle: string;
    @Input() disableInput: boolean = false;
    @Input() name: string;

    @Input() proMode: boolean = false;


    @Output() showModal: EventEmitter<any> = new EventEmitter<any>();
    @Output() redirectLink: EventEmitter<any> = new EventEmitter<any>();
    @Output() deleteDisplayText: EventEmitter<any> = new EventEmitter<any>();
    // _ngModel: string;

    constructor(injector: Injector) {
        super(injector);
    }


    ngOnInit(): void {
        // TODO
    }
    updateControlView() {
        this.inputRef.nativeElement.value = this.displayText;
    }

    openModal(event) {
        this.showModal.emit(event);
    }


    onDeleteDisplayText(event) {
        this.deleteDisplayText.emit(event);
    }


    onClickDisplayText(event) {
        this.redirectLink.emit(event);
    }
}
