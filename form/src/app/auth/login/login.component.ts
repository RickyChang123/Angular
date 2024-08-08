import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, of } from 'rxjs';

function mustContainQuestionMark(control: AbstractControl) {
  //自訂Validator,輸入的值要有?
  if (control.value.includes('?')) {
    return null;
  }
  return { doesNotContainQuestionMark: true };
}

function emailUnique(control: AbstractControl) {
  if (control.value === 'Ricky@gmail.com') {
    return of(null);
  }

  return of({ notUnique: true });
}

let initialEmailValue = '';
const saveFrom = window.localStorage.getItem('saved-login-form');

if (saveFrom) {
  const loadedForm = JSON.parse(saveFrom);
  initialEmailValue = loadedForm.email;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  form = new FormGroup({
    email: new FormControl(initialEmailValue, {
      validators: [Validators.email, Validators.required],
      asyncValidators: [emailUnique],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        mustContainQuestionMark, //自訂Validators
      ],
    }),
  });

  get emailInvalid() {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.dirty &&
      this.form.controls.email.invalid
    );
  }
  get passwordInvalid() {
    return (
      this.form.controls.password.touched &&
      this.form.controls.password.dirty &&
      this.form.controls.password.invalid
    );
  }

  ngOnInit(): void {
    // const saveFrom = window.localStorage.getItem('saved-login-form');

    // if (saveFrom) {
    //   const loadedForm = JSON.parse(saveFrom);
    //   //patchValue-部分更新
    //   this.form.patchValue({
    //     email: loadedForm.email,
    //   });
    // }

    const subscription = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          window.localStorage.setItem(
            'saved-login-form',
            JSON.stringify({ email: value.email })
          );
        },
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onSubmit() {
    console.log(this.form);
    const enterEmail = this.form.controls.email;
    const enterPassword = this.form.controls.password;
  }
}
