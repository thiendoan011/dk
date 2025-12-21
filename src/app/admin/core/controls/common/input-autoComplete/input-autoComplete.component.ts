import { EventEmitter, Component, Input, Injector, ViewEncapsulation, ChangeDetectionStrategy, ElementRef, ViewChild } from "@angular/core";
import { ChangeDetectionComponent } from "@app/admin/core/ultils/change-detection.component";

@Component({
    selector: "input-autoComplete",
    templateUrl: "input-autoComplete.component.html",
    encapsulation: ViewEncapsulation.None
})
export class inputAutoComplete extends ChangeDetectionComponent{
    constructor(
        injector: Injector,
        public ref: ElementRef) {
            super(injector);
    }

    _ngModel: any;

    get ngModel(): any {
        if (!this._ngModel) {
            return '';
        }
        return this._ngModel;
    }
    @Input() set ngModel(value) {
        this._ngModel = value ? value : '';
    }
    
    _list_filter: any[];
    @Input() public set list_filter(value) {
        this._list_filter = value ? value : [];
    }
    list_suggestion: any[] = [];

    filterInput(event) {
        let query = event.query;
        this.list_suggestion = this.filterResult(query, this._list_filter);
        this.updateView();
    }

    filterResult(query, list_filter: any[]):any[] {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered : any[] = [];
        for(let i = 0; i < list_filter.length; i++) {
            let country = list_filter[i];
            if(country.item.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }
        return filtered;
    }
}