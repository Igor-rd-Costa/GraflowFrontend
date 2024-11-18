import { Component, signal } from '@angular/core';
import { Header } from '../../Components/Header/Header.component';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Heading } from '../../Components/Heading/Heading.component';
import { AuthService, AuthStatusBits } from '../../Services/AuthService';
import { Router } from '@angular/router';
import { FormInput } from '../../Components/FormInput/FormInput.component';

@Component({
  selector: 'RegisterPage',
  standalone: true,
  imports: [Header, Heading, ReactiveFormsModule, FormInput],
  templateUrl: './RegisterPage.component.html',
  styleUrl: './RegisterPage.component.css'
})
export class RegisterPage {
  AuthService = AuthService;
  registerForm = new FormGroup({
    username: new FormControl('', {validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100), AuthService.UsernameValidatorFn]}),
    email: new FormControl('', {validators: [Validators.required, Validators.email]}),
    password: new FormControl('', {validators: AuthService.PasswordValidatorFunctions()})
  });
  formErrorMessage = signal<string|null>(null);

  constructor(private auth: AuthService, private router: Router) {}

  async Register(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    if (this.registerForm.valid === false) {
      return;
    }
    const result = await this.auth.Register(
      this.registerForm.controls.username.value!,
      this.registerForm.controls.email.value!,
      this.registerForm.controls.password.value!
    );
    if (result === AuthStatusBits.SUCCESS)
    {
      this.router.navigate(['editor']);
    } else if (result === AuthStatusBits.SIGN_IN_FAILED) {
      this.router.navigate(['login']);
    } else {
      if ((result & AuthStatusBits.USERNAME_TAKEN) === AuthStatusBits.USERNAME_TAKEN) {
        this.registerForm.controls.username.setErrors({taken: true});
      }
      if ((result & AuthStatusBits.EMAIL_TAKEN) === AuthStatusBits.EMAIL_TAKEN) {
        this.registerForm.controls.email.setErrors({taken: true});
      }
      if (result === AuthStatusBits.BAD_REQUEST) {
        this.formErrorMessage.set("An error ocurred, if the problem persists contact our support team");
      }
    }
  }
}
