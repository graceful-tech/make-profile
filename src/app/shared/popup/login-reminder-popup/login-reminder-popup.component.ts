import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-login-reminder-popup',
  standalone: false,
  templateUrl: './login-reminder-popup.component.html',
  styleUrl: './login-reminder-popup.component.css'
})
export class LoginReminderPopupComponent {
  message!: String;
  userName: any;
  password: any;
  name:any;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private router: Router
  ) {
    if (config.data) {
      this.name = config.data.name || '';
    }
  }


  closePopup() {
 
    this.ref.close();
  }

  Login(){
    this.router.navigate(['login']);
    this.ref.close();
  }
}
