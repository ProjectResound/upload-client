/* global FileReader, Blob */

import { Component, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';


const Flow = require('@flowjs/flow.js/dist/flow.min');

const uploadEndpoint = 'http://localhost:3000/upload';
// 'http://rails-api-dev.us-west-2.elasticbeanstalk.com/upload';

@Component({
  selector: 'loudly-app',
  template: require('./upload.html')
})

export class UploadComponent {
  ngOnInit() {
    this.metadataForm = this.formBuilder.group(
      {
        title: ['', Validators.required],
        author: ['', Validators.required]
      }
    );
  }

  constructor(zone: NgZone) {
    this.formBuilder = new FormBuilder();

    this.flow = new Flow({
      target: uploadEndpoint,
      chunkSize: 1024 * 1024,
      forceChunkSize: true,
      allowDuplicateUploads: true
    });

    this.flow.on('fileProgress', () => {
      zone.run(() => {
        this.progress = parseInt(this.flow.progress() * 100, 10);
      });
    });

    this.flow.on('error', (file, message) => {
      this.error = message;
    });

    this.flow.on('fileSuccess', (file, message) => {
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
    this.showUpload = false;
    this.flow.addFile(this.file);
    this.flow.upload();
    this.showCancel = true;
    this.progress = parseInt(this.flow.progress() * 100, 10);
    this.showProgress = true;
    this.error = false;
    this.success = false;
  }

  addFile(event) {
    const srcElement = event.srcElement || event.target;
    this.showMeta = true;
    this.showUpload = true;
    this.flow.cancel();
    const f = srcElement.files[0];
    this.file = f;
  }

  pause() {
    this.flow.pause();
    this.uploadPaused = true;
  }

  resume() {
    this.flow.resume();
    this.uploadPaused = false;
  }

  cancel() {
    this.flow.cancel();
  }
}
