import { AfterViewInit, Component, effect, signal } from '@angular/core';
import { App, ColorTheme } from '../../App.component';
import { Router } from '@angular/router';
import { ColorThemeSelector } from "../ColorThemeSelector/ColorThemeSelector.component";

@Component({
  selector: 'Header',
  standalone: true,
  imports: [ColorThemeSelector],
  templateUrl: './Header.component.html',
  styleUrl: './Header.component.css'
})
export class Header implements AfterViewInit {

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
