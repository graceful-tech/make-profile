import { DatePipe, HashLocationStrategy, LocationStrategy, PathLocationStrategy, PlatformLocation } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIdleModule } from '@ng-idle/core';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { InterceptorService } from './services/interceptor.service';
import { MessageService } from 'primeng/api';
import { LoginComponent } from './auth/login/login.component';
import { CreateAccountComponent } from './auth/create-account/create-account.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MobileCreateAccountComponent } from './auth-mobile/mobile-create-account/mobile-create-account.component';
import { MobileLoginComponent } from './auth-mobile/mobile-login/mobile-login.component';
import { ViewAccountComponent } from './features/users/view-account/view-account.component';
import { EditUserComponent } from './features/users/edit-user/edit-user.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CreateAccountComponent,
    MobileCreateAccountComponent,
    MobileLoginComponent,
    ViewAccountComponent,
    EditUserComponent,
    ForgotPasswordComponent


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    LayoutModule,
    NgIdleModule.forRoot(),
    FormsModule
  ],
  providers: [
    DialogService,
    MessageService,
    DynamicDialogRef,
    DynamicDialogConfig,
    DatePipe,

    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
