import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'domParser'
})
export class DomParserPipe implements PipeTransform {

  /**
   * Transform
   *
   * @param value: string
   */
  transform(value: string): string {
    const domParser = new DOMParser();
    let result = '';
    
    if (value) {
      result = domParser.parseFromString(value, 'text/html').documentElement.textContent;
    }

    return result;
  }
}