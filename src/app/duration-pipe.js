import { Pipe, PipeTransform } from '@angular/core';

/*
  arguments: seconds
  returns: HH:MM:SS
 */

@Pipe({ name: 'duration' })
export class durationPipe implements PipeTransform {
  transform(value) {
    const seconds = parseInt(value, 10);
    const h = this.leftPad(Math.floor(seconds / 3600) % 24);
    const m = this.leftPad(Math.floor(seconds / 60) % 60);
    const s = this.leftPad(seconds % 60);

    return `${h}:${m}:${s}`;
  }

  leftPad(value) {
    if (value < 10) {
      return `0${value}`;
    }
    return value.toString();
  }
}
