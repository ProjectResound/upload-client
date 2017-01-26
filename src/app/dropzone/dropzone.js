/* global AudioContext, FileReader */

import { Component } from '@angular/core';
import { FileUploadComponent } from './file-upload';

const Flow = require('@flowjs/flow.js/dist/flow.min');

const uploadEndpoint = 'http://rails-api-dev.us-west-2.elasticbeanstalk.com/upload';

@Component({
  selector: 'dropzone',
  template: require('./dropzone.html'),
  directives: [FileUploadComponent]
})

export class DropzoneComponent {

  ngOnInit() {
    this._initFlow();
  }

  constructor() {
    this.audioContext = new AudioContext();
    this.dropzoneQueue = {};
  }

  onDrop(event) {
    const files = event.dataTransfer.files;
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      if (file.type === 'audio/wav') {
        this._addToDropzoneQueue(file);
      }
    }
    this.dropzoneClasses = undefined;

    event.preventDefault();
  }

  dragOver(event) {
    this.dropzoneClasses = 'dz-started dz-drag-hover';
    event.preventDefault();
  }

  dragLeave(event) {
    this.dropzoneClasses = undefined;
    event.preventDefault();
  }

  onInputChange(event) {
    const srcElement = event.srcElement || event.target;
    this._addToDropzoneQueue(srcElement.files[0]);
    this.dropzoneClasses = undefined;
  }

  upload(file) {
    this.flow.addFile(file.fileObject);
    this.flow.upload();
    file.status = {};
    file.status.state = 'uploading';
  }

  removeFile(file) {
    delete this.dropzoneQueue[file.name];
    this.flow.removeFile(file.fileObject);
  }

  pauseUpload(file) {
    const flowFile = this.dropzoneQueue[file.name].flowFile;
    if (flowFile) {
      flowFile.pause();
      file.status.state = 'paused';
    }
  }

  resumeUpload(file) {
    const flowFile = this.dropzoneQueue[file.name].flowFile;
    if (flowFile) {
      flowFile.resume();
      file.status.state = 'uploading';
    }
  }

  dropzoneQueueKeysArray() {
    return Object.keys(this.dropzoneQueue);
  }

  _initFlow() {
    this.flow = new Flow({
      target: uploadEndpoint,
      chunkSize: 1024 * 500,
      forceChunkSize: true,
      allowDuplicateUploads: true
    });

    this.flow.on('fileProgress', (flowFile) => {
      const progress = flowFile.progress();
      this.dropzoneQueue[flowFile.name].status.progress = parseInt(progress * 100, 10);
    });

    this.flow.on('fileAdded', (flowFile) => {
      this.dropzoneQueue[flowFile.name].flowFile = flowFile;
    });

    this.flow.on('error', (flowFile, message) => {
      this.dropzoneQueue[flowFile.name].status.state = 'failed';
      console.log(message);
    });

    this.flow.on('fileSuccess', (flowFile, message) => {
      if (message === ' ') {
        return;
      }

      const response = JSON.parse(message);
      if (flowFile.size === response.fileSize) {
        this.dropzoneQueue[flowFile.name].status.state = 'completed';
      } else {
        this.dropzoneQueue[flowFile.name].status.state = 'failed';
        console.log(message);
      }
    });
  }

  _addToDropzoneQueue(file) {
    this.dropzoneQueue[file.name] = {};
    this.dropzoneQueue[file.name].name = file.name;
    this.dropzoneQueue[file.name].fileObject = file;
    this.dropzoneQueue[file.name].size = Math.round(file.size / 10000) / 100;
    this.dropzoneQueue[file.name].status = {};
    this._populateFileDuration(file);
  }

  _populateFileDuration(file) {
    const reader = new FileReader();
    reader.addEventListener('loadend', () => {
      this.audioContext.decodeAudioData(reader.result, (decoded) => {
        this.dropzoneQueue[file.name].duration = decoded.duration;
        reader.removeEventListener('loadend');
      });
    });
    reader.readAsArrayBuffer(file);
  }
}
