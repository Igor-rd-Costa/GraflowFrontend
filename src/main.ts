import { bootstrapApplication } from '@angular/platform-browser';
import { AppConfig } from './App/App.config';
import { App } from './App/App.component';

bootstrapApplication(App, AppConfig)
  .catch((err) => console.error(err));
