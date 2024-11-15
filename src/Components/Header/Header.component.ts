import { AfterViewInit, Component, effect, signal } from '@angular/core';
import { App, ColorTheme } from '../../App/App.component';
import { Router } from '@angular/router';

@Component({
  selector: 'Header',
  standalone: true,
  imports: [],
  templateUrl: './Header.component.html',
  styleUrl: './Header.component.css'
})
export class Header implements AfterViewInit {
  protected isColorSelectorVisible = signal(false);
  static hideOnClickFn: null | ((event:MouseEvent) => void) = null;

  constructor(private router: Router) {
    effect(() => {
      const colorTheme = App.GetColorTheme();
      const listItems = document.getElementById('color-theme-list')?.children;
      if (!listItems) {
        return;
      }
      for (let i = 0; i < listItems.length; i++) {
        listItems[i].classList.remove('selected');
      }
      switch(colorTheme) {
        case 'OS Default':
          listItems[0].classList.add('selected');
          break;
        case 'Light':
          listItems[1].classList.add('selected');
          break;
        case 'Dark':
          listItems[2].classList.add('selected');
          break;
        }
    });
  }

  ngAfterViewInit(): void {
    
  }

  ShowThemeSelector() {
    this.isColorSelectorVisible.set(true);
    const button = document.getElementById('color-theme-selector-button');
    button?.classList.add('selected');
    if (Header.hideOnClickFn === null) {
      Header.hideOnClickFn = this.HideOnOutClick.bind(this);
    }
    document.body.addEventListener('click', Header.hideOnClickFn);
  }

  HideOnOutClick(event: MouseEvent) {
    if (event.target === null)
      return;
    const target = event.target as HTMLElement;
    if (target.closest('#color-theme-list') === null && target.closest('#color-theme-selector-button') === null) {
      this.HideThemeSelector();
      if (Header.hideOnClickFn !== null) { 
        document.body.removeEventListener('click', Header.hideOnClickFn);
      }
    }
  }

  HideThemeSelector() {
    this.isColorSelectorVisible.set(false);
    const button = document.getElementById('color-theme-selector-button');
    button?.classList.remove('selected');
  }

  SelectTheme(theme: ColorTheme) {
    App.SetColorTheme(theme);
    this.HideThemeSelector();
  }

  GetColorThemeIcon(): string {
    switch(App.GetColorTheme()) {
      case 'OS Default': return 'contrast';
      case 'Light': return 'light_mode';
      case 'Dark': return 'dark_mode';
    }
  }

  GoToMainPage() {
    this.router.navigate(['']);
  }

  GoToLoginPage() {
    this.router.navigate(['login']);
  }

  GoToRegisterPage() {
    this.router.navigate(['register']);
  }
}
