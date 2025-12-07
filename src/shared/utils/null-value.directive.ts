import { NgControl } from '@angular/forms';
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: 'input[nullValue]',
    standalone: true
})
export class NullDefaultValueDirective {
    constructor(private el: ElementRef, private control: NgControl) { }

    @HostListener('input', ['$event.target'])
    onEvent(target: HTMLInputElement) {
        this.control.viewToModelUpdate((target.value === '') ? null : target.value);
    }
}
