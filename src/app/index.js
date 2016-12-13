import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { routing, RootComponent } from './routes';
import { LoudlyComponent } from './loudly';
import { UploadComponent } from './upload/upload';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    routing
  ],
  declarations: [
    RootComponent,
    LoudlyComponent,
    UploadComponent
  ],
  bootstrap: [RootComponent]
})
export class AppModule {}
