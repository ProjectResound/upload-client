import { Component, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ResoundComponent } from './resound';
import { ConfigService } from './config-service';

@Component({
  selector: 'resound-root',
  template: require('./root.html')
})
export class RootComponent {
  constructor(elementRef: ElementRef, confService: ConfigService) {
    confService.apiUrl = elementRef.nativeElement.getAttribute('api-url');
  }
}

export const routes = [
  {
    path: '',
    component: ResoundComponent
  }
];

export const routing = RouterModule.forRoot(routes);
