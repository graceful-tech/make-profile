import { DatePipe, HashLocationStrategy, LocationStrategy, PathLocationStrategy, PlatformLocation } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIdleModule } from '@ng-idle/core';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { InterceptorService } from './services/interceptor.service';
import { MessageService } from 'primeng/api';
import { AddCandidatesComponent } from './features/candidates/add-candidates/add-candidates.component';


@NgModule({
  declarations: [
    AppComponent,
    
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    LayoutModule,
    NgIdleModule.forRoot()
  ],
  providers: [
    DialogService,
    MessageService,
    DynamicDialogRef,
    DynamicDialogConfig,
    DatePipe,
  
  //  { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
   { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
