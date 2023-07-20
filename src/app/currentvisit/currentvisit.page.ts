import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../services/localstorage.service';
import { Child as IChild } from '../advancesearch/advancesearch.page';
import { ToastService } from '../services/ToastService.service';
import { IChildVisit, IVisit } from '../pastvisit/pastvisit';
import { IonInput, IonSelect, Platform } from '@ionic/angular';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import {
  differenceInCalendarDays,
  differenceInCalendarYears,
  format,
  parseISO,
} from 'date-fns';
import { enGB } from 'date-fns/locale';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing';
import { differenceInDays, parse } from 'date-fns';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
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
  pdfObject = null;

  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private _toast: ToastService,
    private rotuer: Router,
    private file: File, // private androidPermissions: AndroidPermissions, // private fileTransfer: FileTransfer, // private filePath: FilePath,  // private platform: Platform
    private plt: Platform,
    private fileOpener: FileOpener
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
  }

  onSubmit() {
    // console.log('new data ', newData);
    const dataArray: IChildVisit = this.localStorageService
      .getItem('childs')
      .find((child) => child.id === this.childId);

    Object.keys(dataArray).forEach((key) => {
      if (key === 'visits' && dataArray[key].length > 0) {
        this.visits = dataArray.visits;
        this.lastFiveVisits = dataArray.lastFiveVisits;
      }
    });
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
      growthVelocity: this.growthVelocity,
      muac: this.muac,
    });

    if (this.lastFiveVisits.length > 5) {
      this.lastFiveVisits.shift(); // Remove the first entry (oldest visit)
    }

    const newData = {
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

    // this.saveArrayToLocalStorage(this.childId, newData);
    const extendedChild = this.localStorageService
      .getItem('childs')
      .find((child) => child.id === this.childId);
    const updatedExtendedChild = { ...extendedChild, ...newData };
    let allChilds = this.localStorageService.getItem('childs');
    if (allChilds) {
      allChilds = allChilds.map((child) => {
        if (child.id === this.childId) {
          return updatedExtendedChild;
        }
        return child;
      });
    }
    this.localStorageService.setItem('childs', allChilds);

    this._toast.create('new visit added successfully', 'success', false, 2000);
    this.visitForm.reset();
    this.calculateGrowthVelocity();
    this.createPdf(this.childId);
    setTimeout(() => {
      this.rotuer.navigate(['members/dashboard']);
    }, 2000);
  }

  private getChildIdFromParam(): string {
    const childId = this.route.snapshot.paramMap.get('childId');
    return childId ? childId : '';
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
    const childDetails = this.localStorageService
      .getItem('childs')
      .find((ch) => ch.id === this.childId);

    let lastFiveVisits = childDetails?.lastFiveVisits;
    // if (lastFiveVisits) {
    //   if (lastFiveVisits.length >= 1) {
    //     //   // Sort the visits by date in ascending order
    //     //   lastFiveVisits.sort((a, b) => {
    //     //     const dateA = parseISO(a.date);
    //     //     const dateB = parseISO(b.date);
    //     //     return dateA.getTime() - dateB.getTime();
    //     //   });

    //     for (let i = 1; i < lastFiveVisits.length; i++) {
    //       const previousVisit = lastFiveVisits[i - 1];
    //       const currentVisit = lastFiveVisits[i];

    //       const startDate = parseISO(previousVisit.date);
    //       const endDate = parseISO(currentVisit.date);

    //       const daysBetweenVisits = differenceInCalendarDays(
    //         endDate,
    //         startDate
    //       );

    //       const heightPreviousVisitCm = parseFloat(previousVisit.height);
    //       const heightCurrentVisitCm = parseFloat(currentVisit.height);

    //       // Check if daysBetweenVisits is positive
    //       const growthVelocity =
    //         daysBetweenVisits > 0
    //           ? ((heightCurrentVisitCm - heightPreviousVisitCm) /
    //               daysBetweenVisits) *
    //             365
    //           : 0;

    //       lastFiveVisits[i].growthVelocity = growthVelocity.toFixed(2);
    //     }

    //     // Calculate growth velocity for the first entry
    //     // const firstVisit = lastFiveVisits[0];
    //     // firstVisit.growthVelocity = '';

    //     // if (lastFiveVisits.length >= 2) {
    //     //   const secondVisit = lastFiveVisits[1];

    //     //   const startDate = parseISO(firstVisit.date);
    //     //   const endDate = parseISO(secondVisit.date);

    //     //   const daysBetweenFirstAndSecondVisits = differenceInCalendarDays(endDate, startDate);

    //     //   const heightFirstVisitCm = parseFloat(firstVisit.height);
    //     //   const heightSecondVisitCm = parseFloat(secondVisit.height);

    //     //   // Check if daysBetweenFirstAndSecondVisits is positive
    //     //   const growthVelocityFirstVisit =
    //     //     daysBetweenFirstAndSecondVisits > 0
    //     //       ? (((heightSecondVisitCm - heightFirstVisitCm) /
    //     //           daysBetweenFirstAndSecondVisits) *
    //     //           365)
    //     //       : 0;

    //     //   lastFiveVisits[0].growthVelocity =
    //     //     growthVelocityFirstVisit.toFixed(2);
    //     // }
    //   }
    // }

    if (lastFiveVisits) {
      if (lastFiveVisits.length >= 1) {
        for (let i = 1; i < lastFiveVisits.length; i++) {
          const previousVisit = lastFiveVisits[i - 1];
          const currentVisit = lastFiveVisits[i];

          const startDate = parseISO(previousVisit.date);
          const endDate = parseISO(currentVisit.date);

          const daysBetweenVisits = differenceInDays(endDate, startDate);

          const heightPreviousVisitCm = parseFloat(previousVisit.height);
          const heightCurrentVisitCm = parseFloat(currentVisit.height);

          // Check if daysBetweenVisits is positive
          const growthVelocity =
            daysBetweenVisits > 0
              ? ((heightCurrentVisitCm - heightPreviousVisitCm) /
                  daysBetweenVisits) *
                365
              : 0;

          lastFiveVisits[i].growthVelocity = growthVelocity.toFixed(2);

          const dob = parseISO(childDetails.dateOfBirth);
          const ageInYears = differenceInCalendarYears(endDate, dob);

          let growthVelocityRange;

          if (ageInYears >= 0 && ageInYears < 1) {
            growthVelocityRange = childDetails.gender === 'male' ? 25 : 25; // cm per year for boys (0-1 year) and girls (0-1 year)
          } else if (ageInYears >= 1 && ageInYears < 2) {
            growthVelocityRange = childDetails.gender === 'male' ? 12 : 12; // cm per year for boys (1-2 years) and girls (1-2 years)
          } else if (ageInYears >= 2 && ageInYears <= 3) {
            growthVelocityRange = childDetails.gender === 'male' ? 8 : 8; // cm per year for boys (2-3 years) and girls (2-3 years)
          } else if (ageInYears >= 4 && ageInYears <= 11) {
            growthVelocityRange = childDetails.gender === 'male' ? 7 : 8; // cm per year for boys (4-11 years) and girls (4-11 years)
          } else if (ageInYears > 11 && ageInYears <= 14) {
            growthVelocityRange = childDetails.gender === 'male' ? 9.5 : 8.3; // cm per year for boys (11-14 years) and girls (11-14 years)
          } else {
            growthVelocityRange = 0;
          }

          // Compare growth velocity against the growth velocity range
          if (
            growthVelocity < growthVelocityRange * 0.9 ||
            growthVelocity > growthVelocityRange * 1.1
          ) {
            lastFiveVisits[i].growthVelocity =
              growthVelocity.toFixed(2) + '(' + growthVelocityRange + ')';
            console.log(
              `Warning: Growth velocity ${growthVelocity.toFixed(
                2
              )} cm/year is not within the expected range of ${growthVelocityRange} cm/year for a child of age ${ageInYears} years and gender ${
                childDetails.gender
              }.`
            );
          }
        }
      }
    }

    console.log('Updated last five visits:', lastFiveVisits);

    childDetails.lastFiveVisits = lastFiveVisits;
    let allChilds = this.localStorageService.getItem('childs');
    if (allChilds) {
      allChilds = allChilds.map((child) => {
        if (child.id === childDetails.id) {
          return childDetails;
        }
        return child;
      });
    }
    this.localStorageService.setItem('childs', allChilds);
  };

  getMonthDifference(startDate: Date, endDate: Date): number {
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();

    const monthsDifference =
      (endYear - startYear) * 12 + (endMonth - startMonth);

    return monthsDifference;
  }

  async createPdf(childId: string) {
    // const childVisit: IChildVisit = this.localStorageService.getItem(childId);
    const childArray: IChild[] = this.localStorageService.getItem('childs');
    const childDetails: IChild = childArray.find(
      (child) => child.id === childId
    );
    // console.log(childVisit);
    // if (childVisit.length > 1) {
    //   const lastIndex = childVisit.length - 1;
    //   this.createAndWriteCSVOfSingleChild(childVisit[lastIndex]);
    // } else {
    //   this.createAndWriteCSVOfSingleChild(childVisit[0]);
    // }
    let firstEntryDate = '';
    let UpdatedVisitsArray = [];
    if (childDetails.lastFiveVisits.length > 1) {
      UpdatedVisitsArray = childDetails.lastFiveVisits.sort((a, b) => {
        //@ts-ignore
        const dateA = new Date(a.date);
        //@ts-ignore
        const dateB = new Date(b.date);
        //@ts-ignore
        return dateB - dateA;
      });
    } else {
      UpdatedVisitsArray = childDetails.lastFiveVisits;
    }
    const VisitsArray = UpdatedVisitsArray.map((visit: IVisit, index) => {
      if (index === 0) {
        firstEntryDate = visit.date;
      }
      return [
        { text: visit.date || '', alignment: 'center' },
        { text: visit.weight || '', alignment: 'center' },
        { text: visit.height || '', alignment: 'center' },
        { text: visit.bmi || '', alignment: 'center' },
        {
          text: visit.growthVelocity || '',
          bold: visit.growthVelocity.includes('(') ? true : false,
        },
        { text: visit.muac || '', alignment: 'center' },
      ];
    });
    console.log(VisitsArray);
    const docDef = {
      content: [
        {
          columns: [
            {
              width: '*',
              text: 'Healthcare | Emergency | Vaccines',
              decoration: 'underline',
            },
            {
              width: '*',
              table: {
                widths: ['*', '*'], // Adjust the column widths as needed
                body: [
                  [
                    {
                      image: await this.getBase64ImageFromURL(
                        '../../assets/HomeNursing.PNG'
                      ),
                      width: 100,
                      height: 40,
                      alignment: 'center',
                      border: [false, false, false, false], // Remove border around the cell
                      margin: [0, -20, -13, 20],
                    },
                    {
                      text: 'Metacare',
                      bold: true,
                      fontSize: 20,
                      alignment: 'center',
                      border: [false, false, false, false], // Remove border around the cell
                      margin: [0, 0, 45, 20],
                    },
                  ],
                ],
              },
              layout: {
                hLineWidth: function (i, node) {
                  return i === 0 || i === node.table.body.length ? 0 : 1; // Remove the horizontal lines between rows
                },
                vLineWidth: function (i) {
                  return 0; // Remove the vertical lines within the table
                },
                paddingLeft: function (i) {
                  return i === 0 ? 0 : 8; // Add padding to the left of the second column
                },
                paddingRight: function (i) {
                  return i === 0 ? 0 : 8; // Add padding to the right of the first column
                },
              },
            },
          ],
        },
        {
          text: "KID'S GROWTH AND GENERAL HEALTH ASSESSMENT",
          style: 'header',
          alignment: 'center',
          bold: true,
          fontSize: 18,
          margin: [0, 0, 0, 3], // Add a 10px bottom margin
        },
        {
          text: `Date of Latest Assessment : ${this.formateDate(
            firstEntryDate
          )}`,
          style: 'header',
          alignment: 'center',
          bold: true,
          fontSize: 10,
          margin: [0, 0, 0, 20], // Add a 10px bottom margin
        },
        {
          style: 'childTable',
          table: {
            widths: ['*', '*'], // Set both columns to have equal width
            body: [
              [
                `${childDetails.childName} ${
                  childDetails.gender === 'male' ? '  S/O  ' : '  D/O  '
                } ${childDetails.fatherName}`,
                `DOB: ${this.formateDate(childDetails.dateOfBirth)}`,
              ],
            ],
          },
          margin: [0, 0, 0, 10], // Add a 10px bottom margin
        },
        {
          style: 'childTable',
          table: {
            widths: ['*', '*', '*', '*', 'auto', '*'],
            body: [
              [
                {
                  text: 'Date',
                  bold: true,
                  alignment: 'center',
                  border: [true, true, true, false],
                },
                {
                  text: 'Weight',
                  bold: true,
                  alignment: 'center',
                  border: [false, true, true, false],
                },
                {
                  text: 'Height',
                  bold: true,
                  alignment: 'center',
                  border: [false, true, true, false],
                },
                {
                  text: 'BMI',
                  bold: true,
                  alignment: 'center',
                  border: [false, true, true, false],
                },
                {
                  text: 'Growth Velocity',
                  bold: true,
                  border: [false, true, true, false],
                },
                {
                  text: 'MUAC',
                  bold: true,
                  alignment: 'center',
                  border: [false, true, true, false],
                },
              ],
              [
                {
                  text: '',
                  bold: true,
                  alignment: 'center',
                  border: [true, false, true, false],
                },
                {
                  text: '(kg)',
                  bold: true,
                  alignment: 'center',
                  border: [false, false, true, false],
                },
                {
                  text: '(cm)',
                  bold: true,
                  alignment: 'center',
                  border: [false, false, true, false],
                },
                {
                  text: '(KG/m2)',
                  bold: true,
                  alignment: 'center',
                  border: [false, false, true, false],
                },
                {
                  text: '(cm/year)',
                  bold: true,
                  alignment: 'center',
                  border: [false, false, true, false],
                },
                {
                  text: '(cm)',
                  bold: true,
                  alignment: 'center',
                  border: [false, false, true, false],
                },
              ],

              ...VisitsArray,
            ],
          },
          margin: [0, 0, 0, 10], // Add a 10px bottom margin
        },
        {
          style: 'childTable',
          table: {
            widths: ['*', '*', '*'],
            body: [
              [
                { text: 'Ear Wax', bold: true, alignment: 'center' },
                { text: 'Vision', bold: true, alignment: 'center' },
                { text: 'Palmar Pallor', bold: true, alignment: 'center' },
              ],
              [
                { text: `${childDetails.earWax}`, alignment: 'center' },
                { text: `${childDetails.vision}`, alignment: 'center' },
                { text: `${childDetails.palmarPallor}`, alignment: 'center' },
              ],
            ],
          },
          margin: [0, 0, 0, 10],
        },
        {
          style: 'childTable',
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [
                { text: 'DENTAL EXAMINATION', colSpan: 4, bold: true },
                '',
                '',
                '',
              ],
              [
                { text: 'Hygiene', bold: true, alignment: 'center' },
                { text: 'Carries', bold: true, alignment: 'center' },
                { text: 'Gaps', bold: true, alignment: 'center' },
                { text: 'Scaling', bold: true, alignment: 'center' },
              ],
              [
                { text: `${childDetails.hygiene}`, alignment: 'center' },
                { text: `${childDetails.carries}`, alignment: 'center' },
                { text: `${childDetails.gaps}`, alignment: 'center' },
                { text: `${childDetails.scaling}`, alignment: 'center' },
              ],
            ],
          },
          margin: [0, 0, 0, 10],
        },
        {
          style: 'childTable',
          table: {
            widths: ['*', '*'],
            body: [
              [
                { text: 'Vaccine', bold: true, alignment: 'center' },
                { text: 'Status', bold: true, alignment: 'center' },
              ],
              ['EPI', `${childDetails.epiStatus}`],
              ['Typhoid', `${childDetails.typhoid}`],
              ['Chickenpox', `${childDetails.chickenpox}`],
              ['Hepatitis A', `${childDetails.hepatitisA}`],
              ['MMR', `${childDetails.mmr}`],
              ['Meningitis', `${childDetails.meningitis}`],
            ],
          },
          margin: [0, 0, 0, 10],
        },
        {
          style: 'childTable',
          table: {
            widths: ['*'],
            body: [['comments:'], ['  '], ['  '], ['  ']],
          },
          margin: [0, 0, 0, 10],
        },
        {
          style: 'childTable',
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [
                {
                  text: 'PARTNERS',
                  colSpan: 4,
                  bold: true,
                  alignment: 'center',
                },
                '',
                '',
                '',
              ],
              [
                {
                  image: await this.getBase64ImageFromURL(
                    '../../assets/Vaccine.png'
                  ),
                  width: 120,
                  height: 50,
                  alignment: 'center',
                },
                {
                  image: await this.getBase64ImageFromURL(
                    '../../assets/HomeNursing.PNG'
                  ),
                  width: 120,
                  height: 50,
                  alignment: 'center',
                },
                {
                  image: await this.getBase64ImageFromURL(
                    '../../assets/SmileResort.PNG'
                  ),
                  width: 120,
                  height: 50,
                  alignment: 'center',
                },
                {
                  image: await this.getBase64ImageFromURL(
                    '../../assets/BabyMedics.png'
                  ),
                  width: 120,
                  height: 50,
                  alignment: 'center',
                },
              ],
              [
                { text: 'Vaccine.pk', alignment: 'center' },
                { text: 'HomeNursing.pk', alignment: 'center' },
                { text: 'SmileResort.com', alignment: 'center' },
                { text: 'BabyMedics.com', alignment: 'center' },
              ],
            ],
          },
          margin: [0, 0, 0, 5],
        },

        {
          style: 'childTable',
          table: {
            widths: ['auto', '*', 'auto', '*', 'auto', '*'],
            body: [
              [
                {
                  image: await this.getBase64ImageFromURL(
                    '../../assets/icon1.PNG'
                  ),
                  fit: [20, 20],
                },
                { text: '051 5735006', alignment: 'center' },
                {
                  image: await this.getBase64ImageFromURL(
                    '../../assets/icon2.PNG'
                  ),
                  fit: [20, 20],
                },
                { text: 'info.metacare.pk', alignment: 'center' },
                {
                  image: await this.getBase64ImageFromURL(
                    '../../assets/icon3.PNG'
                  ),
                  fit: [20, 20],
                },
                { text: 'Metacare.pk', alignment: 'center' },
              ],
              [
                {
                  text: 'Main PWD Road, National Police Foundation Islamabad',
                  colSpan: 6,
                  alignment: 'center',
                },
                '',
                '',
                '',
                '',
                '',
              ],
            ],
          },
        },
      ],
    };

    this.pdfObject = pdfMake.createPdf(docDef);
    if (this.plt.is('cordova')) {
      try {
        const pdfDocGenerator = pdfMake.createPdf(docDef);

        // Generate the PDF as a data URL
        const pdfAsDataUrl = await this.getPdfAsDataUrl(pdfDocGenerator);

        // Generate a unique file name
        const fileName =
          Date.now().toString() + ' ' + childDetails.childName + '.pdf';

        // Get the device's data directory
        const dataDirectory = this.file.dataDirectory;

        // Convert the data URL to Blob
        const pdfBlob = this.dataURLToBlob(pdfAsDataUrl);

        const fileEntry = await this.file.writeFile(
          dataDirectory,
          fileName,
          pdfBlob,
          { replace: true }
        );
        await SocialSharing.share(
          undefined,
          undefined,
          dataDirectory + fileName,
          'pdf file'
        );
      } catch (error) {
        console.log('some thing wrong with sharing the file', error);
      }
      // });
    } else {
      this.pdfObject.download(
        `${Date.now().toString() + ' ' + childDetails.childName}.pdf`
      );
    }
  }

  getPdfAsDataUrl(pdfDocGenerator: any): Promise<string> {
    return new Promise((resolve, reject) => {
      pdfDocGenerator.getBase64((dataUrl: string) => {
        resolve(dataUrl);
      });
    });
  }

  dataURLToBlob(dataUrl: string): Blob {
    console.log(dataUrl); // Add this line to check the value

    const binaryString = window.atob(dataUrl);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes.buffer], { type: 'application/pdf' });
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = () => {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = url;
    });
  }
  formateDate(dateString: string) {
    const date = new Date(dateString);
    const formattedDate = format(date, 'd, MMMM yyyy', { locale: enGB });
    return formattedDate;
  }
}
