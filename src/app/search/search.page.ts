import { Component, OnInit } from '@angular/core';
// import { Platform } from '@ionic/angular';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing';
// import {
//   FileTransfer,
//   FileTransferObject,
// } from '@awesome-cordova-plugins/file-transfer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { IChildVisit, IVisit } from '../pastvisit/pastvisit';
import { LocalStorageService } from '../services/localstorage.service';
// import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
// import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
// import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { Platform } from '@ionic/angular';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

interface Ischool {
  name: string;
}
export interface IChild {
  id: string;
  childName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  email: string;
  whatsappNumber: number;
  selectedSchool: string;
}
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  childs: IChild[] = [];
  searchQuery: string = '';
  searchResults: IChild[] = [];
  selectedChilds: IChild[] = [];
  childArray: any[] = [];
  showClearSearchButton: boolean = false;
  showNoStudentMsg = false;
  noChildFound: boolean = false;
  pdfObject = null;

  constructor(
    private file: File, // private androidPermissions: AndroidPermissions, // private fileTransfer: FileTransfer, // private filePath: FilePath,  // private platform: Platform
    private _storage: LocalStorageService,
    private plt: Platform,
    private fileOpener: FileOpener
  ) {}
  formateDate(dateString: string) {
    const date = new Date(dateString);
    const formattedDate = format(date, 'd, MMMM yyyy', { locale: enGB });
    return formattedDate;
  }
  searchItems() {
    this.searchResults = this.childs.filter((child) =>
      child.childName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    if (this.searchResults.length === 0) {
      this.noChildFound = true;
      this.showClearSearchButton = true;
    }

    this.showClearSearchButton = true;
  }

  clearSearch() {
    this.searchQuery = '';
    this.selectedChilds = [];
    this.searchResults = [];
    this.showClearSearchButton = false;
    this.showNoStudentMsg = false;
    this.noChildFound = false;
  }
  ngOnInit() {
    //@ts-ignore
    const storedChilds = JSON.parse(localStorage.getItem('childs')) || [];
    this.childs = storedChilds;
  }

  onChildClick(child: IChild) {
    //@ts-ignore
    const storedChilds = JSON.parse(localStorage.getItem('childs')) || [];
    this.selectedChilds = storedChilds.filter(
      (ch: IChild) => ch.childName === child.childName
    );
    this.searchResults = [];
    // After populating searchResults array
    this.showClearSearchButton = true;
    if (this.selectedChilds.length === 0) {
      this.showNoStudentMsg = true;
      this.noChildFound = true;
    } else {
      this.showNoStudentMsg = false;
      this.noChildFound = false;
    }
  }

  onDownload(child: IChild) {
    // const childVisit: IChildVisit[] = this._storage.getItem(child.id);
    // console.log(childVisit);
    // if (childVisit.length > 1) {
    //   const lastIndex = childVisit.length - 1;
    //   this.createAndWriteCSVOfSingleChild(childVisit[lastIndex]);
    // } else {
    //   this.createAndWriteCSVOfSingleChild(childVisit[0]);
    // }

    this.createPdf(child.id);
  }

  convertObjectToCSV(object: IChildVisit): string {
    const keys = Object.keys(object);
    const header = keys.join(', ');
    //@ts-ignore
    const values = keys.map((key) => object[key]);
    const row = values.map((value) => `"${value}"`).join(', ');

    return `${header}\n${row}`;
  }

  createAndWriteCSVOfSingleChild(child: IChildVisit) {
    const fileName = Date.now().toString() + 'data.csv';
    const csvString = this.convertObjectToCSV(child);

    const dataDirectory = this.file.dataDirectory;

    this.file
      .writeFile(dataDirectory, fileName, csvString, { replace: true })
      .then(() => {
        const filePath = dataDirectory + fileName;
        const message = 'child' + ' CSV file downloaded successfully.';

        // Share the CSV file using SocialSharing
        SocialSharing.share(undefined, undefined, filePath, message)
          .then(() => {
            console.log('CSV file shared successfully.');
          })
          .catch((error: any) => {
            console.error('Error sharing CSV file:', error);
          });
      })
      .catch((error: any) => {
        console.error('Error creating and writing CSV file:', error);
      });
  }
  createAndWriteCSV(child: IChild[]) {
    const fileName = Date.now().toString() + 'data.csv';
    const csvString = this.convertArrayToCSV(child);

    const dataDirectory = this.file.dataDirectory;

    this.file
      .writeFile(dataDirectory, fileName, csvString, { replace: true })
      .then(() => {
        const filePath = dataDirectory + fileName;
        const message = 'Childs ' + ' CSV file downloaded successfully.';

        // Share the CSV file using SocialSharing
        SocialSharing.share(undefined, undefined, filePath, message)
          .then(() => {
            console.log('CSV file shared successfully.');
          })
          .catch((error: any) => {
            console.error('Error sharing CSV file:', error);
          });
      })
      .catch((error: any) => {
        console.error('Error creating and writing CSV file:', error);
      });
  }

  showNoChildMsg(): boolean {
    return this.childs.length === 0 ? true : false;
  }

  BulkChildDownload(selectedChilds: IChild[]) {
    this.createAndWriteCSV(selectedChilds);
  }

  convertArrayToCSV(objects: IChild[]): string {
    if (objects.length === 0) {
      return ''; // Return an empty string if the array is empty
    }

    const keys = Object.keys(objects[0]);
    const header = keys.join(',');

    const rows = objects.map((object) => {
      //@ts-ignore
      const values = keys.map((key) => object[key]);
      return values.map((value) => `"${value}"`).join(', ');
    });

    return `${header}\n\n${rows.join('\n\n\n')}`;
  }

  isPrintable(child: IChild): boolean {
    const childData: IChildVisit[] = this._storage.getItem(child.id);
    return childData.length > 0 ? false : true;
  }

  async createPdf(childId: string) {
    const childVisit: IChildVisit = this._storage.getItem(childId);
    const childArray: IChild[] = this._storage.getItem('childs');
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
    const VisitsArray = childVisit.lastFiveVisits.map(
      (visit: IVisit, index) => {
        if (index === 0) {
          firstEntryDate = visit.date;
        }
        return [
          visit.date || '',
          visit.weight || '',
          visit.height || '',
          visit.bmi || '',
          visit.growthVelocity || '',
          visit.muac || '',
        ];
      }
    );
    console.log(VisitsArray);
    const docDef = {
      content: [
        {
          text: "KID'S GROWTH AND GENERAL HEALTH ASSESSMENT",
          style: 'header',
          alignment: 'center',
          bold: true,
          fontSize: 18,
          margin: [0, 0, 0, 3], // Add a 10px bottom margin
        },
        {
          text: `Date of Latest Assessment : ${this.formateDate(firstEntryDate)}`,
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
                `${childDetails.childName} S/O ${childDetails.fatherName}`,
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
                { text: 'Date', bold: true },
                { text: 'Weight', bold: true },
                { text: 'Height', bold: true },
                { text: 'BMI', bold: true },
                { text: 'Growth Velocity', bold: true },
                { text: 'MUAC', bold: true },
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
                { text: 'Ear Wax', bold: true },
                { text: 'Vision', bold: true },
                { text: 'Palmar Pallor', bold: true },
              ],
              [
                `${childVisit.earWax}`,
                `${childVisit.vision}`,
                `${childVisit.palmarPallor}`,
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
                { text: 'Hygiene', bold: true },
                { text: 'Carries', bold: true },
                { text: 'Gaps', bold: true },
                { text: 'Scaling', bold: true },
              ],
              [
                `${childVisit.hygiene}`,
                `${childVisit.carries}`,
                `${childVisit.gaps}`,
                `${childVisit.scaling}`,
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
                { text: 'Vaccine', bold: true },
                { text: 'Status', bold: true },
              ],
              ['EPI', `${childVisit.epiStatus}`],
              ['Typhoid', `${childVisit.typhoid}`],
              ['Chickenpox', `${childVisit.chickenpox}`],
              ['Hepatitis A', `${childVisit.hepatitisA}`],
              ['MMR', `${childVisit.mmr}`],
              ['Meningitis', `${childVisit.meningitis}`],
            ],
          },
          margin: [0, 0, 0, 10],
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
        const fileName = 'myFile.pdf';

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
        await this.fileOpener.open(fileEntry.nativeURL, 'application/pdf');
      } catch (error) {
        console.log('some thing wrong with opening the file', error);
      }
      // });
    } else {
      this.pdfObject.download(`${childDetails.childName}.pdf`);
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
}
