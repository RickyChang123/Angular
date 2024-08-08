import { Component } from '@angular/core';

import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

function equalValues(ControlName1: string, ControlName2: string) {
  return (control: AbstractControl) => {
    const val1 = control.get(ControlName1)?.value;
    const val2 = control.get(ControlName2)?.value;

    if (val1 === val2) {
      return null;
    }
    return { valueNotEqual: true };
  };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    //Nest Form Group
    passwords: new FormGroup(
      {
        password: new FormControl('', {
          validators: [Validators.required, Validators.minLength(6)],
        }),
        confirmPassword: new FormControl('', {
          validators: [Validators.required, Validators.minLength(6)],
        }),
      },
      {
        validators: [equalValues('password', 'confirmPassword')],
      }
    ),
    firstName: new FormControl('', { validators: [Validators.required] }),
    lastName: new FormControl('', { validators: [Validators.required] }),
    street: new FormControl('', { validators: [Validators.required] }),
    number: new FormControl('', { validators: [Validators.required] }),
    postalcode: new FormControl('', { validators: [Validators.required] }),
    city: new FormControl('', { validators: [Validators.required] }),
    role: new FormControl<
      'student' | 'teacher' | 'employee' | 'founder' | 'other'
    >('student', { validators: [Validators.required] }),
    source: new FormArray([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
    ]),
    agree: new FormControl(false, { validators: [Validators.required] }),
  });

  onSubmit() {
    if (this.form.invalid) {
      console.log('INVAlid FORM');
      return;
    }

    console.log(this.form);
  }
}
