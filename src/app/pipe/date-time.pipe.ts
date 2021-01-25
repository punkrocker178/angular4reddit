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
      const diff = now.diff(postTime, 'minutes').toObject();
      const diffHours = now.diff(postTime, 'hours').toObject();
      const diffDays = now.diff(postTime, 'days').toObject();
      const diffMonths = now.diff(postTime, 'months').toObject();
      const diffYears = now.diff(postTime, 'years').toObject();

      let timeLabel = 'm';
      let diffTime = diff.minutes;

      if (diff.minutes > 59) {
        timeLabel = 'h';
        diffTime = diffHours.hours;
      }

      if (diffHours.hours > 24) {
        timeLabel = 'd';
        diffTime = diffDays.days;
      }

      if (diffDays.days > 30) {
        timeLabel = 'm';
        diffTime = diffMonths.months;
      }

      if (diffDays.months > 12) {
        timeLabel = 'y';
        diffTime = diffYears.years;
      }

      result = `${Math.floor(diffTime)}${timeLabel}`;
    } else if (type === 'format') {
      result = DateTime.fromSeconds(value).toFormat(FormatConfigs.dateTime);
    }

    return result;
  }
}