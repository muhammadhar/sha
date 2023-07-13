import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReloginPageRoutingModule } from './relogin-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { ReloginPage } from './relogin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ReloginPageRoutingModule
  ],
  declarations: [ReloginPage]
})
export class ReloginPageModule {}
