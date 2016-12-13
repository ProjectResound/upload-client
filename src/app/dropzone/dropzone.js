/* global FileReader, Blob */

import { Component, NgZone, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

const Dropzone = require('dropzone');

Dropzone.autoDiscover = false;

const Flow = require('@flowjs/flow.js/dist/flow.min');

const uploadEndpoint = 'http://localhost:3000/upload';
// 'http://rails-api-dev.us-west-2.elasticbeanstalk.com/upload';

@Component({
  selector: 'dropzone',
  template: ''
})

export class DropzoneComponent {
  ngOnInit() {
    this.metadataForm = this.formBuilder.group(
      {
        title: ['', Validators.required],
        author: ['', Validators.required]
      }
    );
    this.initDropzone();
  }

  constructor(zone: NgZone, elem: ElementRef) {
    this.element = elem.nativeElement;
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

  initDropzone() {
    this._dropzone = new Dropzone(this.element, {
      url: uploadEndpoint,
      dictDefaultMessage: require('./dropzone-placeholder.html'),
      previewTemplate: '<div>DROPZONE PREVIEW TEMPLATE</div>',
      previewContainer: '#previews'
    });

    this._dropzone.on('addedfile', (file) => {
      console.log('added', file);
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
