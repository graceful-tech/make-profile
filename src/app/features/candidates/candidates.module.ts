import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidatesRoutingModule } from './candidates-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AddCandidatesComponent } from './add-candidates/add-candidates.component';





@NgModule({
  declarations: [
   
  ],
  imports: [
    CommonModule,
    CandidatesRoutingModule,
    SharedModule,

  ]
})
export class CandidatesModule { }
