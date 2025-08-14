
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { environment } from 'src/environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';

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
  loginType: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private gs: GlobalService,
    private router: Router,
    private deviceDetectorService: DeviceDetectorService,
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
      mobileNumber: [''],
      userName: [''],
      password: ['', Validators.required],
    });
  }

  login() {
    this.showError = true;
    const selectedLoginType = this.loginType;
    const password = this.loginForm.get('password')?.value;
    const mobile = this.loginForm.get('mobileNumber')?.value;
    const username = this.loginForm.get('username')?.value;

    if (!selectedLoginType) {
      this.error = 'Please select a login method (Mobile Number or Username)';
      return;
    }

    if (
      (selectedLoginType === 'mobile' && (!mobile || mobile.trim() === '')) ||
      (selectedLoginType === 'username' && (!username || username.trim() === ''))
    ) {
      return;
    }

    if (!password || password.trim() === '') {
      return;
    }

    if (this.loginForm.valid) {
      this.loadingFlag = true;
      const route = 'auth/login';
      const postData = this.loginForm.value;

      this.api.retrieve(route, postData).subscribe({
        next: (response) => {
          console.log(response);
          sessionStorage.setItem('authType', 'custom');
          sessionStorage.setItem('token', response.token);
          sessionStorage.setItem('userName', response.userName);
          sessionStorage.setItem('userId', response.id);
          this.router.navigate(['/candidate']);
        },
        error: (error) => {
          this.error = error.error?.message;
          this.loadingFlag = false;
        },
      });
    }
  }


  // openSendPasswordResetEmailModal() {
  //   this.dialog.open(SendPasswordResetMailComponent, {
  //     header: 'Forgot Password',
  //     width: '25%'
  //   });
  // }


  onGoogleLogin() {
    const restUrl = environment.restUrl;
    const isMobile = this.deviceDetectorService.isMobile();
    const baseUrl = window.location.origin;
    const redirectUri = isMobile ? `${baseUrl}/#/mob-candidate` : `${baseUrl}/#/candidate`;
    document.cookie = `redirect_uri=${encodeURIComponent(redirectUri)}; path=/`;
    const url = `${restUrl}/oauth2/authorization/google`;
    window.location.href = url;
  }

  goBack() {
    this.router.navigate(['']);
  }
  ForgotPassword() {
    this.router.navigate(['Forgot-password']);
  }

  setLoginType(type: string): void {
    this.loginType = type;

    this.loginForm.get('mobileNumber')?.clearValidators();
    this.loginForm.get('userName')?.clearValidators();

    this.loginForm.get('mobileNumber')?.reset();
    this.loginForm.get('userName')?.reset();

    if (type === 'mobile') {
      this.loginForm.get('mobileNumber')?.setValidators([Validators.required, Validators.pattern(/^[0-9]+$/)]);
    } else if (type === 'userName') {
      this.loginForm.get('userName')?.setValidators([Validators.required]);
    }

    this.loginForm.get('mobileNumber')?.updateValueAndValidity();
    this.loginForm.get('userName')?.updateValueAndValidity();
  }
}
