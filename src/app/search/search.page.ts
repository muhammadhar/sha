import { Component, OnInit } from '@angular/core';
import {
  FileTransfer,
  FileTransferObject,
} from '@awesome-cordova-plugins/file-transfer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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

  constructor(
    private file: File,
    private androidPermissions: AndroidPermissions,
    private fileTransfer: FileTransfer,
    private filePath: FilePath,
    private fileOpener: FileOpener
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
  }

  clearSearch() {
    this.searchQuery = '';
    this.selectedChilds = [];
  }
  ngOnInit() {
    //@ts-ignore
    const storedSchools = JSON.parse(localStorage.getItem('schools'));
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
  }

  onDownload(child: IChild) {
    this.createAndWriteCSV(child);
  }

  //   let ws = XLSX.utils.json_to_sheet([child]);
  //   let wb = {Sheets: {'data': ws}, SheetNames : ['data']};
  //   let buffer = XLSX.write(wb, {bookType : 'xlsx', type: 'array'});
  //   this.saveFileToPhone(buffer, child);
  // }

  // saveFileToPhone(buffer: any, child: any) {
  //   const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  //   const fileExtension = '.xlsx';
  //   const fileName = child.childName + Date.now().toString() + fileExtension;
  //   const data: Blob = new Blob([buffer], { type: fileType });

  //   console.log('File Path:', this.file.externalRootDirectory);
  //   console.log('File Name:', fileName);
  //   console.log('File Data:', data);

  //   // this.file.writeFile(this.file.externalRootDirectory, fileName, data, { replace: true })
  //   //   .then(() => {
  //   //     console.log('File saved successfully');
  //   //   })
  //   //   .catch((error) => {
  //   //     console.error('Error saving file:', error);
  //   //   });

  convertObjectToCSV(object: IChild): string {
    const keys = Object.keys(object);
    const header = keys.join(',');
    //@ts-ignore
    const values = keys.map((key) => object[key]);
    const row = values.map((value) => `"${value}"`).join(',');

    return `${header}\n${row}`;
  }

  createAndWriteCSV(child: IChild) {
    const fileName = child.childName + 'data.csv' + Date.now().toString();

    const csvString = this.convertObjectToCSV(child);

    const dataDirectory = this.file.externalDataDirectory;

    this.file
      .writeFile(dataDirectory, fileName, csvString, { replace: true })
      .then(() => {
        alert(
          'child ' +
            child.childName +
            ' csv file downloaded successfully to: ' +
            dataDirectory +
            fileName
        );

        // Open the CSV file
        this.fileOpener
          .open(dataDirectory + fileName, 'text/csv')
          .then(() => {
            console.log('CSV file opened successfully.');
          })
          .catch((error) => {
            console.error('Error opening CSV file:', error);
          });
      })
      .catch((error) => {
        console.error('Error creating and writing CSV file:', error);
      });
  }
}
