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
  userName: string = '';
  password: string = '';

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

  // ngOnInit() {
  //   this.message = this.config.data?.message;
  // }

  closePopup() {
    // this.router.navigate(['/login']);
    this.router.navigate(['candidate/template']);
    this.ref.close();
  }
}
