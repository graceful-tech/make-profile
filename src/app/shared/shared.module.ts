import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { MakeProfileDividerComponent } from './components/make-profile-divider/make-profile-divider.component';
import { CheckboxModule } from 'primeng/checkbox';
import { PrimengModule } from '../primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddCandidatesComponent } from '../features/candidates/add-candidates/add-candidates.component';



@NgModule({
  declarations: [
    MakeProfileDividerComponent,
   
  ],
  imports: [
    CommonModule,
    PrimengModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule
  ],
  exports: [
    PrimengModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule,
    MakeProfileDividerComponent,
  ]
})
export class SharedModule { }
