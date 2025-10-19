import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MoviesListPage } from './movies-list.page';

const routes: Routes = [
  {
    path: '',
    component: MoviesListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoviesListPageRoutingModule {}
