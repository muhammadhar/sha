import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurrentvisitPage } from './currentvisit.page';

const routes: Routes = [
  {
    path: '',
    component: CurrentvisitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CurrentvisitPageRoutingModule {}
