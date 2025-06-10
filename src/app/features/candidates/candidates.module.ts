import { NgModule } from '@angular/core';
 import { CandidatesRoutingModule } from './candidates-routing.module';
import { AddCandidatesComponent } from './add-candidates/add-candidates.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateCandidatesComponent } from './create-candidates/create-candidates.component';
import { CandidatesDetailsComponent } from './candidates-details/candidates-details.component';
import { ViewTemplatesComponent } from './Templates/view-templates/view-templates.component';
import { ChooseTemplateComponent } from './Templates/choose-template/choose-template.component';
import { PaymentOptionComponent } from './payments/payment-option/payment-option.component';
import { PaymentDetailsComponent } from './payments/payment-details/payment-details.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ViewAccountComponent } from '../users/view-account/view-account.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CommonModule } from '@angular/common';
import { ResumeDetailsComponent } from './resume-details/resume-details.component';
import { VerifyCandidatesComponent } from './verify-candidates/verify-candidates.component';
import { ViewHistoryCandidatesComponent } from './view-history-candidates/view-history-candidates.component';


@NgModule({
  declarations: [
    AddCandidatesComponent,
    CreateCandidatesComponent,
    CandidatesDetailsComponent,
    ViewTemplatesComponent,
    ChooseTemplateComponent,
    PaymentOptionComponent,
    PaymentDetailsComponent,
    ForgotPasswordComponent,
    VerifyCandidatesComponent,
    ResumeDetailsComponent,
    ViewHistoryCandidatesComponent
  ],
  imports: [
    CommonModule,
    CandidatesRoutingModule,
    SharedModule
  ],
})
export class CandidatesModule { }
