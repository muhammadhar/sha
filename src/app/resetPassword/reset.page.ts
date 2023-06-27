import { LocalStorageService } from './../services/localstorage.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalSessionService } from '../services/LocalSession.service';
import { ILogin } from '../login/login';
import { ToastService } from '../services/ToastService.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {
  resetForm!: FormGroup;
  passwordRequiredError = 'Password is required.';
  passwordMinLengthError = 'Password must be at least 6 characters.';
  confirmPasswordRequiredError = 'Confirm Password is required.';
  notPassMatch: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private _storage: LocalStorageService,
    private _session: LocalSessionService,
    private _toast: ToastService
  ) {}

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      return;
    }

    const password = this.resetForm.value.password;
    const confirmPassword = this.resetForm.value.confirmPassword;

    if (password !== confirmPassword) {
      this.confirmPasswordRequiredError = 'password does not match';
      this.notPassMatch = 'true';
      setTimeout(() => {
        this.resetForm.reset();
        this.notPassMatch = '';
      }, 1500);
    } else {
      const userSessionData: ILogin =
        this._session.getSession('currentSession');
      if (userSessionData) {
        userSessionData.Password = password;
        this._storage.setItem(userSessionData.MobileNumber, userSessionData);
        this._session.saveSession('currentSession', userSessionData);
        this._toast.create(
          'password changed successfuly',
          'success',
          false,
          1000
        );
      }
      this.resetForm.reset();
    }
  }

  isControlInvalidAndTouched(controlName: string): boolean {
    const control = this.resetForm.get(controlName);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }
}
