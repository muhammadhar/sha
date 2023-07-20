import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../services/localstorage.service';
import { IChildVisit, IVisit } from './pastvisit';
@Component({
  selector: 'app-pastvisit',
  templateUrl: './pastvisit.page.html',
  styleUrls: ['./pastvisit.page.scss'],
})
export class PastvisitPage implements OnInit {
  childVisit: IChildVisit;
  child!: IChildVisit;
  firstEntryDate: string;
  VisitsArray: any[];
  constructor(
    private route: ActivatedRoute,
    private _storage: LocalStorageService
  ) {}
  childId = '';
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.childId = params['childId']; // Retrieve the child ID from the route parameters
      this.childVisit = this._storage
        .getItem('childs')
        .find((child) => child.id === this.childId);
      this.child = this.childVisit;
      console.log(this.childVisit);
      // Perform any additional logic or data retrieval based on the child ID
    });
    let UpdatedVisitsArray = [];
    if (this.childVisit.lastFiveVisits.length > 1) {
      UpdatedVisitsArray = this.childVisit.lastFiveVisits.sort((a, b) => {
        //@ts-ignore
        const dateA = new Date(a.date);
        //@ts-ignore
        const dateB = new Date(b.date);
        //@ts-ignore
        return dateB - dateA;
      });
    } else {
      UpdatedVisitsArray = this.childVisit.lastFiveVisits;
    }
    this.VisitsArray = UpdatedVisitsArray;
    // .map((visit: IVisit, index) => {
    //   if (index === 0) {
    //     this.firstEntryDate = visit.date;
    //   }
    //   return [
    //     visit.date || '',
    //     visit.weight || '',
    //     visit.height || '',
    //     visit.bmi || '',
    //     visit.growthVelocity || '',
    //     visit.muac || '',
    //   ];
    // });
  }
}
