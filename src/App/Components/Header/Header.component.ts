import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MainButton } from '../MainButton/MainButton.component';
import { App } from '../../App.component';

@Component({
  selector: 'Header',
  standalone: true,
  imports: [MainButton],
  templateUrl: './Header.component.html',
})
export class Header {

  constructor(private router: Router) {}

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
