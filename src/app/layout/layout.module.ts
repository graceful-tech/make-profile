import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AddCandidatesComponent } from '../features/candidates/add-candidates/add-candidates.component';
import { SharedModule } from '../shared/shared.module';




@NgModule({
  declarations: [
    LandingPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
  ],
  exports: [ ]
})
export class LayoutModule { }
