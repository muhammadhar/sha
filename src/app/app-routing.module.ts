import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'members/dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardPageModule),
  },
  {
    path: 'search',
    loadChildren: () =>
      import('./search/search.module').then((m) => m.SearchPageModule),
  },
  {
    path: 'add_child',
    loadChildren: () =>
      import('./addchild/addchild.module').then((m) => m.AddChildPageModule),
  },
  {
    path: 'add_school',
    loadChildren: () =>
      import('./addschool/addschool.module').then((m) => m.AddschoolPageModule),
  },
  {
    path: 'forgot_password',
    loadChildren: () =>
      import('./forget/forget.module').then((m) => m.ForgetPageModule),
  },
  {
    path: 'reset_password',
    loadChildren: () =>
      import('./reset/reset.module').then((m) => m.ResetPageModule),
  },
  {
    path: 'current_visit/:childId',
    loadChildren: () =>
      import('./currentvisit/currentvisit.module').then(
        (m) => m.CurrentvisitPageModule
      ),
  },
  {
    path: 'past_visits/:childId',
    loadChildren: () =>
      import('./pastvisit/pastvisit.module').then((m) => m.PastvisitPageModule),
  },
  {
    path: 'advance_search',
    loadChildren: () =>
      import('./advancesearch/advancesearch.module').then(
        (m) => m.AdvancesearchPageModule
      ),
  },   {
    path: 'relogin',
    loadChildren: () => import('./relogin/relogin.module').then( m => m.ReloginPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
