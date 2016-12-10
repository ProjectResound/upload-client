import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { DropzoneModule } from 'angular2-dropzone-wrapper';

import { routing, RootComponent } from './routes';
import { LoudlyComponent } from './loudly';
import { UploadComponent } from './upload/upload';

const DROPZONE_CONFIG = {
  server: 'http://httpbin.org/post',
  maxFileSize: 50
};

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    routing,
    DropzoneModule.forRoot(DROPZONE_CONFIG)
  ],
  declarations: [
    RootComponent,
    LoudlyComponent,
    UploadComponent
  ],
  bootstrap: [RootComponent]
})
export class AppModule {}
