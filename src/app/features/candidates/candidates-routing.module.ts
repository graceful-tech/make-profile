import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCandidatesComponent } from './add-candidates/add-candidates.component';
import { CreateCandidatesComponent } from './create-candidates/create-candidates.component';
 
 
const routes: Routes = [
  
  { path: '', component: AddCandidatesComponent },
  { path: 'candidate', component: CreateCandidatesComponent },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidatesRoutingModule { }
