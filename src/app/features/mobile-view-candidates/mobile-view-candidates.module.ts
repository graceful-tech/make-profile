import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobileViewCandidatesRoutingModule } from './mobile-view-candidates-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MobileCreateCandidatesComponent } from './mobile-create-candidates/mobile-create-candidates.component';
import { MobileCandidatesDetailsComponent } from './mobile-candidates-details/mobile-candidates-details.component';
import { MobileChosseTemplateComponent } from './mobile-chosse-template/mobile-chosse-template.component';
import { MobileEditCandidatesComponent } from './mobile-edit-candidates/mobile-edit-candidates.component';
import { MobilePaymentOptionComponent } from './mobile-payments/mobile-payment-option/mobile-payment-option.component';
import { MobilePaymentDetailsComponent } from './mobile-payments/mobile-payment-details/mobile-payment-details.component';
 import { MobileVerifyComponentComponent } from './mobile-verify-component/mobile-verify-component.component';
import { MobileResumeDetailsComponent } from './mobile-resume-details/mobile-resume-details.component';
import { ViewMobileHistoryCandidatesComponent } from './view-mobile-history-candidates/view-mobile-history-candidates.component';
import { ResumeDetailsMobileComponent } from './resume-details-mobile/resume-details-mobile.component';
import { FinalVerifyComponent } from './final-verify/final-verify.component';
import { NickNameMobileComponent } from './nick-name-mobile/nick-name-mobile.component';
  

@NgModule({
  declarations: [
    MobileCreateCandidatesComponent,
    MobileCandidatesDetailsComponent,
    MobileChosseTemplateComponent,
    MobileEditCandidatesComponent,
    MobilePaymentOptionComponent,
    MobilePaymentDetailsComponent,
    MobileVerifyComponentComponent,
    MobileResumeDetailsComponent,
    ViewMobileHistoryCandidatesComponent,
    ResumeDetailsMobileComponent,
    FinalVerifyComponent,
    NickNameMobileComponent
 
  ],
  imports: [
    CommonModule,
    MobileViewCandidatesRoutingModule,
    SharedModule,
  ]
})
export class MobileViewCandidatesModule { }
