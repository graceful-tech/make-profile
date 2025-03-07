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

 
@NgModule({
  declarations: [
   MakeProfileDividerComponent,
   ClickedOutsideDirective,
   MessageComponent,
   LoginPopupComponent
   
   
   
  ],
  imports: [
    CommonModule,
    PrimengModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
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
    LoginPopupComponent
  ]
})
export class SharedModule { }
