import { Component, signal } from '@angular/core';
import { Header } from '../../Components/Header/Header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Heading } from '../../Components/Heading/Heading.component';
import { AuthService } from '../../Services/AuthService';
import { Router } from '@angular/router';
import { FormInput } from '../../Components/FormInput/FormInput.component';
import { MainButton } from '../../Components/MainButton/MainButton.component';
import { SecondaryButton } from "../../Components/SecondaryButton/SecondaryButton.component";
import { APIReturnFlags } from '../../App.component';

@Component({
  selector: 'RegisterPage',
  standalone: true,
  imports: [Header, Heading, ReactiveFormsModule, FormInput, MainButton, SecondaryButton],
  templateUrl: './RegisterPage.component.html'
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
    if (result === APIReturnFlags.SUCCESS)
    {
      this.router.navigate(['editor']);
    } else if (result === APIReturnFlags.SIGN_IN_FAILED) {
      this.router.navigate(['login']);
    } else {
      if ((result & APIReturnFlags.USERNAME_TAKEN) === APIReturnFlags.USERNAME_TAKEN) {
        this.registerForm.controls.username.setErrors({taken: true});
      }
      if ((result & APIReturnFlags.EMAIL_TAKEN) === APIReturnFlags.EMAIL_TAKEN) {
        this.registerForm.controls.email.setErrors({taken: true});
      }
      if (result === APIReturnFlags.BAD_REQUEST) {
        this.formErrorMessage.set("An error ocurred, if the problem persists contact our support team");
      }
    }
  }

  GoToLoginPage() {
    this.router.navigate(['login']);
  }
}
