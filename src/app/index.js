import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { routing, RootComponent } from './routes';
import { LoudlyComponent } from './loudly';
import { DropzoneComponent } from './dropzone/dropzone';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    routing
  ],
  declarations: [
    RootComponent,
    LoudlyComponent,
    DropzoneComponent
  ],
  bootstrap: [RootComponent]
})
export class AppModule {}
