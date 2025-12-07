import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import moment from 'moment';

@Pipe({
    name: 'dateFormatPipe',
    standalone: false
})
export class DateFormatPipe implements PipeTransform {

    getDateFormatString() {
        return 'DD/MM/YYYY';
    }

    momentToString(m: moment.Moment) {
        return moment(m).format(this.getDateFormatString());
    }

    transform(value: moment.Moment) {
        if (!value) {
            return '';
        }
        return this.momentToString(value);
    }
}
