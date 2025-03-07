import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-login-popup',
  standalone: false,
  templateUrl: './login-popup.component.html',
  styleUrl: './login-popup.component.css'
})
export class LoginPopupComponent {
  message!: String;

  constructor(public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private router: Router) { }

  ngOnInit() {
    this.message = this.config.data?.message;
  }


  goToLoginPage() {
    this.router.navigate(['/login']);
    this.ref.close();
  }

}
