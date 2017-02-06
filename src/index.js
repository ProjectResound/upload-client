import 'core-js/client/shim';
import 'zone.js/dist/zone';

import '@angular/common';
import 'rxjs';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import './sass/index.scss';
import { ResoundApp } from './app';

if (process.env.NODE_ENV === 'production') {
  enableProdMode();
} else {
  Error['stackTraceLimit'] = Infinity; // eslint-disable-line dot-notation
  require('zone.js/dist/long-stack-trace-zone');
}

platformBrowserDynamic().bootstrapModule(ResoundApp);
