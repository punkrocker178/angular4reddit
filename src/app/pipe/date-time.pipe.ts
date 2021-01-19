import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';
import { FormatConfigs } from '../config/format-config';

@Pipe({
  name: 'dateTimePipe'
})
export class DateTimePipe implements PipeTransform {

  /**
   * Transform
   *
   * @param value: string
   * @param type: string
   */
  transform(value: number, type: string): string {
    let result = '';
    
    if (type === 'diff') {
      const now = DateTime.local();
      const postTime = DateTime.fromSeconds(value);
      const diff = now.diff(postTime, 'hour').toObject();
      result = `${Math.ceil(diff.hours)}h`;
    } else if (type === 'format') {
      result = DateTime.fromSeconds(value).toFormat(FormatConfigs.dateTime);
    }

    return result;
  }
}