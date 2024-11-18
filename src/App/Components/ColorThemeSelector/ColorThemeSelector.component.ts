import { Component, signal } from '@angular/core';
import { App, ColorTheme } from '../../App.component';

@Component({
  selector: 'ColorThemeSelector',
  standalone: true,
  imports: [],
  templateUrl: './ColorThemeSelector.component.html',
  styleUrl: './ColorThemeSelector.component.css'
})
export class ColorThemeSelector {
  protected isColorSelectorVisible = signal(false);
  static hideOnClickFn: null | ((event:MouseEvent) => void) = null;

  ShowThemeSelector() {
    this.isColorSelectorVisible.set(true);
    const button = document.getElementById('color-theme-selector-button');
    button?.classList.add('selected');
    if (ColorThemeSelector.hideOnClickFn === null) {
      ColorThemeSelector.hideOnClickFn = this.HideOnOutClick.bind(this);
    }
    document.body.addEventListener('click', ColorThemeSelector.hideOnClickFn);
  }

  HideOnOutClick(event: MouseEvent) {
    if (event.target === null)
      return;
    const target = event.target as HTMLElement;
    if (target.closest('#color-theme-list') === null && target.closest('#color-theme-selector-button') === null) {
      this.HideThemeSelector();
    }
  }

  HideThemeSelector() {
    this.isColorSelectorVisible.set(false);
    const button = document.getElementById('color-theme-selector-button');
    button?.classList.remove('selected');
    if (ColorThemeSelector.hideOnClickFn !== null) { 
      document.body.removeEventListener('click', ColorThemeSelector.hideOnClickFn);
      ColorThemeSelector.hideOnClickFn = null;
    }
  }

  GetColorThemeIcon(): string {
    switch(App.GetColorTheme()) {
      case 'OS Default': return 'contrast';
      case 'Light': return 'light_mode';
      case 'Dark': return 'dark_mode';
    }
  }

  SetColorTheme(theme: ColorTheme) {
    App.SetColorTheme(theme);
    this.HideThemeSelector();
  }
}
