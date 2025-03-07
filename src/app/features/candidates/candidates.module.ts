import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidatesRoutingModule } from './candidates-routing.module';
import { AddCandidatesComponent } from './add-candidates/add-candidates.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateCandidatesComponent } from './create-candidates/create-candidates.component';
 

@NgModule({
  declarations: [
    AddCandidatesComponent,
    CreateCandidatesComponent
  ],
  imports: [
    CommonModule,
    CandidatesRoutingModule,
    SharedModule
    
  ],
})
export class CandidatesModule { }
