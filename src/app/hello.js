import { Component } from '@angular/core';

// let Flow;

@Component({
  selector: 'fountain-app',
  template: require('./hello.html')
})
export class HelloComponent {
  constructor() {
    // this.flow = new Flow({
    //   target: '/api/photo/redeem-upload-token',
    //   query: {upload_token: 'my_token'}
    // });
    this.hello = 'Hello World!';

    // this.flow.assignBrowse(document.getElementById('browseButton'));
  }
}
