import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './layout/landing-page/landing-page.component';
 
const routes: Routes = [

   { path: 'landing', component: LandingPageComponent },
   
   {
    path: 'candidate',
    loadChildren: () => import('./features/candidates/candidates.module').then((m) => m.CandidatesModule),
   },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
