import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UploadComponent } from './upload/upload';

@Component({
  selector: 'loudly-root',
  template: '<router-outlet></router-outlet>'
})
export class RootComponent {}

export const routes = [
  {
    path: '',
    component: UploadComponent
  }
];

export const routing = RouterModule.forRoot(routes);
