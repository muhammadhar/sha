import { ToastService } from './../services/ToastService.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { LocalStorageService } from '../services/localstorage.service';
import { ILogin } from './login';
import { LocalSessionService } from '../services/LocalSession.service';
// import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  fg!: FormGroup;
  errorStatus: string = '';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    // private storage: Storage,
    private _storage: LocalStorageService,
    private loadingController: LoadingController,
    private _toast: ToastService,
    private _session: LocalSessionService
  ) {}

  ngOnInit() {
    this._storage.setItem('923005665639', {
      MobileNumber: '923005665639',
      Password: '123123',
    });
    this.createLoginForm();
  }

  createLoginForm() {
    this.fg = this.formBuilder.group({
      MobileNumber: ['92', Validators.required],
      Password: ['', Validators.required],
    });
  }

  async login() {
    const mobileNumber = this.fg.value.MobileNumber;
    const password = this.fg.value.Password;
    // Perform login logic here
    // You can use the mobileNumber and password variables to authenticate the user
    const LoginData: ILogin = this._storage.getItem(mobileNumber);
    if (LoginData !== null && LoginData.Password === password) {
      const loading = await this.loadingController.create({
        message: 'Logging in...',
        spinner: 'crescent',
        translucent: true,
      });
      this._session.saveSession('currentSession', LoginData);
      await loading.present();
      loading.dismiss();

      // Redirect to dashboard upon successful login
      this.router.navigate(['/members/dashboard']);
    } else {
      this._toast.create(
        'please enter correct Mobile# and Password, try again.',
        'danger',
        false,
        3000
      );
      this.fg.patchValue({
        MobileNumber: '92',
        Password: null,
      });
    }

    // Example: Simulating login with a loading indicator
  }

  forgotPassword() {
    this.router.navigate(['/forgot_password']);
  }
}
