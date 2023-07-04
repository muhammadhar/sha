import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../services/localstorage.service';
import { IChildVisit } from './pastvisit';
@Component({
  selector: 'app-pastvisit',
  templateUrl: './pastvisit.page.html',
  styleUrls: ['./pastvisit.page.scss'],
})
export class PastvisitPage implements OnInit {
  childVisit : IChildVisit;
  child! : IChildVisit;
  constructor(
    private route: ActivatedRoute,
    private _storage: LocalStorageService
  ) {}
  childId = '';
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.childId = params['childId']; // Retrieve the child ID from the route parameters
      this.childVisit = this._storage.getItem(this.childId);
      this.child = this.childVisit;
      console.log(this.childVisit);
      // Perform any additional logic or data retrieval based on the child ID
    });
  }
}
