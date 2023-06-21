import { Component, OnInit } from '@angular/core';
import { ToastService } from '../services/ToastService.service';

@Component({
  selector: 'app-addschool',
  templateUrl: './addschool.page.html',
  styleUrls: ['./addschool.page.scss'],
})
export class AddschoolPage implements OnInit {

  constructor(private toastService: ToastService) { }
  school: any = {}; 

  onSubmit() {
    //@ts-ignore
    const tempArray = JSON.parse(localStorage.getItem('schools')) || [];
    console.log(tempArray)
    tempArray.push(this.school);
    console.log(tempArray);
    localStorage.setItem('schools', JSON.stringify(tempArray));
    console.log(this.school);
    this.school = {};
    this.toastService.create('school added successfully','success', false, 1000)
  }
  ngOnInit() {
  }

}
