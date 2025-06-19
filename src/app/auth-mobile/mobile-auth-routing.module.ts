import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MobileLoginComponent } from './mobile-login/mobile-login.component';
import { MobileCreateAccountComponent } from './mobile-create-account/mobile-create-account.component';
import { MobileForgotComponent } from './mobile-forgot/mobile-forgot.component';

const routes: Routes = [
  { path: '', component: MobileLoginComponent },

  { path: 'mob-create', component: MobileCreateAccountComponent },

  { path: 'mob-forgot', component: MobileForgotComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileAuthRoutingModule { }
