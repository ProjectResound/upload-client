import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HelloComponent} from './hello';

@Component({
  selector: 'fountain-root',
  template: '<router-outlet></router-outlet>'
})
export class RootComponent {}

export const routes = [
  {
    path: '',
    component: HelloComponent
  }
];

export const routing = RouterModule.forRoot(routes);
