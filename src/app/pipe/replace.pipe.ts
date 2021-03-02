import { Pipe, PipeTransform } from '@angular/core';

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
  transform(value: string, regex?: string| RegExp, replace?: string): string {
      let stringReplace = replace;
      let stringRegex = regex;
      let result = '';

      if (!regex) {
          stringRegex = /amp;/g;
      }

      if (!replace) {
          stringReplace = '';

      }

      if (value) {
        result = value.replace(stringRegex, stringReplace);
      }

      return result;
  }
}