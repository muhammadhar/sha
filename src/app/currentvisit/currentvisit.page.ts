import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../services/localstorage.service';
import { IChild } from '../search/search.page';
import { ToastService } from '../services/ToastService.service';
import { IChildVisit } from '../pastvisit/pastvisit';
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
  visitData: any;
  // Form fields
  childId = '';
  childName = '';
  visit = [];
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
    const newData: IChildVisit = {
      childName: this.childName,
      date: this.getCurrentDate(),
      weight: this.weight,
      height: this.height,
      bmi: this.bmi,
      growthVelocity: this.growthVelocity,
      muac: this.muac,
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
    };
    console.log('new data ', newData);
    const dataArray: IChildVisit[] = this.getArrayFromLocalStorage(
      this.childId
    ); // Retrieve existing array from local storage
    dataArray.push(newData); // Push the new object into the array
    this.saveArrayToLocalStorage(this.childId, dataArray); // Store the updated array back into local storage

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

  private getArrayFromLocalStorage(childId: string): IChildVisit[] {
    const existingArray = this.localStorageService.getItem(childId);
    return existingArray ? existingArray : [];
  }

  private saveArrayToLocalStorage(childId: string, dataArray: any[]): void {
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
}
