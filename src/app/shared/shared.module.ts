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
import { ResumeEditorComponent } from './components/resume-editor/resume-editor.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AnalyseWithAiComponent } from './components/analyse-with-ai/analyse-with-ai.component';
import { NewDetailsComponent } from './components/new-details/new-details.component';
import { MobileAnalyseAiComponent } from './components/mobile-analyse-ai/mobile-analyse-ai.component';
import { ToastMessageComponent } from './components/toast-message/toast-message.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { ErrorMobilePopupComponent } from './components/error-mobile-popup/error-mobile-popup.component';
import { TagInputModule } from 'ngx-chips';
import { DetailsFillDirectlyComponent } from './components/details-fill-directly/details-fill-directly.component';
import { MobileResumeCommonDetailsComponent } from './components/mobile-resume-common-details/mobile-resume-common-details.component';
import { MobileDetailsDillDirectlyComponent } from './components/mobile-details-dill-directly/mobile-details-dill-directly.component';
import { MobilePopupComponent } from './popup/mobile-popup/mobile-popup.component';
import { MobileErrorLoginPopupComponent } from './components/mobile-error-login-popup/mobile-error-login-popup.component';
import { ErrorLoginPopupComponent } from './components/error-login-popup/error-login-popup.component';
import { MultiPageFormsComponent } from './multipage-components/multi-page-forms/multi-page-forms.component';
import { ModelLoginPopupComponent } from './popup/model-login-popup/model-login-popup.component';
import { MobileMultiPageFormsComponent } from './multipage-components/mobile-multi-page-forms/mobile-multi-page-forms.component';
import { MobileTemplatesComponent } from './multipage-components/mobile-templates/mobile-templates.component';
import { ResumeTemplateComponent } from './multipage-components/resume-template/resume-template.component';
   
 
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
    MobileReferralComponent,
    ResumeEditorComponent,
    AnalyseWithAiComponent,
    NewDetailsComponent,
    MobileAnalyseAiComponent,
    ErrorMessageComponent,
    ErrorMobilePopupComponent,
    DetailsFillDirectlyComponent,
    MobileResumeCommonDetailsComponent,
    MobileDetailsDillDirectlyComponent,
    MobilePopupComponent,
    MobileErrorLoginPopupComponent,
    ErrorLoginPopupComponent,
    MultiPageFormsComponent,
    ModelLoginPopupComponent,
    MobileMultiPageFormsComponent,
    MobileTemplatesComponent,
    ResumeTemplateComponent
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
    DragDropModule,
    TagInputModule,
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
    MobileReferralComponent,
    ResumeEditorComponent,
    DragDropModule,
    AnalyseWithAiComponent,
    NewDetailsComponent,
    MobileAnalyseAiComponent,
    ErrorMessageComponent,
    ErrorMobilePopupComponent,
    TagInputModule,
    DetailsFillDirectlyComponent,
    MobileResumeCommonDetailsComponent,
    MobileDetailsDillDirectlyComponent,
    MobileErrorLoginPopupComponent,
    ErrorLoginPopupComponent,
    MultiPageFormsComponent,
    ModelLoginPopupComponent,
    MobileMultiPageFormsComponent,
    MobileTemplatesComponent,
    ResumeTemplateComponent
  ],
})
export class SharedModule {}
