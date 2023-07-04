import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvancesearchPage } from './advancesearch.page';

const routes: Routes = [
  {
    path: '',
    component: AdvancesearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvancesearchPageRoutingModule {}
