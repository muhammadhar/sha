import { ToastService } from './../services/ToastService.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { LocalStorageService } from '../services/localstorage.service';
import { ILogin } from './login';
import { LocalSessionService } from '../services/LocalSession.service';
import {
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInCalendarYears,
  differenceInDays,
  differenceInYears,
  parse,
  parseISO,
} from 'date-fns';
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
    // const mobileNumber = this.fg.value.MobileNumber;
    // const password = this.fg.value.Password;
    // // Perform login logic here
    // // You can use the mobileNumber and password variables to authenticate the user
    // const LoginData: ILogin = this._storage.getItem(mobileNumber);
    // if (LoginData !== null && LoginData.Password === password) {
    const loading = await this.loadingController.create({
      message: 'Logging in...',
      spinner: 'crescent',
      translucent: true,
    });
    //   this._session.saveSession('currentSession', LoginData);
    //   await loading.present();
    //   loading.dismiss();

    //   // Redirect to dashboard upon successful login
    this.router.navigate(['/members/dashboard']);
    // } else {
    // this._toast.create(
    //   'please enter correct Mobile# and Password, try again.',
    //   'danger',
    //   false,
    //   1000
    // );
    // this.fg.patchValue({
    //   MobileNumber: '92',
    //   Password: null,
    // });
    // }
    // this.calculateGrowthVelocity();
  }

  forgotPassword() {
    this.router.navigate(['/forgot_password']);
  }

  // calculateGrowthVelocity = () => {
  //   const child = {
  //     id: 'child1',
  //     gender: 'male', // or 'female' for girls
  //     dob: '2019-01-01',
  //     lastFiveVisits: [],
  //   };

  //   child.lastFiveVisits.push({ date: '2020-01-01', height: '80' });
  //   child.lastFiveVisits.push({ date: '2020-04-01', height: '83' });
  //   child.lastFiveVisits.push({ date: '2020-07-01', height: '86' });
  //   child.lastFiveVisits.push({ date: '2020-10-01', height: '89' });
  //   child.lastFiveVisits.push({ date: '2021-01-01', height: '92' });



  //   let lastFiveVisits = child.lastFiveVisits;

  //   if (lastFiveVisits) {
  //     if (lastFiveVisits.length >= 1) {
  //       for (let i = 1; i < lastFiveVisits.length; i++) {
  //         const previousVisit = lastFiveVisits[i - 1];
  //         const currentVisit = lastFiveVisits[i];

  //         const startDate = parseISO(previousVisit.date);
  //         const endDate = parseISO(currentVisit.date);

  //         const daysBetweenVisits = differenceInDays(endDate, startDate);

  //         const heightPreviousVisitCm = parseFloat(previousVisit.height);
  //         const heightCurrentVisitCm = parseFloat(currentVisit.height);

  //         // Check if daysBetweenVisits is positive
  //         const growthVelocity =
  //           daysBetweenVisits > 0
  //             ? ((heightCurrentVisitCm - heightPreviousVisitCm) /
  //                 daysBetweenVisits) *
  //               365
  //             : 0;

  //         lastFiveVisits[i].growthVelocity = growthVelocity.toFixed(2);

  //         const dob = parseISO(child.dob);
  //         const ageInYears = differenceInCalendarYears(endDate, dob);

  //         let growthVelocityRange;

  //         if (ageInYears >= 0 && ageInYears < 1) {
  //           growthVelocityRange = child.gender === 'male' ? 25 : 25; // cm per year for boys (0-1 year) and girls (0-1 year)
  //         } else if (ageInYears >= 1 && ageInYears < 2) {
  //           growthVelocityRange = child.gender === 'male' ? 12 : 12; // cm per year for boys (1-2 years) and girls (1-2 years)
  //         } else if (ageInYears >= 2 && ageInYears <= 3) {
  //           growthVelocityRange = child.gender === 'male' ? 8 : 8; // cm per year for boys (2-3 years) and girls (2-3 years)
  //         } else if (ageInYears >= 4 && ageInYears <= 11) {
  //           growthVelocityRange = child.gender === 'male' ? 7 : 8; // cm per year for boys (4-11 years) and girls (4-11 years)
  //         } else if (ageInYears > 11 && ageInYears <= 14) {
  //           growthVelocityRange = child.gender === 'male' ? 9.5 : 8.3; // cm per year for boys (11-14 years) and girls (11-14 years)
  //         } else {
  //           growthVelocityRange = 0;
  //         }

  //         // Compare growth velocity against the growth velocity range
  //         if (
  //           growthVelocity < growthVelocityRange * 0.9 ||
  //           growthVelocity > growthVelocityRange * 1.1
  //         ) {
  //           lastFiveVisits[i].growthVelocity = growthVelocity.toFixed(2) + ' R:' + growthVelocityRange
  //           console.log(
  //             `Warning: Growth velocity ${growthVelocity.toFixed(2)} cm/year is not within the expected range of ${growthVelocityRange} cm/year for a child of age ${ageInYears} years and gender ${child.gender}.`
  //           );
  //         }
  //       }
  //     }
  //   }

  //   console.log('Updated last five visits:', lastFiveVisits);

  //   child.lastFiveVisits = lastFiveVisits;
  // };
}
