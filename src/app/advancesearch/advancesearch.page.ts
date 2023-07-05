import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../services/localstorage.service';

interface Child {
  id: string;
  childName: string;
  fatherName: string;
  motherName: string;
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
    chickenpoxMissed: false,
    hepatitisAMissed: false,
    mmrMissed: false,
    meningitisMissed: false,
    typhoidMissed: false,
    epiStatusMissed: false,
  };
  constructor(private _storage: LocalStorageService) {}
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
    // Merge child and detailChild objects based on child's ID
    const mergedChildren = this.children.map((child) => {
      const detailChild = this.detailChildren[child.id];
      return { ...child, ...detailChild };
    });

    // Perform the search based on search criteria
    this.filteredChildren = mergedChildren.filter((child) => {
      if (
        this.searchCriteria.childName &&
        !child.childName
          .toLowerCase()
          .includes(this.searchCriteria.childName.toLowerCase())
      ) {
        return false;
      }
      if (
        this.searchCriteria.school &&
        child.selectedSchool !== this.searchCriteria.school
      ) {
        return false;
      }
      // if (this.searchCriteria.branch && child.branchName !== this.searchCriteria.branch) {
      //   return false;
      // }
      if (this.searchCriteria.fromDate && this.searchCriteria.toDate) {
        const fromDate = new Date(this.searchCriteria.fromDate);
        const toDate = new Date(this.searchCriteria.toDate);
        const childDob = new Date(child.dateOfBirth);
        if (childDob < fromDate || childDob > toDate) {
          return false;
        }
      }
      if (
        this.searchCriteria.chickenpoxMissed &&
        child.chickenpox !== 'missed'
      ) {
        return false;
      }
      if (
        this.searchCriteria.hepatitisAMissed &&
        child.hepatitisA !== 'missed'
      ) {
        return false;
      }
      if (this.searchCriteria.mmrMissed && child.mmr !== 'missed') {
        return false;
      }
      if (
        this.searchCriteria.meningitisMissed &&
        child.meningitis !== 'missed'
      ) {
        return false;
      }
      if (this.searchCriteria.typhoidMissed && child.typhoid !== 'missed') {
        return false;
      }
      if (this.searchCriteria.epiStatusMissed && child.epiStatus !== 'missed') {
        return false;
      }

      return true;
    });

    this.emptySearchCriteria();
  }

  emptySearchCriteria() {
    this.searchCriteria = {
      childName: '',
      school: '',
      branch: '',
      fromDate: '',
      toDate: '',
      chickenpoxMissed: false,
      hepatitisAMissed: false,
      mmrMissed: false,
      meningitisMissed: false,
      typhoidMissed: false,
      epiStatusMissed: false,
    };
  }

  clearSearch(): void {
    this.filteredChildren = [];
  }
}
