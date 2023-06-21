import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddschoolPage } from './addschool.page';

const routes: Routes = [
  {
    path: '',
    component: AddschoolPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddschoolPageRoutingModule {}
