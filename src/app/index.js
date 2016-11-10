import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { routing, RootComponent } from './routes';
import { UploadComponent } from './upload/upload';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    routing
  ],
  declarations: [
    RootComponent,
    UploadComponent
  ],
  bootstrap: [RootComponent]
})
export class AppModule {}
