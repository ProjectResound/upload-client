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
      console.log('file added');
      this.file = file;
      this.progress = parseInt(this.flow.progress() * 100, 10);
    });

    this.flow.on('fileProgress', (file, chunk) => {
      this.progress = parseInt(this.flow.progress() * 100, 10);
      if (chunk.status() !== 'success') {
        chunk.send();
      }
    });

    this.flow.on('error', (file, message) => {
      this.error = message;
    });

    this.flow.on('fileSuccess', (file, message) => {
      console.log(`success: ${message}`);
      if (message === ' ') {
        return;
      }

      const response = JSON.parse(message);
      if (file.size === response.fileSize) {
        this.error = false;
        this.success = true;
      } else {
        this.error = true;
      }
    });
  }

  upload() {
    this.flow.upload();
    this.error = false;
    this.success = false;
  }

  addFile(event) {
    this.flow.cancel();
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
