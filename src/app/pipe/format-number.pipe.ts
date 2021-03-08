import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber'
})
export class FormatNumberPipe implements PipeTransform {

  /**
   * Transform
   *
   * @param value: string
   */
  transform(value): string {

      let number = value;

      if(!this.isNumeric(value)) {
        number = parseInt(value);
      }

      if(number == NaN) {
        return '';
      }

      if (number > 1000000) {
        number = number / 1000000;
        return `${number.toFixed(1)}m`
      }

      if (number > 1000) {
        number = number / 1000;
        return `${number.toFixed(1)}k`
      }

      return `${number}`;
  }

  isNumeric(num){
    return typeof num !== 'string' && !isNaN(num)
  }
}