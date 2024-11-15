import { Component } from '@angular/core';
import { Header } from '../../Components/Header/Header.component';
import { Heading } from "../../Components/Heading/Heading.component";
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'LoginPage',
  standalone: true,
  imports: [Header, Heading, ReactiveFormsModule],
  templateUrl: './LoginPage.component.html',
  styleUrl: './LoginPage.component.css'
})
export class LoginPage {
  loginForm = new FormGroup({
    username: new FormControl('', {validators: Validators.required}),
    password: new FormControl('', {validators: Validators.required})
  })

  constructor(private router: Router) {}

  Login(event: SubmitEvent) {
    event.preventDefault();
  }

  GoToRegisterPage() {
    this.router.navigate(['register']);
  }
}
