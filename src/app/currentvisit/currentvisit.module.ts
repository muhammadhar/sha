import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CurrentvisitPageRoutingModule } from './currentvisit-routing.module';

import { CurrentvisitPage } from './currentvisit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CurrentvisitPageRoutingModule
  ],
  declarations: [CurrentvisitPage]
})
export class CurrentvisitPageModule {}
