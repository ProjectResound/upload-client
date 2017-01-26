import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';

import { routing, RootComponent } from './routes';
import { ResoundComponent } from './resound';
import { DropzoneComponent } from './dropzone/dropzone';
import { FileUploadComponent } from './dropzone/file-upload';
import { durationPipe } from './duration-pipe';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    MomentModule,
    routing
  ],
  declarations: [
    RootComponent,
    ResoundComponent,
    DropzoneComponent,
    FileUploadComponent,
    durationPipe
  ],
  bootstrap: [RootComponent]
})
export class AppModule {}
