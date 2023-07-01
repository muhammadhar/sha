import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PastvisitPage } from './pastvisit.page';

const routes: Routes = [
  {
    path: '',
    component: PastvisitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PastvisitPageRoutingModule {}
