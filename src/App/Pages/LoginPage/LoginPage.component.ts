import { Component } from '@angular/core';
import { Header } from '../../Components/Header/Header.component';
import { Heading } from "../../Components/Heading/Heading.component";
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/AuthService';
import { FormInput } from "../../Components/FormInput/FormInput.component";

@Component({
  selector: 'LoginPage',
  standalone: true,
  imports: [Header, Heading, ReactiveFormsModule, FormInput],
  templateUrl: './LoginPage.component.html',
  styleUrl: './LoginPage.component.css'
})
export class LoginPage {
  AuthService = AuthService;
  loginForm = new FormGroup({
    username: new FormControl('', {validators: Validators.required}),
    password: new FormControl('', {validators: Validators.required})
  })

  constructor(private auth: AuthService, private router: Router) {
    this.auth.IsLogged().then(isLogged => {
      if (isLogged) {
        this.router.navigate(['editor']);
      }
    });
  }

  async Login(event: SubmitEvent) {
    event.preventDefault();
    if (!this.loginForm.valid) {
      return;
    }
    const result = await this.auth.Login(
      this.loginForm.controls.username.value!,
      this.loginForm.controls.password.value!
    );
    if (result) {
      this.router.navigate(['editor']);
    }
  }

  GoToRegisterPage() {
    this.router.navigate(['register']);
  }
}
