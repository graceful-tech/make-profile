import { CommonModule } from "@angular/common";
import { MakeProfileDividerComponent } from "./components/make-profile-divider/make-profile-divider.component";
import { PrimengModule } from "../primeng/primeng.module";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { ClipboardModule } from 'ngx-clipboard';
import { NgModule } from "@angular/core";
import { MessageComponent } from "./message/message.component";
import { ClickedOutsideDirective } from "./directives/clicked-outside.directive";
import { LoginPopupComponent } from "./popup/login-popup/login-popup.component";
import { MatIconModule } from '@angular/material/icon'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MobileMessageComponent } from "./mobile-message/mobile-message.component";
import { CustomMessageComponent } from "./custom-message/custom-message.component";
import { CustomMobileMessageComponent } from "./custom-mobile-message/custom-mobile-message.component";
import { MatDialogModule } from '@angular/material/dialog';

   
 
 
@NgModule({
  declarations: [
   MakeProfileDividerComponent,
   ClickedOutsideDirective,
   MessageComponent,
   LoginPopupComponent,
   MobileMessageComponent,
   CustomMessageComponent,
   CustomMobileMessageComponent,
  ],
  imports: [
    CommonModule,
    PrimengModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ClipboardModule,
    PrimengModule,
    MakeProfileDividerComponent,
    ClickedOutsideDirective,
    MessageComponent,
    LoginPopupComponent,
    MatIconModule,
    NgxUiLoaderModule,
    MatProgressSpinnerModule,
    MobileMessageComponent,
    CustomMessageComponent,
    CustomMobileMessageComponent,
    MatDialogModule
    
  ]
})
export class SharedModule { }
