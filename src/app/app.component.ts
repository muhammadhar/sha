import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Dashboard', url: '/', icon: 'home' },
    { title: 'Search', url: '/search', icon: 'search' },
    { title: 'Add Child', url: '/addpatient', icon: 'person' },
    { title: 'Add School', url: '/addschool', icon: 'school' },
  ];
  constructor() {}
}
