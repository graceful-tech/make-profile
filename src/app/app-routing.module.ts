import { createComponent, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageMobileComponent } from './layout/landing-page-mobile/landing-page-mobile.component';
import { LandingPageComponent } from './layout/landing-page/landing-page.component';
import { CandidatesDetailsComponent } from './features/candidates/candidates-details/candidates-details.component';
import { LoginComponent } from './auth/login/login.component';
import { CreateAccountComponent } from './auth/create-account/create-account.component';
import { MobileLoginComponent } from './auth-mobile/mobile-login/mobile-login.component';
import { MobileCreateAccountComponent } from './auth-mobile/mobile-create-account/mobile-create-account.component';
import { ViewAccountComponent } from './features/candidates/view-account/view-account.component';
import { EditUserComponent } from './features/candidates/edit-user/edit-user.component';
import { MobViewAccountComponent } from './features/mobile-view-candidates/mob-view-account/mob-view-account.component';

const routes: Routes = [

  { path: '', component: LandingPageComponent },

  { path: 'mob-landing', component: LandingPageMobileComponent },

  { path: 'login', component: LoginComponent },

  { path: 'viewUser', component: ViewAccountComponent },

  { path: 'create-account', component: CreateAccountComponent },

  { path: 'mob-create', component: MobileCreateAccountComponent },

  { path: 'mob-login', component: MobileLoginComponent },

  {path:'editUser', component: EditUserComponent},

  { path: 'view-mob-user', component: MobViewAccountComponent },
  
 
 


  {
    path: 'candidate',
    loadChildren: () => import('./features/candidates/candidates.module').then((m) => m.CandidatesModule),
  },
  
  {
    path: 'mob-candidate',
    loadChildren: () => import('./features/mobile-view-candidates/mobile-view-candidates.module').then((m) => m.MobileViewCandidatesModule),
  },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
