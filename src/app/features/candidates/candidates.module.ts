import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidatesRoutingModule } from './candidates-routing.module';
import { AddCandidatesComponent } from './add-candidates/add-candidates.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateCandidatesComponent } from './create-candidates/create-candidates.component';
import { CandidatesDetailsComponent } from './candidates-details/candidates-details.component';
 

@NgModule({
  declarations: [
    AddCandidatesComponent,
    CreateCandidatesComponent,
    CandidatesDetailsComponent
  ],
  imports: [
    CommonModule,
    CandidatesRoutingModule,
    SharedModule,
  ],
})
export class CandidatesModule { }
