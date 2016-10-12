/* global window */

import { Component } from '@angular/core';

const Flow = require('@flowjs/flow.js/dist/flow.min');

@Component({
  selector: 'fountain-app',
  template: require('./hello.html')
})

export class HelloComponent {
  constructor() {
    this.flow = new Flow({
      target: 'http://rails-api-dev.us-west-2.elasticbeanstalk.com/upload',
      chunkSize: 1024 * 512,
      forceChunkSize: true,
      allowDuplicateUploads: true
    });

    this.flow.on('fileAdded', (file) => {
      this.file = file;
      this.progress = this.flow.progress();
    });

    this.flow.on('fileProgress', (file, chunk) => {
      this.progress = this.flow.progress();
      console.log(chunk.status());
      if (chunk.status() !== 'success') {
        console.log('retrying send');
        chunk.send();
      }
    });

    this.flow.on('error', (file, message) => {
      this.error = message;
    });
  }

  upload() {
    this.flow.upload();
  }

  addFile(event) {
    this.flow.addFiles(event.srcElement.files);
  }

  pause() {
    this.flow.pause();
  }

  resume() {
    this.flow.resume();
  }

  cancel() {
    this.flow.cancel();
  }
}
