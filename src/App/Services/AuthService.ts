import { Injectable } from "@angular/core";
import { APIReturnFlags, App } from "../App.component";
import { HttpClient } from "@angular/common/http";
import { AbstractControl, ValidationErrors, Validators } from "@angular/forms";
import { FormInput } from "../Components/FormInput/FormInput.component";

@Injectable()
export class AuthService {
  address = App.Backend() + "auth/";

  constructor(private http: HttpClient) {}

  Login(username: string, password: string): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.http.post<APIReturnFlags>(`${this.address}login`, {username, password}, {withCredentials: true}).subscribe({
        next: status => {
          if (status === APIReturnFlags.SUCCESS) {
            resolve(true);
            return;
          }
          resolve(false);
          return;
        },
        error: err => {
          console.error(err);
          resolve(false);
        }
      });
    });
  }

  Register(username: string, email: string, password: string): Promise<APIReturnFlags> {
    return new Promise<APIReturnFlags>(resolve => {
      this.http.post<APIReturnFlags>(`${this.address}register`, {username, email, password}, {withCredentials: true}).subscribe({
        next: status => {
          resolve(status);
        },
        error: err => {
          console.error(err);
          resolve(APIReturnFlags.BAD_REQUEST);
        }
      });
    });
  }

  IsLogged(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.http.get<boolean>(`${this.address}isLogged`, {withCredentials: true}).subscribe({
        next: isLogged => {
          resolve(isLogged);
        },
        error: err => {
          console.error(err);
          resolve(false);
        }
      })
    });
  }

  Logout(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.http.post(`${this.address}logout`, {}, {withCredentials: true}).subscribe({
        next: () => {
          resolve(true);
        },
        error: err => {
          console.error(err);
          resolve(false);
        }
      })
    });
  }

  static UsernameValidatorFn(control: AbstractControl): ValidationErrors|null {
    const username = control.value;
    const nameRegex = /[^a-zA-Z0-9-._@\+]+/;
    if (nameRegex.test(username) === false) {
      return null;
    }
    return {invalidCharacter: true};
  }

  static PasswordValidatorFunctions(): ((control: AbstractControl) => ValidationErrors|null)[] {
    return [
      Validators.required, Validators.minLength(8), 
      (control: AbstractControl) => {
        const password = control.value;
        const noLower = !/[a-z]/.test(password);
        const noUpper = !/[A-Z]/.test(password);
        const noDigit = !/[0-9]/.test(password);
        const noSpecial = !/[^a-zA-Z0-9]/.test(password);
        if (!noLower && !noUpper && !noDigit && !noSpecial) {
          return null;
        }
        return {
          noLower, noUpper, noDigit, noSpecial  
        };
    }];
  }

  static GetUsernameErrorMessage(control: AbstractControl): string|null { 
    if (control.valid || !control.dirty || control.errors === null) {
      return null;
    }
    const val = FormInput.GetErrorString("Username", control.errors);
    if (val) {
      return val;
    }
    if (control.errors['taken']) {
      return "Username already in use";
    }
    return null;
  }

  static GetEmailErrorMessage(control: AbstractControl): string|null {
    if (control.valid || !control.dirty || control.errors === null) {
      return null;
    }
    const val = FormInput.GetErrorString("Email", control.errors);
    if (val) {
      return val;
    }
    if (control.errors['email']) {
      return "Email is not valid";
    }
    if (control.errors['taken']) {
      return "Email already in use";
    }
    return null;
  }

  static GetPasswordErrorMessage(control: AbstractControl): string|null { 
    if (control.valid || !control.dirty || control.errors === null) {
      return null;
    }
    const val = FormInput.GetErrorString("Password", control.errors);
    if (val) {
      return val;
    }
    if (control.errors['noLower']) {
      return "Password must contain at least one lower case letter";
    }
    if (control.errors['noUpper']) {
      return "Password must contain at least one upper case letter";
    }
    if (control.errors['noDigit']) {
      return "Password must contain at least one number";
    }
    if (control.errors['noSpecial']) {
      return "Password must contain at least one special character";
    }
    return null;
  }
}