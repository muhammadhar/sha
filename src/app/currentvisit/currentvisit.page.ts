import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../services/localstorage.service';
import { IChild } from '../search/search.page';
import { ToastService } from '../services/ToastService.service';
import { IChildVisit, IVisit } from '../pastvisit/pastvisit';
import { IonInput, IonSelect } from '@ionic/angular';
@Component({
  selector: 'app-currentvisit',
  templateUrl: './currentvisit.page.html',
  styleUrls: ['./currentvisit.page.scss'],
})
export class CurrentvisitPage implements OnInit {
  //@ts-ignore
  @ViewChild('visionInput') visionInput: IonInput;
  //@ts-ignore
  @ViewChild('palmarPallorInput') palmarPallorInput: IonInput;
  //@ts-ignore
  @ViewChild('hygieneInput') hygieneInput: IonInput;
  //@ts-ignore
  @ViewChild('carriesInput') carriesInput: IonInput;
  //@ts-ignore
  @ViewChild('scalingInput') scalingInput: IonInput;
  //@ts-ignore
  @ViewChild('gapsInput') gapsInput: IonInput;
  //@ts-ignore
  @ViewChild('typhoidInput') typhoidInput: IonInput;
  //@ts-ignore
  @ViewChild('chickenpoxInput') chickenpoxInput: IonInput;
  //@ts-ignore
  @ViewChild('hepatitisAInput') hepatitisAInput: IonInput;
  //@ts-ignore
  @ViewChild('mmrInput') mmrInput: IonInput;
  //@ts-ignore
  @ViewChild('meningitisInput') meningitisInput: IonInput;
  visitForm!: FormGroup;
  lastFiveVisits: IVisit[] = [];
  // Form fields
  childId = '';
  childName = '';
  visits: IVisit[] = [];
  date = '';
  weight = '';
  height = '';
  bmi = '';
  growthVelocity = '';
  muac = '';
  earWax = '';
  vision = '';
  palmarPallor = '';
  hygiene = '';
  carries = '';
  extraction = '';
  scaling = '';
  gaps = '';
  chickenpox = '';
  hepatitisA = '';
  mmr = '';
  meningitis = '';
  typhoid = '';
  epiStatus = '';

  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private _toast: ToastService,
    private rotuer: Router
  ) {
    this.visitForm = this.formBuilder.group({
      childName: ['', Validators.required],
      weight: ['', Validators.required],
      height: ['', Validators.required],
      bmi: ['', Validators.required],
      growthVelocity: ['', Validators.required],
      muac: ['', Validators.required],
      earWax: ['', Validators.required],
      vision: ['', Validators.required],
      palmarPallor: ['', Validators.required],
      hygiene: ['', Validators.required],
      carries: ['', Validators.required],
      extraction: ['', Validators.required],
      scaling: ['', Validators.required],
      gaps: ['', Validators.required],
      chickenpox: ['', Validators.required],
      hepatitisA: ['', Validators.required],
      mmr: ['', Validators.required],
      meningitis: ['', Validators.required],
      typhoid: ['', Validators.required],
      epiStatus: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.childId = this.getChildIdFromParam(); // Retrieve child ID from parameter
    const childData = this.getChildDataFromLocalStorage(this.childId); // Retrieve child data from local storage
    if (childData) {
      this.childName = childData.childName; // Get child's name
    }
  }

  onSubmit() {
    // console.log('new data ', newData);
    const dataArray: IChildVisit = this.getArrayFromLocalStorage(this.childId);
    if (Object.keys(dataArray).length > 0) {
      this.visits = dataArray.visits;
      this.lastFiveVisits = dataArray.lastFiveVisits;
    }
    console.log(dataArray);
    this.visits.push({
      date: this.getCurrentDate(),
      weight: this.weight,
      height: this.height,
      bmi: this.calculateBMI(this.height, this.weight),
      growthVelocity: this.growthVelocity,
      muac: this.muac,
    });

    this.lastFiveVisits.push({
      date: this.getCurrentDate(),
      weight: this.weight,
      height: this.height,
      bmi: this.calculateBMI(this.height, this.weight),
      growthVelocity: this.calculateGrowthVelocity(),
      muac: this.muac,
    });

    if (this.lastFiveVisits.length > 5) {
      this.lastFiveVisits.shift(); // Remove the first entry (oldest visit)
    } 

    const newData: IChildVisit = {
      childName: this.childName,
      earWax: this.earWax,
      vision: this.vision,
      palmarPallor: this.palmarPallor,
      hygiene: this.hygiene,
      carries: this.carries,
      scaling: this.scaling,
      gaps: this.gaps,
      chickenpox: this.chickenpox,
      hepatitisA: this.hepatitisA,
      mmr: this.mmr,
      meningitis: this.meningitis,
      typhoid: this.typhoid,
      epiStatus: this.epiStatus,
      visits: this.visits,
      lastFiveVisits: this.lastFiveVisits,
    };
    this.saveArrayToLocalStorage(this.childId, newData);
    this._toast.create('new visit added successfully', 'success', false, 2000);
    this.visitForm.reset();
    this.rotuer.navigate(['members/dashboard']);
  }

  private getChildIdFromParam(): string {
    const childId = this.route.snapshot.paramMap.get('childId');
    return childId ? childId : '';
  }

  private getChildDataFromLocalStorage(childId: string): IChild | null {
    const childs: IChild[] = this.localStorageService.getItem('childs');
    const filteredChild: IChild | undefined = childs.find(
      (child: IChild) => child.id === childId
    );
    return filteredChild || null;
  }

  private getArrayFromLocalStorage(childId: string): IChildVisit {
    const existingArray = this.localStorageService.getItem(childId);
    return existingArray ? existingArray : {};
  }

  private saveArrayToLocalStorage(childId: string, dataArray: any): void {
    this.localStorageService.setItem(childId, dataArray);
  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  handleNextInput(event: any, nextInput?: IonInput | IonSelect) {
    if (event.detail.value && nextInput) {
      if (nextInput instanceof IonInput) {
        nextInput.setFocus();
      } else if (nextInput instanceof IonSelect) {
        nextInput.open();
      }
    }
  }
  calculateBMI(height: string, weight: string): string {
    const numericHeight = parseFloat(height);
    const numericWeight = parseFloat(weight);

    // Check if height and weight are valid numbers
    if (isNaN(numericHeight) || isNaN(numericWeight)) {
      throw new Error('Invalid height or weight');
    }

    // Calculate BMI
    const heightInMeters = numericHeight / 100; // Convert height from cm to meters
    const bmi = numericWeight / (heightInMeters * heightInMeters);

    return parseFloat(bmi.toFixed(2)).toString();
  }

  calculateGrowthVelocity = () => {
    const child = this.localStorageService.getItem(this.childId);
    if (child?.lastFiveVisits && child.lastFiveVisits.length>=1) { //error on 2nd entry and should b moved to pdf n pastvisits
      const lastFiveVisits = child.lastFiveVisits;
      const previousVisit = lastFiveVisits[lastFiveVisits.length - 2];
      const currentVisit = lastFiveVisits[lastFiveVisits.length - 1];
      const daysBetweenVisits = Math.floor(
        (new Date(currentVisit.date).getTime() -
          new Date(previousVisit.date).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const heightPreviousVisitCm = parseInt(previousVisit.height);
      const heightCurrentVisitCm = parseInt(currentVisit.height);

      return (
        (((heightCurrentVisitCm - heightPreviousVisitCm) / daysBetweenVisits) *
          365) /
        100
      ).toString();
    }
    return '';
  };
  // calculateGrowthVelocities(id: string): string {
  //   const visits = this.localStorageService.getItem(id)?.visits;
  //   if (visits) {
  //     let growthVelocities = '';

  //     if (visits.length < 2) {
  //       return growthVelocities;
  //     }

  //     for (let i = 1; i < visits.length; i++) {
  //       const previousVisit = visits[i - 1];
  //       const currentVisit = visits[i];

  //       const previousHeight = parseFloat(previousVisit.height);
  //       const currentHeight = parseFloat(currentVisit.height);
  //       const previousDate = new Date(previousVisit.date);
  //       const currentDate = new Date(currentVisit.date);

  //       if (isNaN(previousHeight) || isNaN(currentHeight)) {
  //         continue;
  //       }

  //       const timeDifferenceInMonths = this.getMonthDifference(
  //         previousDate,
  //         currentDate
  //       );

  //       // Skip the calculation if the time difference is zero or very close to zero
  //       if (timeDifferenceInMonths <= 0.001) {
  //         continue;
  //       }

  //       const heightDifferenceInCentimeters = currentHeight - previousHeight;

  //       const growthVelocity =
  //         heightDifferenceInCentimeters / timeDifferenceInMonths;
  //       growthVelocities += growthVelocity.toString() + ',';
  //     }

  //     return growthVelocities.slice(0, -1);
  //   } // Remove the trailing comma
  //    return "";
  // }

  getMonthDifference(startDate: Date, endDate: Date): number {
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();

    const monthsDifference =
      (endYear - startYear) * 12 + (endMonth - startMonth);

    return monthsDifference;
  }
}
