import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddChildPage } from './addchild.page';

const routes: Routes = [
  {
    path: '',
    component: AddChildPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddChildPageRoutingModule {}
