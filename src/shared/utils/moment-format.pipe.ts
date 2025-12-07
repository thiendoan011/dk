import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({ name: 'momentFormat', standalone: true })
export class MomentFormatPipe implements PipeTransform {
    transform(value: moment.MomentInput, format: string) {
        if (!value) {
            return '';
        }

        return moment(value).format(format);
    }
}
