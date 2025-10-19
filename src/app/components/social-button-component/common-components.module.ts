import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SocialButtonsComponent } from './social-buttons.component';

@NgModule({
  declarations: [
    SocialButtonsComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    SocialButtonsComponent
  ]
})
export class CommonComponentsModule { }
