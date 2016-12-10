import { Component } from '@angular/core';
import { DropzoneConfigInterface } from 'angular2-dropzone-wrapper';

@Component({
  selector: 'loudly-container',
  template: require('./loudly.html')
})

export class LoudlyComponent {
  dragStart() {
    console.log('dragStart');
  }
}
