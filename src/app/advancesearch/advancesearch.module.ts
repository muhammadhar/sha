import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdvancesearchPageRoutingModule } from './advancesearch-routing.module';

import { AdvancesearchPage } from './advancesearch.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdvancesearchPageRoutingModule
  ],
  declarations: [AdvancesearchPage]
})
export class AdvancesearchPageModule {}
