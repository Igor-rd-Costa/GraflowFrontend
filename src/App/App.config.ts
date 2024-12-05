import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './App.routes';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './Services/AuthService';
import { GlobalEventsService } from './Services/GlobalEventsService';
import { EngineService } from './Services/EngineService';
import { ProjectService } from './Services/ProjectService';

export const AppConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(),
    AuthService, GlobalEventsService, EngineService, ProjectService
  ]
};
