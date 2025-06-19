import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobileAuthRoutingModule } from './mobile-auth-routing.module';
 import { MobileLoginComponent } from './mobile-login/mobile-login.component';
import { MobileCreateAccountComponent } from './mobile-create-account/mobile-create-account.component';
import { SharedModule } from '../shared/shared.module';
import { MobileForgotComponent } from './mobile-forgot/mobile-forgot.component';


@NgModule({
  declarations: [
    MobileCreateAccountComponent,
    MobileLoginComponent,
    MobileForgotComponent
  ],
  imports: [
    CommonModule,
    MobileAuthRoutingModule,
    SharedModule
  ]
})
export class MobileAuthModule { }
