import { Component, OnInit } from '@angular/core';
import { ToastService } from '../services/ToastService.service';

@Component({
  selector: 'app-addchild',
  templateUrl: './addchild.page.html',
  styleUrls: ['./addchild.page.scss'],
})
export class AddChildPage implements OnInit {
  constructor(private toastService: ToastService) {}
  child: any = {};
  selectOptions: string[] = [];

  onSubmit() {
    //@ts-ignore
    const tempArray = JSON.parse(localStorage.getItem('childs')) || [];
    console.log(tempArray);
    tempArray.push(this.child);
    console.log(tempArray);
    localStorage.setItem('childs', JSON.stringify(tempArray));
    console.log(this.child);
    this.child = {};
    this.toastService.create(
      'child added successfully',
      'success',
      false,
      1000
    );
  }

  ngOnInit() {
    //@ts-ignore
    const schools = JSON.parse(localStorage.getItem('schools')) || [
      { name: 'school data is not available' },
    ];
    this.selectOptions = schools.map((school: any) => school.name);
  }
}
