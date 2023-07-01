import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-pastvisit',
  templateUrl: './pastvisit.page.html',
  styleUrls: ['./pastvisit.page.scss'],
})
export class PastvisitPage implements OnInit {
  constructor(private route: ActivatedRoute) {}
  childId = '';
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.childId = params['childId']; // Retrieve the child ID from the route parameters
      console.log('Child ID:', this.childId);
      // Perform any additional logic or data retrieval based on the child ID
    });
  }
}
