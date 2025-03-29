import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCandidatesComponent } from './add-candidates/add-candidates.component';
import { CreateCandidatesComponent } from './create-candidates/create-candidates.component';
import { CandidatesDetailsComponent } from './candidates-details/candidates-details.component';
import { ViewTemplatesComponent } from './Templates/view-templates/view-templates.component';
 
 
const routes: Routes = [


  {path: '', component:CandidatesDetailsComponent},

  { path: 'create', component: CreateCandidatesComponent },

  { path: 'candidate', component: AddCandidatesComponent },

  { path: 'template', component: ViewTemplatesComponent },

  // { path: 'view', component: ChooseTemplateComponent },

  
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidatesRoutingModule { }
