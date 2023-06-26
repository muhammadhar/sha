import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
// import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  fg!: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    // private storage: Storage,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
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

    // Example: Simulating login with a loading indicator
    const loading = await this.loadingController.create({
      message: 'Logging in...',
      spinner: 'crescent',
      translucent: true,
    });
    await loading.present();

    setTimeout(() => {
      loading.dismiss();

      // Redirect to dashboard upon successful login
      this.router.navigate(['/members/dashboard']);
    }, 2000);
  }
}
