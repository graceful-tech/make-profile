import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './layout/landing-page/landing-page.component';
import { AddCandidatesComponent } from './features/candidates/add-candidates/add-candidates.component';
 import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [


  {
    path: 'account',
    loadChildren: () => import('./features/candidates/candidates.module').then((m) => m.CandidatesModule),
   
  },
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
