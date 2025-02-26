import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './layout/landing-page/landing-page.component';
import { AddCandidatesComponent } from './features/candidates/add-candidates/add-candidates.component';

const routes: Routes = [

  // { path: '', redirectTo: 'landing', pathMatch: 'full' }, // Default route to Landing Page
  { path: 'landing', component: LandingPageComponent },
  { path: 'candidate', component: AddCandidatesComponent },
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
