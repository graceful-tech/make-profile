import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
 import { ButtonModule } from 'primeng/button';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { CreateAccountComponent } from './create-account/create-account.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
     LoginComponent,
     CreateAccountComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ],
})
export class AuthModule { }
