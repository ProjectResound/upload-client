/* global window, FileReader, Blob */

import { Component, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

const FlacEncoder = require('./flac.worker.js');

const worker = new FlacEncoder();

const Flow = require('@flowjs/flow.js/dist/flow.min');

@Component({
  selector: 'fountain-app',
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
    this.zone = zone;
    this.formBuilder = new FormBuilder();
    worker.onmessage = (e) => {
      if (e.data && e.data.reply === 'done') {
        const fileObject = new Blob([e.data.values[this.encodedFileName].blob], { type: 'audio/x-flac' });
        fileObject.name = this.encodedFileName;
        this.zone.run(() => {
          this.flow.addFile(fileObject);
          this.flow.upload();
          this.showProgress = true;
          this.progress = parseInt(this.flow.progress() * 100, 10);
          this.showUpload = false;
        });
      }
    };

    this.flow = new Flow({
      target: 'http://rails-api-dev.us-west-2.elasticbeanstalk.com/upload',
      chunkSize: 1024 * 512,
      forceChunkSize: true,
      allowDuplicateUploads: true
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
    this.error = false;
    this.success = false;
    this._readFile(this.encodedFileName);
  }

  addFile(event) {
    const srcElement = event.srcElement || event.target;
    this.showMeta = true;
    this.showUpload = true;
    this.flow.cancel();
    const f = srcElement.files[0];
    this.encodedFileName = f.name.replace(/\.[^\.]+$/, '.flac');
    this.file = f;
  }

  _readFile(encodedFileName) {
    const fr = new FileReader();
    fr.addEventListener('loadend', () => {
      const outData = {};
      outData[encodedFileName] = {
        MIME: 'audio/flac'
      };
      const args = [
        this.file.name,
        '--fast',
        `-T "TITLE=${this.metadataForm.controls.title.value}"`,
        `-T "ARTIST=${this.metadataForm.controls.author.value}"`
      ];
      const fileData = {};
      fileData[this.file.name] = new Uint8Array(fr.result);
      worker.postMessage({
        command: 'encode',
        outData,
        args,
        fileData
      });
    });
    fr.readAsArrayBuffer(this.file);
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
