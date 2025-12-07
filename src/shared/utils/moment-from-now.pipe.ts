import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({ name: 'momentFromNow', standalone: true })
export class MomentFromNowPipe implements PipeTransform {
    transform(value: moment.MomentInput) {
        if (!value) {
            return '';
        }

        return moment(value).lang('vi').fromNow();
    }
}
