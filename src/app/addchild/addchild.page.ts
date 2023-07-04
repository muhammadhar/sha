import { Component, OnInit } from '@angular/core';
import { ToastService } from '../services/ToastService.service';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addchild',
  templateUrl: './addchild.page.html',
  styleUrls: ['./addchild.page.scss'],
})
export class AddChildPage implements OnInit {
  constructor(private toastService: ToastService, private router: Router) {}
  child: any = {};
  selectOptions: string[] = [];

  onSubmit() {
    //@ts-ignore
    const tempArray = JSON.parse(localStorage.getItem('childs')) || [];
    this.child.id = uuidv4();

    tempArray.push(this.child);

    localStorage.setItem('childs', JSON.stringify(tempArray));



    this.toastService.create(
      'child added successfully',
      'success',
      false,
      1000
    );
    this.router.navigate(['current_visit/'+ this.child.id]);
    this.child = {};
  }

  ngOnInit() {
    //@ts-ignore
    const schools = JSON.parse(localStorage.getItem('schools')) || [];
    this.selectOptions = schools.map((school: any) => school.name);
  }
}
