
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
  showError = false;
  loadingFlag: boolean = false;
  loginType: string = 'mobile'
  error!: String;
  loginError!: String;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private gs: GlobalService,
    private router: Router,
    private deviceDetectorService: DeviceDetectorService,
    private dialog: DialogService
  ) { }

  ngOnInit() {
    if (this.isMobileDevice()) {
      // redirect to mobile login if mobile
      this.router.navigate(['/mob-login']);
    }
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      mobileNumber: [''],
      userName: [''],
      password: ['', [Validators.required]],
    });
  }

  login() {
    const selectedLoginType = this.loginType;
    const password = this.loginForm.get('password')?.value;
    const mobile = this.loginForm.get('mobileNumber')?.value;
    const username = this.loginForm.get('userName')?.value;

    this.showError = false;
    this.error = '';
    this.loginError = '';

    if (!selectedLoginType) {
      this.loginError = 'Please select a login method (Mobile Number or Username)';
      return;
    }
    if (
      (selectedLoginType === 'mobile' && (!mobile || mobile.trim() === '')) ||
      (selectedLoginType === 'userName' && (!username || username.trim() === ''))
    ) {
      this.showError = true;
      this.error =
        selectedLoginType === 'mobile' ? 'Mobile Number is required' : 'Username is required';
      return;
    }
    if (!password || password.trim() === '') {
      this.showError = true;
      this.error = 'Password is required';
      return;
    }

    this.loadingFlag = true;
    const route = 'auth/login';
    const postData = this.loginForm.value;

    this.api.retrieve(route, postData).subscribe({
      next: (response) => {

        localStorage.clear();
        this.gs.navigate.next(false);

        sessionStorage.setItem('authType', 'custom');
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('userName', response.userName);
        sessionStorage.setItem('userId', response.id);
        const updatePassword = response.updatePassword === true ? 'true' : 'false';
        sessionStorage.setItem('updatePassword', updatePassword);
        this.router.navigate(['/candidate']);
      },
      error: (error) => {
        this.loginError = error.error?.message || 'Login failed. Please try again.';
        this.loadingFlag = false;
      },
    });
  }


  onGoogleLogin() {
    localStorage.clear();
    this.gs.navigate.next(false);

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
    this.loginForm.get('mobileNumber')?.reset();
    this.loginForm.get('userName')?.reset();
    this.loginForm.get('password')?.reset();
    this.error = '';
    this.loginError = '';
    this.showError = false;
  }

  private isMobileDevice(): boolean {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    return /android|iphone|ipad|ipod/i.test(userAgent);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

}
