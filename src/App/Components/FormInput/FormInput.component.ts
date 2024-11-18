import { Component, forwardRef, Input, signal } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'FormInput',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInput),
      multi: true
    }
  ],
  templateUrl: './FormInput.component.html',
  styleUrl: './FormInput.component.css'
})
export class FormInput implements ControlValueAccessor {
  @Input() type: 'text'|'password' = "text";
  @Input() label: string = "";
  @Input() errorMessage: string|null = null;
  private value = signal("");
  protected isDisabled = signal(false);
  private onChange: (_: any) => void = () => {};
  private onTouched: (_: any) => void = () => {};


  writeValue(obj: any): void {
      this.value.set(obj);
  }

  setDisabledState(isDisabled: boolean): void {
      this.isDisabled.set(isDisabled);
  }

  registerOnChange(fn: any): void {
      this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
      this.onTouched = fn;
  }

  OnInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
    this.onChange(this.value());
    this.onTouched(this.value());
  }

  static GetErrorString(fieldName: string, errors: ValidationErrors): string|null {
    if (errors['required']) {
      return "Field is Required";
    }
    if (errors['minlength']) {
      return `${fieldName} needs to be at least ${errors['minlength'].requiredLength} characters long`;
    }
    if (errors['maxlength']) {
      return `${fieldName} cannot exceed ${errors['maxlength'].requiredLength} characters`;
    }
    if (errors['invalidCharacter']) {
      return `${fieldName} contains an invalid character`;
    }
    return null;
  }
}
