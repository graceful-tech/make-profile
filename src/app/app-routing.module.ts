import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './layout/landing-page/landing-page.component';
import { AddCandidatesComponent } from './features/candidates/add-candidates/add-candidates.component';
import { LoginComponent } from './auth/login/login.component';
import { CreateAccountComponent } from './auth/create-account/create-account.component';

const routes: Routes = [

  { path: '', redirectTo: 'landing', pathMatch: 'full' }, // Default route to Landing Page
  { path: 'landing', component: LandingPageComponent },
  { path: 'candidate', component: AddCandidatesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create-account', component: CreateAccountComponent },

  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
