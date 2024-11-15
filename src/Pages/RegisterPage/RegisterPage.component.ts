import { Component } from '@angular/core';
import { Header } from '../../Components/Header/Header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Heading } from '../../Components/Heading/Heading.component';

@Component({
  selector: 'RegisterPage',
  standalone: true,
  imports: [Header, Heading, ReactiveFormsModule],
  templateUrl: './RegisterPage.component.html',
  styleUrl: './RegisterPage.component.css'
})
export class RegisterPage {
  registerForm = new FormGroup({
    username: new FormControl('', {validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)]}),
    email: new FormControl('', {validators: [Validators.required, Validators.email]}),
    password: new FormControl('', {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(255)]})
  })

  Register(event: SubmitEvent) {
    event.preventDefault();
  }
}
