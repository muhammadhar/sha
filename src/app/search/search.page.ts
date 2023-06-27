import { Component, OnInit } from '@angular/core';
// import { Platform } from '@ionic/angular';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing';
// import {
//   FileTransfer,
//   FileTransferObject,
// } from '@awesome-cordova-plugins/file-transfer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
// import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
// import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
// import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
// import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';

interface Ischool {
  name: string;
}
interface IChild {
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
  schools: Ischool[] = [];
  searchQuery: string = '';
  searchResults: Ischool[] = [];
  selectedChilds: IChild[] = [];
  childArray: any[] = [];
  showClearSearchButton: boolean = false;
  showNoStudentMsg = false;

  constructor(
    private file: File // private androidPermissions: AndroidPermissions, // private fileTransfer: FileTransfer, // private filePath: FilePath, // private fileOpener: FileOpener, // private platform: Platform
  ) {}
  searchItems() {
    this.searchResults = this.schools.filter((school) =>
      school.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    if (this.searchResults.length === 0) {
      this.searchResults.push({
        name: 'no school found for the given search text.',
      });
    }

    this.showClearSearchButton = this.searchResults.length > 0;
  }

  clearSearch() {
    this.selectedChilds = [];
    this.searchResults = [];
    this.showClearSearchButton = false;
    this.showNoStudentMsg = false;
  }
  ngOnInit() {
    //@ts-ignore
    const storedSchools = JSON.parse(localStorage.getItem('schools'));
    if (storedSchools.length === 0) {
      this.searchResults.push({
        name: 'no school found for the given search text.',
      });
    } else {
      this.searchResults = storedSchools;
    }
    this.schools = storedSchools || [
      { name: 'no school data available for this student' },
    ];
  }

  onSchoolClick(school: Ischool) {
    //@ts-ignore
    const storedChilds = JSON.parse(localStorage.getItem('childs')) || [];
    this.selectedChilds = storedChilds.filter(
      (child: IChild) => child.selectedSchool === school.name
    );
    this.searchResults = [];
    // After populating searchResults array
    this.showClearSearchButton = true;
    if (this.selectedChilds.length === 0) {
      this.showNoStudentMsg = true;
    } else {
      this.showNoStudentMsg = false;
    }
  }

  onDownload(child: IChild) {
    this.createAndWriteCSV(child);
  }

  convertObjectToCSV(object: IChild): string {
    const keys = Object.keys(object);
    const header = keys.join(',');
    //@ts-ignore
    const values = keys.map((key) => object[key]);
    const row = values.map((value) => `"${value}"`).join(',');

    return `${header}\n${row}`;
  }

  createAndWriteCSV(child: IChild) {
    const fileName = child.childName + 'data.csv';
    const csvString = this.convertObjectToCSV(child);

    const dataDirectory = this.file.dataDirectory;

    this.file
      .writeFile(dataDirectory, fileName, csvString, { replace: true })
      .then(() => {
        const filePath = dataDirectory + fileName;
        const message =
          'Child ' + child.childName + ' CSV file downloaded successfully.';

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
}
