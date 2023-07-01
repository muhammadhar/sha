import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PastvisitPageRoutingModule } from './pastvisit-routing.module';

import { PastvisitPage } from './pastvisit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PastvisitPageRoutingModule
  ],
  declarations: [PastvisitPage]
})
export class PastvisitPageModule {}
