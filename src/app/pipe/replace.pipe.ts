import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';
import { FormatConfigs } from '../config/format-config';

@Pipe({
  name: 'replacePipe'
})
export class ReplacePipe implements PipeTransform {

  /**
   * Transform
   *
   * @param value: string
   * @param regex: string
   * @param replace: string
   */
  transform(value: string, regex?: string, replace?: string): string {
      let stringReplace = replace;
      let stringRegex = regex;

      if (!regex) {
          stringRegex = 'amp;';
      }

      if (!replace) {
          stringReplace = '';

      }

      return value.replace(stringRegex, stringReplace);
  }
}