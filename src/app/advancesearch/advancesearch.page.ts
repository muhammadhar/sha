import { File } from '@awesome-cordova-plugins/file/ngx';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../services/localstorage.service';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing';
import { Platform } from '@ionic/angular';

export interface Child {
  id: string;
  childName: string;
  fatherName: string;
  motherName: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  whatsappNumber: number;
  selectedSchool: string;
  earWax: string;
  vision: string;
  palmarPallor: string;
  hygiene: string;
  carries: string;
  scaling: string;
  gaps: string;
  chickenpox: string;
  hepatitisA: string;
  mmr: string;
  meningitis: string;
  typhoid: string;
  epiStatus: string;
  visits: IVisit[];
  lastFiveVisits: IVisit[];
}

interface School {
  name: string;
  area: string;
  contact: string;
}

// interface DetailChild {
//   childName: string;
//   earWax: string;
//   vision: string;
//   palmarPallor: string;
//   hygiene: string;
//   carries: string;
//   scaling: string;
//   gaps: string;
//   chickenpox: string;
//   hepatitisA: string;
//   mmr: string;
//   meningitis: string;
//   typhoid: string;
//   epiStatus: string;
//   visits: IVisit[];
//   lastFiveVisits: IVisit[];
// }
interface IVisit {
  date: string;
  weight: string;
  height: string;
  bmi: string;
  growthVelocity: string;
  muac: string;
}
@Component({
  selector: 'app-advancesearch',
  templateUrl: './advancesearch.page.html',
  styleUrls: ['./advancesearch.page.scss'],
})
export class AdvancesearchPage implements OnInit {
  children: Child[] = [];
  schools: School[] = [];
  noChildFoundCard = false;

  filteredChildren: Child[] = [];

  searchCriteria = {
    childName: '',
    school: '',
    branch: '',
    fromDate: '',
    toDate: '',
    chickenpoxMissed: '',
    hepatitisAMissed: '',
    mmrMissed: '',
    mmrGiven: '',
    meningitisMissed: '',
    typhoidMissed: '',
    epiStatusMissed: '',
  };
  constructor(
    private _storage: LocalStorageService,
    private file: File,
    private plt: Platform
  ) {}
  ngOnInit() {
    // Retrieve child and detailChild objects from localStorage
    const storedChildren = this._storage.getItem('childs') || [];
    this.schools = this._storage.getItem('schools') || [];
  }
  searchChildren() {
    // Check if more than one field in searchCriteria has a value
    const multipleFieldsFilled =
      Object.values(this.searchCriteria).filter((value) => value !== '')
        .length > 1;
    if (multipleFieldsFilled) {
      this.searchChildrenMultiValue();
    } else {
      this.searchChildrenSingleValue();
    }
  }
  searchChildrenMultiValue() {
    const mergedChildren = this._storage.getItem('childs') || [];

    const searchCriteriaKeys = Object.keys(this.searchCriteria).filter(
      (key) => key !== 'branch' && this.searchCriteria[key] !== ''
    );

    this.filteredChildren = mergedChildren.filter((child) => {
      let matchedCount = 0;

      for (let key of searchCriteriaKeys) {
        if (
          key === 'childName' &&
          child.childName.toLowerCase() ===
            this.searchCriteria[key].toLowerCase()
        ) {
          matchedCount++;
        }

        if (
          key === 'school' &&
          child.selectedSchool === this.searchCriteria[key]
        ) {
          matchedCount++;
        }

        if (key === 'fromDate' || key === 'toDate') {
          const fromDate = new Date(this.searchCriteria.fromDate);
          const toDate = new Date(this.searchCriteria.toDate);
          const childDob = new Date(child.dateOfBirth);
          console.log('inside top');
          if (key === 'toDate' && childDob <= toDate) {
            // Case 1: User provided only fromDate, return children from fromDate to any date
            matchedCount++;
          } else if (
            key === 'fromDate' &&
            this.searchCriteria['toDate'] !== ''
          ) {
            if (childDob >= fromDate && childDob <= toDate) {
              matchedCount++;
            }
          }
        } else if (key === 'fromDate' && this.searchCriteria['toDate'] === '') {
          const fromDate = new Date(this.searchCriteria.fromDate);
          const currentDate = new Date();
          const childDob = new Date(child.dateOfBirth);

          if (childDob >= fromDate && childDob <= currentDate) {
            // Case 2: User provided fromDate only, return children from fromDate to today's date
            matchedCount++;
          }
        }

        if (key === 'chickenpoxMissed' && child.chickenpox === 'Pending') {
          matchedCount++;
        }

        if (key === 'hepatitisAMissed' && child.hepatitisA === 'Pending') {
          matchedCount++;
        }

        if (key === 'mmrMissed' && child.mmr === 'Pending') {
          matchedCount++;
        }

        if (key === 'mmrGiven' && child.mmr === 'Given') {
          matchedCount++;
        }

        if (key === 'meningitisMissed' && child.meningitis === 'Pending') {
          matchedCount++;
        }

        if (key === 'typhoidMissed' && child.typhoid === 'Pending') {
          matchedCount++;
        }

        if (key === 'epiStatusMissed' && child.epiStatus === 'Missed') {
          matchedCount++;
        }
      }

      return matchedCount === searchCriteriaKeys.length;
    });

    console.log('after multi filtering:', this.filteredChildren);

    if (this.searchCriteria.branch !== '') {
      const filteredSchools = this.schools.filter(
        (school) => this.searchCriteria.branch === school.area
      );

      this.filteredChildren = this.filteredChildren.filter((child) => {
        return filteredSchools.some(
          (school) => school.name === child.selectedSchool
        );
      });
    }
    this.noChildFoundCard = this.filteredChildren.length === 0;
    this.emptySearchCriteria();
  }

  searchChildrenSingleValue() {
    // Merge child and detailChild objects based on child's ID
    const mergedChildren = this._storage.getItem('childs') || [];
    console.log('merged children count', mergedChildren.length);
    // Perform the search based on search criteria
    this.filteredChildren = mergedChildren.filter((child) => {
      if (
        this.searchCriteria.childName &&
        child.childName.toLowerCase() ===
          this.searchCriteria.childName.toLowerCase()
      ) {
        return true;
      }

      if (
        this.searchCriteria.school &&
        child.selectedSchool === this.searchCriteria.school
      ) {
        return true;
      }

      if (
        this.searchCriteria.fromDate !== '' ||
        this.searchCriteria.toDate !== ''
      ) {
        const toDate = new Date(this.searchCriteria.toDate);
        const childDob = new Date(child.dateOfBirth);
        if (
          this.searchCriteria.toDate !== '' &&
          this.searchCriteria.fromDate === ''
        ) {
          if (childDob <= toDate) {
            return true;
          }
        }
      }
      if (
        this.searchCriteria.fromDate !== '' &&
        this.searchCriteria.toDate !== ''
      ) {
        const fromDate = new Date(this.searchCriteria.fromDate);
        const toDate = new Date(this.searchCriteria.toDate);
        const childDob = new Date(child.dateOfBirth);
        if (childDob >= fromDate && childDob <= toDate) {
          return true;
        }
      }

      if (
        this.searchCriteria.fromDate !== '' &&
        this.searchCriteria.toDate === ''
      ) {
        const fromDate = new Date(this.searchCriteria.fromDate);
        console.log('from date');
        const childDob = new Date(child.dateOfBirth);

        if (childDob >= fromDate) {
          return true;
        }
      }

      if (
        this.searchCriteria.chickenpoxMissed &&
        child.chickenpox === 'Pending'
      ) {
        return true;
      }

      if (
        this.searchCriteria.hepatitisAMissed &&
        child.hepatitisA === 'Pending'
      ) {
        return true;
      }

      if (this.searchCriteria.mmrMissed && child.mmr === 'Pending') {
        return true;
      }
      if (this.searchCriteria.mmrGiven && child.mmr === 'Given') {
        return true;
      }

      if (
        this.searchCriteria.meningitisMissed &&
        child.meningitis === 'Pending'
      ) {
        return true;
      }

      if (this.searchCriteria.typhoidMissed && child.typhoid === 'Pending') {
        return true;
      }

      if (this.searchCriteria.epiStatusMissed && child.epiStatus === 'Missed') {
        return true;
      }

      return false;
    });

    if (this.searchCriteria.branch.length > 0) {
      const filteredSchools = this.schools.filter(
        (school) => this.searchCriteria.branch === school.area
      );
      for (let school of filteredSchools) {
        for (let child of mergedChildren) {
          if (school.name === child.selectedSchool) {
            console.log('filtered child', child);
            this.filteredChildren.push(child);
          }
        }
      }
    }
    this.noChildFoundCard = this.filteredChildren.length === 0;
    this.emptySearchCriteria();
  }

