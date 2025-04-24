import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;
  error!: String;
  showError = false;
  loadingFlag: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private gs: GlobalService,
    private router: Router,
    private dialog: DialogService
  ) { }

  ngOnInit() {
    this.createLoginForm();

    this.gs.paymentStatus$.subscribe((response) => {
      if (response == 'Completed') {
        this.gs.showMessage('Success', 'Payment completed successfully.');
        this.gs.setPaymentStatus(null);
      }
    });
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      mobileNumber: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    this.loadingFlag = true;
    if (this.loginForm.valid) {
      this.loadingFlag = true;
      const route = 'auth/login';
      const postData = this.loginForm.value;
      localStorage.setItem('tenant', postData.code);

      this.api.retrieve(route, postData).subscribe({
        next: (response) => {
          console.log(response)
          sessionStorage.setItem('authType', 'custom');
          sessionStorage.setItem('token', response.token);
          sessionStorage.setItem('userName', response.name);
          sessionStorage.setItem('userId', response.id);
          this.router.navigate(['/candidate']);
        },
        error: (error) => {
          this.error = error.error?.message;
          this.loadingFlag = false;
        },
      });
    } else {
      this.showError = true;
    }
  }

  // openSendPasswordResetEmailModal() {
  //   this.dialog.open(SendPasswordResetMailComponent, {
  //     header: 'Forgot Password',
  //     width: '25%'
  //   });
  // }


}
