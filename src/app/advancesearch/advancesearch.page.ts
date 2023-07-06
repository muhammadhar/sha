import { File } from '@awesome-cordova-plugins/file/ngx';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../services/localstorage.service';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing';

interface Child {
  id: string;
  childName: string;
  fatherName: string;
  motherName: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  whatsappNumber: number;
  selectedSchool: string;
}

interface School {
  name: string;
  branchName: string;
  landlineNumber: string;
  coordinationNumber: string;
  principalNumber: string;
}

interface DetailChild {
  childName: string;
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
  detailChildren: { [id: string]: DetailChild } = {};

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
  constructor(private _storage: LocalStorageService, private file : File) {}
  ngOnInit() {
    // Retrieve child and detailChild objects from localStorage
    const storedChildren = this._storage.getItem('childs');
    this.schools = this._storage.getItem('schools');

    if (storedChildren) {
      this.children = storedChildren;
      storedChildren.forEach(
        (child: Child) =>
          (this.detailChildren[child.id] = this._storage.getItem(child.id))
      );
    }
  }
  searchChildren() {
    // Check if more than one field in searchCriteria has a value
    const multipleFieldsFilled =
      Object.values(this.searchCriteria).filter((value) => value !== '')
        .length > 1;

    if (multipleFieldsFilled) {
      console.log(this.searchCriteria)
      this.searchChildrenMultiValue();
    } else {
      this.searchChildrenSingleValue();
    }
  }
  searchChildrenMultiValue() {
    // const mergedChildren = this.children.map((child) => {
    //   const detailChild = this.detailChildren[child.id];
    //   return { ...child, ...detailChild };
    // });

    // this.filteredChildren = mergedChildren.filter((child) => {
    //   return false;
    // });
    console.log('multivalues');
  }
  searchChildrenSingleValue() {
    // Merge child and detailChild objects based on child's ID
    const mergedChildren = this.children.map((child) => {
      const detailChild = this.detailChildren[child.id];
      return { ...child, ...detailChild };
    });

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

      if (this.searchCriteria.fromDate && this.searchCriteria.toDate) {
        const fromDate = new Date(this.searchCriteria.fromDate);
        const toDate = new Date(this.searchCriteria.toDate);
        const childDob = new Date(child.dateOfBirth);
        if (childDob >= fromDate && childDob <= toDate) {
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
    console.log(mergedChildren);
    if (this.searchCriteria.branch.length > 0) {
      const filteredSchools = this.schools.filter(
        (school) => this.searchCriteria.branch === school.branchName
      );
      console.log('filtered schools', filteredSchools);
      for (let school of filteredSchools) {
        for (let child of mergedChildren) {
          if (school.name === child.selectedSchool) {
            console.log('filtered child', child);
            this.filteredChildren.push(child);
          }
        }
      }
    }

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



  convertArrayToCSV(objects: any[]): string {
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
}