  emptySearchCriteria() {
    this.searchCriteria = {
      childName: '',
      school: '',
      branch: '',
      fromDate: '',
      toDate: '',
      chickenpoxMissed: '',
      hepatitisAMissed: '',
      mmrMissed: '',
      mmrGiven: '',
      meningitisMissed: '',
      typhoidMissed: '',
      epiStatusMissed: '',
    };
  }

  clearSearch(): void {
    this.filteredChildren = [];
  }

  // hasSearchCriteria(): boolean {
  //   const { childName, school, branch, fromDate, toDate, chickenpoxMissed, hepatitisAMissed, mmrMissed,mmrGiven, meningitisMissed, typhoidMissed, epiStatusMissed } = this.searchCriteria;

  //   return (
  //     childName !== '' ||
  //     school !== '' ||
  //     branch !== '' ||
  //     fromDate !== '' ||
  //     toDate !== '' ||
  //     chickenpoxMissed ||
  //     hepatitisAMissed ||
  //     mmrMissed ||
  //     mmrGiven ||
  //     meningitisMissed ||
  //     typhoidMissed ||
  //     epiStatusMissed
  //   );
  // }

  createAndWriteCSV() {
    const fileName = Date.now().toString() + 'data.csv';
    const csvString = this.convertArrayToCSV(this.filteredChildren);

    if (this.plt.is('cordova')) {
      // Save the CSV file on the device using @awesome-cordova-plugins/file
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
    } else {
      // For non-Cordova platforms (e.g., web), trigger the download
      this.downloadCSV(csvString, fileName);
    }
  }

  // Function to trigger the CSV download for non-Cordova platforms (e.g., web)
  private downloadCSV(csvString: string, fileName: string) {
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();

    // Optionally, you can revoke the object URL after the download link is clicked.
    URL.revokeObjectURL(url);
  }

  convertArrayToCSV(objects: any[]): string {
    if (objects.length === 0) {
      return ''; // Return an empty string if the array is empty
    }

    const flattenObject = (obj) => {
      const flattened = {};

      const flatten = (currentObj, propName = '') => {
        for (let key in currentObj) {
          if (currentObj.hasOwnProperty(key)) {
            if (key === 'visits' || key === 'id') continue; // Ignore the 'visits' property
            if (key === 'earWax' && Array.isArray(currentObj[key])) {
              currentObj[key] = currentObj[key].join(',');
            }

            const newKey = propName ? `${propName}.${key}` : key;

            if (Array.isArray(currentObj[key])) {
              for (let i = 0; i < currentObj[key].length; i++) {
                flatten(currentObj[key][i], `${newKey}[${i + 1}]`); // Start index from 1
              }
            } else if (typeof currentObj[key] === 'object') {
              flatten(currentObj[key], newKey);
            } else {
              flattened[newKey] = currentObj[key];
            }
          }
        }
      };

      flatten(obj);

      return flattened;
    };

    const flattenedObjects = objects.map((object) => flattenObject(object));

    const keys = Object.keys(flattenedObjects[0]);
    const header = keys.join(',');

    const rows = flattenedObjects.map((object) => {
      const values = keys.map((key) => object[key]);
      return values.map((value) => `"${value}"`).join(', ');
    });

    return `${header}\n\n${rows.join('\n\n\n')}`;
  }
}
