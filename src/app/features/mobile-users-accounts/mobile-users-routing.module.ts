import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MobViewAccountComponent } from './mob-view-account/mob-view-account.component';
import { EditMobileUsersComponent } from './edit-mobile-users/edit-mobile-users.component';

const routes: Routes = [

   {path: '', component:MobViewAccountComponent},

   {path: 'mob-edit-user', component:EditMobileUsersComponent},



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileUsersRoutingModule { }
