import { AfterViewInit, Component, effect, isDevMode, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './Services/AuthService';
import { GlobalEventsService } from './Services/GlobalEventsService';
import { EngineService } from './Services/EngineService';


export type ColorTheme = 'OS Default' | 'Light' | 'Dark';


@Component({
  selector: 'App',
  standalone: true,
  imports: [RouterOutlet],
  providers: [AuthService, GlobalEventsService, EngineService],
  templateUrl: './App.component.html',
  styleUrl: './App.component.css'
})
export class App implements AfterViewInit {
  title = 'Graflow';
  static colorTheme = signal<ColorTheme>('OS Default');
  static backendAddress = signal(isDevMode() ? "https://localhost:7183/api/" : "")
  static pointerMoveEventListeners: ((event: PointerEvent) => void)[] = [];
  static pointerUpEventListeners: ((event: PointerEvent) => void)[] = [];

  static BackendAddress(): string {
    return this.backendAddress();
  }

  constructor() {
    effect(() => {
      const colorTheme = App.colorTheme();
      const rootElement = document.getElementById('root') as HTMLElement | null;
      if (rootElement) {
        if (colorTheme === 'OS Default') {
          rootElement.classList.remove('dark');
          rootElement.classList.remove('light');
        } else {
          let className = 'light';
          let removeClass = 'dark';
          if (colorTheme === 'Dark') {
            let temp = className;
            className = removeClass;
            removeClass = temp;
          }
          rootElement.classList.add(className);
          rootElement.classList.remove(removeClass);
        }
      }
    })
  }

  ngAfterViewInit(): void {
    let colorTheme = localStorage.getItem('colorTheme');
    if (colorTheme === null) {
      localStorage.setItem('colorTheme', App.colorTheme());
    }
    else {
      App.colorTheme.set(colorTheme as ColorTheme);
    } 
  }

  static GetColorTheme(): ColorTheme {
    return this.colorTheme();
  }

  static SetColorTheme(theme: ColorTheme) {
    if (this.colorTheme() !== theme) {
      this.colorTheme.set(theme);
      localStorage.setItem('colorTheme', theme);
    }
  }
}
