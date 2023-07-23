// import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
// import { Component, OnInit } from '@angular/core';
// import { File } from '@awesome-cordova-plugins/file/ngx'; // Import FileEntry instead of File
// import { LoadingController, Platform } from '@ionic/angular';
// import { LocalStorageService } from '../services/localstorage.service';

// @Component({
//   selector: 'app-import',
//   templateUrl: './import.page.html',
//   styleUrls: ['./import.page.scss'],
// })
// export class ImportPage implements OnInit {
//   fileSelected: boolean = false;
//   selectedFile: any = null; // Change the type to FileEntry

//   constructor(
//     private loadingController: LoadingController,
//     private _storage: LocalStorageService,
//     private platform: Platform, // Remove 'file' import as it's not needed anymore
//     private file: File,
//     private androidPermissions: AndroidPermissions
//   ) {}

//   ngOnInit() {}

//   onFileSelected(event: any) {
//     const fileInput = event.target as HTMLInputElement;
//     const file = fileInput.files?.[0];
//     // console.log(file);
//     if (file) {
//       this.fileSelected = true;
//       this.selectedFile = file;
//     } else {
//       this.fileSelected = false;
//       this.selectedFile = null;
//     }
//   }

//   async onSubmit() {
//     if (this.fileSelected && this.selectedFile) {
//       if (this.platform.is('cordova')) {
//         await this.readFileCordova(this.selectedFile);
//       } else {
//         await this.readFileWeb(this.selectedFile);
//       }

//       // Reset the input field
//       const fileInput = document.getElementById(
//         'fileInput'
//       ) as HTMLInputElement;
//       if (fileInput) {
//         fileInput.value = ''; // Clear the selected file
//       }

//       this.fileSelected = false; // Reset the fileSelected flag
//       this.selectedFile = null; // Clear the selected file object
//     } else {
//       console.warn('No file selected. Form not submitted.');
//     }
//   }

//   private async readFileCordova(file: File) {
//     // const loading = await this.showLoading();

//     try {
//       console.log('in cordova file ', file);
//       const content = await this.readFileContent(file);
//       const dataObject = JSON.parse(content);

//       this.checkAndStoreData(dataObject);

//       // loading.dismiss();
//     } catch (error) {
//       console.error('Error reading or parsing the file:', error);
//       // loading.dismiss();
//     }
//   }

//   private async readFileWeb(file: File) {
//     // const loading = await this.showLoading();

//     try {
//       const content = await this.readFileContentWeb(file);
//       const dataObject = JSON.parse(content);

//       this.checkAndStoreData(dataObject);

//       // loading.dismiss();
//     } catch (error) {
//       console.error('Error reading or parsing the file:', error);
//       // loading.dismiss();
//     }
//   }

//   private async readFileContent(file: any): Promise<string> {
//     return new Promise<string>((resolve, reject) => {
//       this.requestReadPermission();
//       console.log('in read file content ', file);
//       const reader = new FileReader();
//       console.log('reader object', reader);
//       reader.onload = (event) => {
//         console.log('File read successful:', file);
//         console.log('Event target result:', event.target?.result);
//         const content = event.target?.result as string;
//         resolve(content);
//       };
//       reader.onerror = (event) => {
//         console.log('File read error:', event.target?.error);
//         reject(new Error('Error reading the file.'));
//       };

//       reader.readAsText(file);
//     }).catch((error) => {
//       console.error('Promise rejection:', error);
//       throw error;
//     });
//   }

//   private readFileContentWeb(file: any): Promise<string> {
//     return new Promise<string>((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => {
//         if (reader.result) {
//           resolve(reader.result as string);
//         } else {
//           reject('Error reading file content.');
//         }
//       };

//       reader.onerror = (error) => {
//         reject(error);
//       };

//       reader.readAsText(file);
//     });
//   }

//   // private async showLoading() {
//   //   const loading = await this.loadingController.create({
//   //     message: 'Processing file...',
//   //   });
//   //   await loading.present();
//   //   return loading;
//   // }

