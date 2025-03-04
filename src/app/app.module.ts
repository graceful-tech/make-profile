import { CommonModule, DatePipe, HashLocationStrategy, LocationStrategy, PathLocationStrategy, PlatformLocation } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIdleModule } from '@ng-idle/core';
import { AppComponent } from './app.component';
import { AddCandidatesComponent } from './features/candidates/add-candidates/add-candidates.component';
import { LayoutModule } from './layout/layout.module';
import { InterceptorService } from './services/interceptor.service';
import { LandingPageComponent } from './layout/landing-page/landing-page.component';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';



@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    AddCandidatesComponent,
   
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    ButtonModule,
    PasswordModule,
    DropdownModule,
    CommonModule,
    NgIdleModule.forRoot()
  ],
  providers: [
    DialogService,
    MessageService,
    DynamicDialogRef,
    DynamicDialogConfig,
    DatePipe,
    ConfirmationService,
  //   { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
  //   {
  //     provide: LocationStrategy,
  //     useFactory: (platformLocation: any) => {
  //       // Dynamically decide which LocationStrategy to use based on the URL
  //       if (window.location.href.indexOf('#') === -1) {
  //         return new PathLocationStrategy(platformLocation);
  //       } else {
         
  //         return new HashLocationStrategy(platformLocation);
  //       }
  //     },
  //     deps: [PlatformLocation], // Inject PlatformLocation as dependency
  //   },
  // ],
  { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
  { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
