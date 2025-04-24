import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageMobileComponent } from './layout/landing-page-mobile/landing-page-mobile.component';
import { LandingPageComponent } from './layout/landing-page/landing-page.component';
import { CandidatesDetailsComponent } from './features/candidates/candidates-details/candidates-details.component';
 
const routes: Routes = [

   { path: 'landing', component: LandingPageComponent },
   { path: 'mobile', component: LandingPageMobileComponent},

     
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
