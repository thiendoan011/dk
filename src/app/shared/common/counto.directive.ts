import { Directive, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[counto]'
})
export class CountoDirective implements OnChanges, OnDestroy {

    @Output() countoChange = new EventEmitter();
    @Output() countoEnd = new EventEmitter();
    @Input() counto: number;
    @Input() countFrom = 0;
    @Input() step = 10;
    @Input() duration = 1;

    private _timer: any;
    private _start: number;

    ngOnChanges(changes: SimpleChanges) {
        if (changes.counto || changes.countFrom || changes.duration || changes.step) {
            this.start();
        }
    }

    ngOnDestroy() {
        cancelAnimationFrame(this._timer);
    }

    private start() {
        if (this._timer) {
            cancelAnimationFrame(this._timer);
        }

        const startTimestamp = performance.now();
        const durationMs = this.duration * 1000;
        const countFrom = this.countFrom;
        const countTo = this.counto;

        const step = (timestamp: number) => {
            const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
            const current = Math.floor(progress * (countTo - countFrom) + countFrom);

            this.countoChange.emit(current);

            if (progress < 1) {
                this._timer = requestAnimationFrame(step);
            } else {
                this.countoChange.emit(countTo);
                this.countoEnd.emit();
            }
        };

        this._timer = requestAnimationFrame(step);
    }
}
