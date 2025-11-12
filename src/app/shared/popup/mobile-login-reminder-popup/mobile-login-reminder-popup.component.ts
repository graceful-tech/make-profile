import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-mobile-login-reminder-popup',
  standalone: false,
  templateUrl: './mobile-login-reminder-popup.component.html',
  styleUrl: './mobile-login-reminder-popup.component.css',
})
export class MobileLoginReminderPopupComponent {
  name: any;

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
    this.router.navigate(['mob-login']);
     this.ref.close();
  }
}