//   private checkAndStoreData(dataObject: any) {
//     // Check if schools and childs exist in localStorage
//     const schoolsData = localStorage.getItem('schools');
//     const childsData = localStorage.getItem('childs');

//     if (!schoolsData) {
//       // If schools data does not exist in localStorage, store the imported data directly
//       this._storage.setItem('schools', dataObject.schools);
//     } else {
//       // Get the existing schools data from localStorage
//       const existingSchools = JSON.parse(schoolsData || '[]');

//       // Merge schools with existing data in localStorage
//       dataObject.schools.forEach((school: any) => {
//         const existingSchool = existingSchools.find(
//           (item: any) => item.name === school.name
//         );
//         if (!existingSchool) {
//           existingSchools.push(school);
//         }
//       });

//       console.log('Merged Schools:', existingSchools);

//       // Save the merged schools data back to localStorage
//       this._storage.setItem('schools', existingSchools);
//     }

//     if (!childsData) {
//       // If childs data does not exist in localStorage, store the imported data directly
//       this._storage.setItem('childs', dataObject.childs);
//     } else {
//       // Get the existing childs data from localStorage
//       const existingChilds = JSON.parse(childsData || '[]');

//       // Merge childs with existing data in localStorage
//       dataObject.childs.forEach((child: any) => {
//         const existingChild = existingChilds.find(
//           (item: any) => item.id === child.id
//         );
//         if (!existingChild) {
//           existingChilds.push(child);
//         }
//       });

//       console.log('Merged Childs:', existingChilds);

//       // Save the merged childs data back to localStorage
//       this._storage.setItem('childs', existingChilds);
//     }
//   }

//   async requestReadPermission() {
//     try {
//       const permission = await this.androidPermissions.requestPermission(
//         this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
//       );

//       if (permission.hasPermission) {
//         console.log('Read permission granted.');
//         // Proceed with reading the file or any other operation requiring read permission.
//       } else {
//         console.log('Read permission denied.');
//         // Handle the case when the user denies read permission.
//       }
//     } catch (error) {
//       console.error('Error requesting read permission:', error);
//       // Handle any errors that occur while requesting the permission.
//     }
//   }

//   async uploadAndParseFile() {
//     const fileInput = document.getElementById('fileInput') as HTMLInputElement;
//     const selectedFile = fileInput.files[0]; // Get the selected file object

//     if (!selectedFile) {
//       alert('Please select a file.');
//       return;
//     }

//     // Check if the file type is JSON
//     if (selectedFile.type !== 'application/json') {
//       alert('Please select a JSON file.');
//       return;
//     }

//     try {
//       // Create a new FormData object and append the selected file to it
//       const formData = new FormData();
//       formData.append('file', selectedFile);

//       // Make a POST request to your server with the FormData
//       const response = await fetch('/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       // Parse the JSON response from the server if needed
//       const jsonData = await response.json();
//       // Do something with the parsed JSON data
//       console.log(jsonData);
//     } catch (error) {
//       alert('Error uploading and parsing JSON file: ' + error.message);
//     }
//   }

// }

// <ion-header [translucent]="true">
//   <ion-toolbar color="primary">
//     <ion-buttons slot="start">
//       <ion-back-button defaultHref="/members/dashboard"></ion-back-button>
//     </ion-buttons>
//     <ion-title>Import Data</ion-title>
//     <ion-buttons slot="end">
//       <ion-menu-button></ion-menu-button>
//     </ion-buttons>
//   </ion-toolbar>
// </ion-header>

// <ion-content [fullscreen]="true">
//   <ion-card>
//     <h3 style="text-align: center">Import JsonData.</h3>
//     <ion-grid>
//       <ion-row>
//         <ion-col>
//             <ion-input
//               type="file"
//               id="fileInput"
//               (change)="onFileChange($event)" accept=".json"
//             ></ion-input>
//             <ion-button (click)="onSubmit()" [disabled]="!fileSelected"
//               >Import</ion-button
//             >
//         </ion-col>
//       </ion-row>
//     </ion-grid>
//   </ion-card>
// </ion-content>
