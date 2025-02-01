import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './App.routes';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './Services/AuthService';
import { GlobalEventsService } from './Services/GlobalEventsService';
import { ProjectService } from './Services/ProjectService';
import ActionsService from './Services/ActionsService';

export const AppConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(),
    AuthService, GlobalEventsService, ProjectService, ActionsService
  ]
};
