import { createComponent, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageMobileComponent } from './layout/landing-page-mobile/landing-page-mobile.component';
import { LandingPageComponent } from './layout/landing-page/landing-page.component';
import { LoginComponent } from './auth/login/login.component';
import { CreateAccountComponent } from './auth/create-account/create-account.component';
import { ViewAccountComponent } from './features/users/view-account/view-account.component';
import { EditUserComponent } from './features/users/edit-user/edit-user.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { CreateResumeDirectlyComponent } from './auth/create-resume-directly/create-resume-directly.component';
import { DetailsFillDirectlyComponent } from './shared/components/details-fill-directly/details-fill-directly.component';
import { CreateResumeCommonDetailsComponent } from './shared/components/create-resume-common-details/create-resume-common-details.component';
import { MobileResumeCommonDetailsComponent } from './shared/components/mobile-resume-common-details/mobile-resume-common-details.component';
import { MobileDetailsDillDirectlyComponent } from './shared/components/mobile-details-dill-directly/mobile-details-dill-directly.component';
import { MultiPageFormsComponent } from './shared/multipage-components/multi-page-forms/multi-page-forms.component';
import { MobileMultiPageFormsComponent } from './shared/multipage-components/mobile-multi-page-forms/mobile-multi-page-forms.component';
import { MobileTemplatesComponent } from './shared/multipage-components/mobile-templates/mobile-templates.component';
import { ResumeTemplateComponent } from './shared/multipage-components/resume-template/resume-template.component';
import { NewLandingPageComponent } from './layout/new-landing-page/new-landing-page.component';
import { SelectUserDecisionComponent } from './shared/custom-landing/select-user-decision/select-user-decision.component';
import { FresherFormPageComponent } from './shared/custom-landing/fresher-form-page/fresher-form-page.component';
import { MobileFresherFormPageComponent } from './shared/custom-landing/mobile-fresher-form-page/mobile-fresher-form-page.component';
import { CommonDecisionComponent } from './shared/components/common-decision/common-decision.component';

const routes: Routes = [
  { path: '', component: NewLandingPageComponent },

  // { path: '', component: LandingPageComponent },

  { path: 'mob-landing', component: LandingPageMobileComponent },

  { path: 'login', component: LoginComponent },

  { path: 'viewUser', component: ViewAccountComponent },

  { path: 'create-account', component: CreateAccountComponent },

  { path: 'editUser', component: EditUserComponent },

  { path: 'forgot-password', component: ForgotPasswordComponent },

  { path: 'create-resume-directly', component: CreateResumeDirectlyComponent },

  { path: 'enter-details', component: DetailsFillDirectlyComponent },

  { path: 'common-details', component: CreateResumeCommonDetailsComponent },

  { path: 'resume-details', component: MobileResumeCommonDetailsComponent },

  {
    path: 'get-details-using-ai',
    component: MobileDetailsDillDirectlyComponent,
  },

  { path: 'multi-page-details', component: MultiPageFormsComponent },

  { path: 'mobile-multi', component: MobileMultiPageFormsComponent },

  { path: 'resume-templates', component: MobileTemplatesComponent },

  { path: 'select-template', component: ResumeTemplateComponent },

  { path: 'choose-direction', component: SelectUserDecisionComponent },

  { path: 'fresher-form', component: FresherFormPageComponent },

  { path: 'mob-fresher-form', component: MobileFresherFormPageComponent },

  { path: 'user-decision', component: CommonDecisionComponent },


  {
    path: 'candidate',
    loadChildren: () =>
      import('./features/candidates/candidates.module').then(
        (m) => m.CandidatesModule
      ),
  },
  {
    path: 'mob-candidate',
    loadChildren: () =>
      import(
        './features/mobile-view-candidates/mobile-view-candidates.module'
      ).then((m) => m.MobileViewCandidatesModule),
  },
  {
    path: 'view-mob-user',
    loadChildren: () =>
      import('./features/mobile-users-accounts/mobile-users.module').then(
        (m) => m.MobileUsersModule
      ),
  },
  {
    path: 'mob-login',
    loadChildren: () =>
      import('./auth-mobile/mobile-auth.module').then(
        (m) => m.MobileAuthModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
