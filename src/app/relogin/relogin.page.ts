import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { LocalStorageService } from '../services/localstorage.service';
import { ToastService } from '../services/ToastService.service';
import { LocalSessionService } from '../services/LocalSession.service';

@Component({
  selector: 'app-relogin',
  templateUrl: './relogin.page.html',
  styleUrls: ['./relogin.page.scss'],
})
export class ReloginPage implements OnInit {
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
      Password: ['', Validators.required],
    });
  }

  async login() {
    // const password = this.fg.value.Password;
    // // Perform login logic here
    // // You can use the mobileNumber and password variables to authenticate the user
    // const LoginData: ILogin = this._storage.getItem(mobileNumber);
    // if (LoginData.Password === password) {
    const loading = await this.loadingController.create({
      message: 'Logging in...',
      spinner: 'crescent',
      translucent: true,
    });
    //   await loading.present();
    //   loading.dismiss();

    //   // Redirect to dashboard upon successful login
    this.router.navigate(['/advance_search']);
    // } else {
    // this._toast.create(
    //   'please enter correct Mobile# and Password, try again.',
    //   'danger',
    //   false,
    //   1000
    // );
    // this.fg.patchValue({
    //   Password: null,
    // });
    // }
  }
}
