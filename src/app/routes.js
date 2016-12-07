import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoudlyComponent } from './loudly';

@Component({
  selector: 'loudly-root',
  template: require('./root.html')
})
export class RootComponent {}

export const routes = [
  {
    path: '',
    component: LoudlyComponent
  }
];

export const routing = RouterModule.forRoot(routes);
