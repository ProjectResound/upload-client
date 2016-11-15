/* global FileReader, Blob */

import { Component, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

const FlacEncoder = require('./flac/flac.worker.js');

const Flow = require('@flowjs/flow.js/dist/flow.min');

const uploadEndpoint = 'http://rails-api-dev.us-west-2.elasticbeanstalk.com/upload';

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
    this.worker = new FlacEncoder();
    this.formBuilder = new FormBuilder();

    this.flow = new Flow({
      target: uploadEndpoint,
      chunkSize: 1024 * 512,
      forceChunkSize: true,
      allowDuplicateUploads: true
    });

    this.flow.on('fileProgress', (file, chunk) => {
      this.progress = parseInt(this.flow.progress() * 100, 10);
      if (chunk.status() !== 'success') {
        this.uploadDone = true;
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

    this.worker.onmessage = (e) => {
      if (e.data && e.data.reply === 'done') {
        const fileObject = new Blob([e.data.values[this.encodedFileName].blob], { type: 'audio/x-flac' });
        fileObject.name = this.encodedFileName;
        zone.run(() => {
          this.flow.addFile(fileObject);
          this.flow.upload();
          this.showCancel = true;
          this.progress = parseInt(this.flow.progress() * 100, 10);
          this.showEncodingMsg = false;
          this.showProgress = true;
        });
      }
    };
  }

  upload() {
    this.showUpload = false;
    this.showEncodingMsg = true;
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
      this.worker.postMessage({
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
