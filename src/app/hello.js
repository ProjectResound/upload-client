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
      target: 'http://localhost:3030/upload',
      query: { upload_token: 'my_token' }
    });

    this.flow.on('fileAdded', (file, event) => {
      console.log('file added');
      console.log(file, event);
    });
  }

  uploadFile() {
    console.log('upload file clicked');
    console.log(`Trying to upload a file getSize: ${this.flow.getSize()}`);
    this.flow.upload();
  }

  addFile(event) {
    this.flow.addFiles(event.srcElement.files);
  }
}
