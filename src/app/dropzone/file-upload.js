import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'file-upload',
  template: require('./file-upload.html')
})
export class FileUploadComponent {
  @Input() file;
  @Output() onUpload = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() pause = new EventEmitter();
  @Output() resume = new EventEmitter();

  textFieldMin = 5;

  constructor(fb: FormBuilder) {
    this.fileForm = fb.group({
      title: [null, Validators.compose([
        Validators.required,
        Validators.minLength(this.textFieldMin)
      ])],
      contributor: [null, Validators.compose([
        Validators.required,
        Validators.minLength(this.textFieldMin)
      ])]
    });
  }

  submitForm(file, formValues) {
    file.formValues = formValues;
    this.onUpload.emit(file);
  }

  onCancel() {
    if (this.file.status.state === 'uploading' || this.file.status.state === 'paused') {
      this.pause.emit(this.file);
    }
    this.file.status.previousState = this.file.status.state;
    this.file.status.state = 'canceling';
  }

  cancelConfirmed(confirmation: false) {
    if (confirmation) {
      this.cancel.emit(this.file);
    } else {
      this.file.status.state = this.file.status.previousState;
    }
  }
}
