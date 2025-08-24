import { CommonModule } from '@angular/common';
import { MakeProfileDividerComponent } from './components/make-profile-divider/make-profile-divider.component';
import { PrimengModule } from '../primeng/primeng.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ClipboardModule } from 'ngx-clipboard';
import { NgModule } from '@angular/core';
import { MessageComponent } from './message/message.component';
import { ClickedOutsideDirective } from './directives/clicked-outside.directive';
import { LoginPopupComponent } from './popup/login-popup/login-popup.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MobileMessageComponent } from './mobile-message/mobile-message.component';
import { CustomMessageComponent } from './custom-message/custom-message.component';
import { CustomMobileMessageComponent } from './custom-mobile-message/custom-mobile-message.component';
import { MatDialogModule } from '@angular/material/dialog';
import { LoaderComponent } from './components/loader/loader.component';
import { MobileLoaderComponent } from './components/mobile-loader/mobile-loader.component';
import { CandidateCommonDetailsComponent } from './components/candidate-common-details/candidate-common-details.component';
import { MobileCommonDetailsComponent } from './components/mobile-common-details/mobile-common-details.component';
import { ReferralComponent } from './components/referral/referral.component';
import { RewardsSuccessMessageComponent } from './components/rewards-success-message/rewards-success-message.component';
import { MobileRewardsSuccessComponent } from './components/mobile-rewards-success/mobile-rewards-success.component';
import { CashbackRenewComponent } from './components/cashback-renew/cashback-renew.component';
import { MobileReferralComponent } from './components/mobile-referral/mobile-referral.component';
 
@NgModule({
  declarations: [
    MakeProfileDividerComponent,
    ClickedOutsideDirective,
    MessageComponent,
    LoginPopupComponent,
    MobileMessageComponent,
    CustomMessageComponent,
    CustomMobileMessageComponent,
    LoaderComponent,
    MobileLoaderComponent,
    CandidateCommonDetailsComponent,
    MobileCommonDetailsComponent,
    ReferralComponent,
    RewardsSuccessMessageComponent,
    MobileRewardsSuccessComponent,
    CashbackRenewComponent,
    MobileReferralComponent
    
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
    MatDialogModule,
    LoaderComponent,
    MobileLoaderComponent,
    CandidateCommonDetailsComponent,
    MobileCommonDetailsComponent,
    ReferralComponent,
    RewardsSuccessMessageComponent,
    MobileRewardsSuccessComponent,
    CashbackRenewComponent,
    MobileReferralComponent
  ],
})
export class SharedModule {}
