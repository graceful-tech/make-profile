import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MobileCandidatesDetailsComponent } from './mobile-candidates-details/mobile-candidates-details.component';
import { MobileCreateCandidatesComponent } from './mobile-create-candidates/mobile-create-candidates.component';
import { MobileChosseTemplateComponent } from './mobile-chosse-template/mobile-chosse-template.component';
import { MobileEditCandidatesComponent } from './mobile-edit-candidates/mobile-edit-candidates.component';
import { MobilePaymentOptionComponent } from './mobile-payments/mobile-payment-option/mobile-payment-option.component';
import { MobileVerifyComponentComponent } from './mobile-verify-component/mobile-verify-component.component';
import { ResumeDetailsComponent } from '../candidates/resume-details/resume-details.component';
import { ViewMobileHistoryCandidatesComponent } from './view-mobile-history-candidates/view-mobile-history-candidates.component';
import { ResumeDetailsMobileComponent } from './resume-details-mobile/resume-details-mobile.component';
import { FinalVerifyComponent } from './final-verify/final-verify.component';
import { UseExistingTemplateComponent } from './use-existing-template/use-existing-template.component';
import { MobileCommonDetailsComponent } from 'src/app/shared/components/mobile-common-details/mobile-common-details.component';

const routes: Routes = [
  { path: '', component: MobileCandidatesDetailsComponent },

  { path: 'create-candidate', component: MobileCreateCandidatesComponent },

  { path: 'choose-Template', component: MobileChosseTemplateComponent },

  { path: 'edit-candidate', component: MobileEditCandidatesComponent },

  { path: 'mobile-payment', component: MobilePaymentOptionComponent },

  { path: 'verify-components', component: MobileVerifyComponentComponent },

  { path: 'resume-details', component: ResumeDetailsMobileComponent },

  { path: 'view-history', component: ViewMobileHistoryCandidatesComponent },

  { path: 'final-verify', component: FinalVerifyComponent },

  { path: 'Use-existing', component: UseExistingTemplateComponent },

  { path: 'enter-new-details', component: MobileCommonDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MobileViewCandidatesRoutingModule {}
