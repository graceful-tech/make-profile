import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCandidatesComponent } from './add-candidates/add-candidates.component';
import { CreateCandidatesComponent } from './create-candidates/create-candidates.component';
import { CandidatesDetailsComponent } from './candidates-details/candidates-details.component';
import { ViewTemplatesComponent } from './Templates/view-templates/view-templates.component';
import { ResumeAnimationComponent } from './resume-animation/resume-animation.component';
import { RewardsSuccessMessageComponent } from 'src/app/shared/components/rewards-success-message/rewards-success-message.component';
import { CashbackRenewComponent } from 'src/app/shared/components/cashback-renew/cashback-renew.component';

const routes: Routes = [
  { path: '', component: CandidatesDetailsComponent },

  { path: 'create', component: CreateCandidatesComponent },

  { path: 'candidate', component: AddCandidatesComponent },

  { path: 'template', component: ViewTemplatesComponent },

  { path: 'animation', component: ResumeAnimationComponent },

  { path: 'reward-success', component: RewardsSuccessMessageComponent },

  { path: 'rewards', component: CashbackRenewComponent },

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidatesRoutingModule {}
