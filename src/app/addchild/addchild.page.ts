import { Component, OnInit } from '@angular/core';
import { ToastService } from '../services/ToastService.service';
import { v4 as uuidv4 } from 'uuid';

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
    this.child.id = uuidv4();

    tempArray.push(this.child);

    localStorage.setItem('childs', JSON.stringify(tempArray));

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
    const schools = JSON.parse(localStorage.getItem('schools')) || [];
    this.selectOptions = schools.map((school: any) => school.name);
  }
}
