import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AddCandidatesComponent } from '../features/candidates/add-candidates/add-candidates.component';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
  ],
  exports: [
  
  ]
})
export class LayoutModule { }
