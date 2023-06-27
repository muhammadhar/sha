import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoginRoute: boolean = false;
  public appPages = [
    { title: 'Dashboard', url: 'members/dashboard', icon: 'home' },
    { title: 'Search', url: '/search', icon: 'search' },
    { title: 'Add Child', url: '/add_child', icon: 'person' },
    { title: 'Add School', url: '/add_school', icon: 'school' },
    { title: 'Reset Password', url: '/reset_password', icon: 'lock-open' },
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.router.events.subscribe((val) => {
      this.isLoginRoute =
        this.router.url === '/login' ||
        this.router.url === '/forgot_password';
    });
  }
}
