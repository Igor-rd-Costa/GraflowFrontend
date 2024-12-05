import { Component, isDevMode, NgModule } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './Services/AuthService';
import { GlobalEventsService } from './Services/GlobalEventsService';
import { EngineService } from './Services/EngineService';
import { ProjectService } from './Services/ProjectService';

export enum APIReturnFlags {
  SUCCESS =               0b000001,
  BAD_REQUEST =           0b000010,
  RESOURCE_NOT_FOUNT =    0b000100,
  SIGN_IN_FAILED =        0b001000,
  EMAIL_TAKEN =           0b010000,
  USERNAME_TAKEN =        0b100000
}

@Component({
  selector: 'App',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './App.component.html',
})
export class App {
  private static backend = isDevMode() ? "https://localhost:7183/api/" : "";

  static Backend() {
    return this.backend;
  }
}
