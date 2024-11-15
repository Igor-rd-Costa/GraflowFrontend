import { Routes } from '@angular/router';
import { LoginPage } from '../Pages/LoginPage/LoginPage.component';
import { RegisterPage } from '../Pages/RegisterPage/RegisterPage.component';
import { LandingPage } from '../Pages/LandingPage/LandingPage.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'register',
    component: RegisterPage
  },
  {
    path: '',
    component: LandingPage
  }
];
