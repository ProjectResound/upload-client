import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { routing, RootComponent } from './routes';
import { HelloComponent } from './hello';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    routing
  ],
  declarations: [
    RootComponent,
    HelloComponent
  ],
  bootstrap: [RootComponent]
})
export class AppModule {}
