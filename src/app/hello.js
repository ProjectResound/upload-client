/* global window, FileReader, File */

import { Component } from '@angular/core';

const FlacEncoder = require('../EmsWorkerProxy.worker.js');

const worker = new FlacEncoder();

const Flow = require('@flowjs/flow.js/dist/flow.min');

@Component({
  selector: 'fountain-app',
  template: require('./hello.html')
})

export class HelloComponent {

  constructor() {
    this.fileNames = [];

    worker.onmessage = (e) => {
      if (e.data && e.data.reply === 'done') {
        console.log(e.data);
        this.fileNames.forEach((fileName) => {
          const url = window.URL.createObjectURL(e.data.values[fileName].blob);
          const file = new File([e.data.values[fileName].blob], fileName, { type: 'audio/x-flac' });
          console.log(file);
          this.flow.addFile(file);
        });
      }
    };

    this.flow = new Flow({
      target: 'http://rails-api-dev.us-west-2.elasticbeanstalk.com/upload',
      chunkSize: 1024 * 512,
      forceChunkSize: true,
      allowDuplicateUploads: true
    });

    this.flow.on('fileAdded', (file) => {
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
    this.flow.upload();
  }

  addFile(event) {
    this.flow.cancel();
    const outData = {};
    const f = event.srcElement.files[0];
    const fr = new FileReader();
    fr.addEventListener('loadend', () => {
      const encodedName = f.name.replace(/\.[^\.]+$/, '.flac');
      this.fileNames.push(encodedName);
      outData[encodedName] = {
        MIME: 'audio/flac'
      };
      const args = [f.name, '--fast', '-T "TITLE=Prius audio test"', '-T "ARTIST=Louise"'];
      const fileData = {};
      fileData[f.name] = new Uint8Array(fr.result);
      worker.postMessage({
        command: 'encode',
        outData,
        args,
        fileData
      });
    });
    fr.readAsArrayBuffer(f);
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
