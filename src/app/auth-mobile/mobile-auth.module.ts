import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobileAuthRoutingModule } from './mobile-auth-routing.module';
 import { MobileLoginComponent } from './mobile-login/mobile-login.component';
import { MobileCreateAccountComponent } from './mobile-create-account/mobile-create-account.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    MobileAuthRoutingModule,
    SharedModule
  ]
})
export class MobileAuthModule { }
