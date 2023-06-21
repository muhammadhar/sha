import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddpatientPage } from './addpatient.page';

const routes: Routes = [
  {
    path: '',
    component: AddpatientPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddpatientPageRoutingModule {}
