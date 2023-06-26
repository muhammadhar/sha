import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddChildPageRoutingModule } from './addchild-routing.module';

import { AddChildPage } from './addchild.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, AddChildPageRoutingModule],
  declarations: [AddChildPage],
})
export class AddChildPageModule {}
