import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ResoundComponent } from './resound';

@Component({
  selector: 'resound-root',
  template: require('./root.html')
})
export class RootComponent {}

export const routes = [
  {
    path: '',
    component: ResoundComponent
  }
];

export const routing = RouterModule.forRoot(routes);
