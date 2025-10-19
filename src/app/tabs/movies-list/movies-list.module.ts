import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoviesListPageRoutingModule } from './movies-list-routing.module';

import { MoviesListPage } from './movies-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoviesListPageRoutingModule
  ],
  declarations: [MoviesListPage]
})
export class MoviesListPageModule {}
