import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-login-popup',
  standalone: false,
  templateUrl: './login-popup.component.html',
  styleUrl: './login-popup.component.css',
})
export class LoginPopupComponent {
  message!: String;
  userName: any;
  password: any;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private router: Router
  ) {
    if (config.data) {
      this.userName = config.data.userName || '';
      this.password = config.data.password || '';
    }
  }


  closePopup() {
    this.router.navigate(['candidate/verify-details']);
    this.ref.close();
  }
}
