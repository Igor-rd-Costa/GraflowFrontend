import { Component, signal } from '@angular/core';
import { App } from '../../App.component';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/AuthService';
import { ColorThemeSelector } from "../ColorThemeSelector/ColorThemeSelector.component";

@Component({
  selector: 'LoggedHeader',
  standalone: true,
  imports: [ColorThemeSelector],
  templateUrl: './LoggedHeader.component.html',
  styleUrl: './LoggedHeader.component.css'
})
export class LoggedHeader {
  App = App;
  protected isColorSelectorVisible = signal(false);
  
  constructor(private auth: AuthService, private router: Router) {}

  GoToMainPage() {
    this.router.navigate(['editor']);
  }

  async Logout() {
    if(await this.auth.Logout())
    {
      this.router.navigate(['login']);
    }
  }
}
