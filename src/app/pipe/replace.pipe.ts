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
  transform(value: string, regex?: string| RegExp, replace?: any): string {
      let result = '';

      const replaceObj = {
        '&amp;': '&',
        '&gt;': '>',
        '&lt;': '<',
        '&quot': '"'
    }

      if (!regex) {
          regex = new RegExp(Object.keys(replaceObj).join('|'), 'g');
      }

      if (!replace) {
          replace = (match) => replaceObj[match];

      }

      if (value) {
        result = value.replace(regex, replace);
      }

      return result;
  }
}