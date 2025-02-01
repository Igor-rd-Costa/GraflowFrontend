import { Component, isDevMode } from '@angular/core';
import { RouterOutlet } from '@angular/router';

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

  static PreventContextMenu(event: Event) {
    event.preventDefault();
  }
}
