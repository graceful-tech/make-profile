import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidatesRoutingModule } from './candidates-routing.module';
import { AddCandidatesComponent } from './add-candidates/add-candidates.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateCandidatesComponent } from './create-candidates/create-candidates.component';
import { CandidatesDetailsComponent } from './candidates-details/candidates-details.component';
import { ViewTemplatesComponent } from './Templates/view-templates/view-templates.component';
import { ChooseTemplateComponent } from './Templates/choose-template/choose-template.component';
import { PaymentOptionComponent } from './payments/payment-option/payment-option.component';
import { PaymentDetailsComponent } from './payments/payment-details/payment-details.component';
  

@NgModule({
  declarations: [
    AddCandidatesComponent,
    CreateCandidatesComponent,
    CandidatesDetailsComponent,
    ViewTemplatesComponent,
    ChooseTemplateComponent,
    PaymentOptionComponent,
    PaymentDetailsComponent
    
  ],
  imports: [
    CommonModule,
    CandidatesRoutingModule,
    SharedModule,
  ],
})
export class CandidatesModule { }
