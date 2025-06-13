import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobileUsersRoutingModule } from './mobile-users-routing.module';
 import { MobViewAccountComponent } from './mob-view-account/mob-view-account.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditMobileUsersComponent } from './edit-mobile-users/edit-mobile-users.component';


@NgModule({
  declarations: [
    MobViewAccountComponent,
    EditMobileUsersComponent
    
  ],
  imports: [
    CommonModule,
    MobileUsersRoutingModule,
    SharedModule
  ]
})
export class MobileUsersModule { }
