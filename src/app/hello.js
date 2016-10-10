import { Component } from '@angular/core';

const Flow = require('@flowjs/flow.js/dist/flow.min');

@Component({
  selector: 'fountain-app',
  template: require('./hello.html')
})

export class HelloComponent {
  constructor() {
    this.hello = 'Hello Flow!';

    this.flow = new Flow({
      target: '/api/photo/redeem-upload-token',
      query: { upload_token: 'my_token' }
    });

    this.flow.on('fileAdded', (file, event) => {
      console.log('file added');
      console.log(file, event);
    });
  }
}
