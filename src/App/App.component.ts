import { AfterViewInit, Component, effect, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';


export type ColorTheme = 'OS Default' | 'Light' | 'Dark';


@Component({
  selector: 'App',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './App.component.html',
  styleUrl: './App.component.css'
})
export class App implements AfterViewInit {
  title = 'Graflow';
  static colorTheme = signal<ColorTheme>('OS Default');

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
