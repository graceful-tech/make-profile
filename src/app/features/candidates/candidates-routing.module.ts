import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCandidatesComponent } from './add-candidates/add-candidates.component';
import { CreateCandidatesComponent } from './create-candidates/create-candidates.component';
import { CandidatesDetailsComponent } from './candidates-details/candidates-details.component';
import { ViewTemplatesComponent } from './Templates/view-templates/view-templates.component';
import { RewardsSuccessMessageComponent } from 'src/app/shared/components/rewards-success-message/rewards-success-message.component';
import { CashbackRenewComponent } from 'src/app/shared/components/cashback-renew/cashback-renew.component';
import { ResumeEditorComponent } from 'src/app/shared/components/resume-editor/resume-editor.component';
import { ViewAccountComponent } from '../users/view-account/view-account.component';
import { EditUserComponent } from '../users/edit-user/edit-user.component';
import { CandidateCommonDetailsComponent } from 'src/app/shared/components/candidate-common-details/candidate-common-details.component';
import { AnalyseWithAiComponent } from 'src/app/shared/components/analyse-with-ai/analyse-with-ai.component';
import { NewDetailsComponent } from 'src/app/shared/components/new-details/new-details.component';
import { VerifyCandidatesComponent } from './verify-candidates/verify-candidates.component';
import { ResumeCreatingComponent } from './resume-creating/resume-creating.component';

const routes: Routes = [
  { path: '', component: CandidatesDetailsComponent },

  { path: 'create', component: CreateCandidatesComponent },

  { path: 'candidate', component: AddCandidatesComponent },

  { path: 'template', component: ViewTemplatesComponent },

  { path: 'reward-success', component: RewardsSuccessMessageComponent },

  { path: 'rewards', component: CashbackRenewComponent },

  { path: 'reorderd', component: ResumeEditorComponent },

  { path: 'view-account', component: ViewAccountComponent },

  { path: 'view-account/edit-user', component: EditUserComponent },

  { path: 'new-details', component: NewDetailsComponent },

  { path: 'analyse-ai', component: AnalyseWithAiComponent },

  { path: 'new-details-with-ai', component: CandidateCommonDetailsComponent },

  { path: 'verify-details', component: VerifyCandidatesComponent },

  { path: 'generate-resume', component: ResumeCreatingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidatesRoutingModule {}
