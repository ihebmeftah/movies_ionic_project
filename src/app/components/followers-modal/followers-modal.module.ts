import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FollowersModalComponent } from './followers-modal.component';

@NgModule({
    declarations: [FollowersModalComponent],
    imports: [
        CommonModule,
        IonicModule
    ],
    exports: [FollowersModalComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FollowersModalModule { }
