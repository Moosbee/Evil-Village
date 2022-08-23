import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'round'
})
export class RoundPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): number {
    return Math.round((value+ Number.EPSILON) * 100) / 100;;
  }

}
