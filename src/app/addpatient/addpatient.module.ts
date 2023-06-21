import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddpatientPageRoutingModule } from './addpatient-routing.module';

import { AddpatientPage } from './addpatient.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddpatientPageRoutingModule
  ],
  declarations: [AddpatientPage]
})
export class AddpatientPageModule {}
