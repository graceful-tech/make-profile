import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { environment } from 'src/environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-mobile-login',
  standalone: false,
  templateUrl: './mobile-login.component.html',
  styleUrl: './mobile-login.component.css'
})
export class MobileLoginComponent {
  loginForm!: FormGroup;
  showError = false;
  loadingFlag: boolean = false;
  loginType: string | null = null;
  error!: String;
  loginError!: String;

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
  }

  goBack() {
    this.router.navigate(['mob-landing'])
  }


  createLoginForm() {
    this.loginForm = this.fb.group({
      mobileNumber: [''],
      userName: [''],
      password: [''],
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

        sessionStorage.setItem('authType', 'custom');
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('userName', response.userName);
        sessionStorage.setItem('userId', response.id);
        this.router.navigate(['/mob-candidate']);
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

  setLoginType(type: string): void {
    this.loginType = type;
    this.loginForm.get('mobileNumber')?.reset();
    this.loginForm.get('userName')?.reset();
    this.loginForm.get('password')?.reset();
    this.error = '';
    this.loginError = '';
    this.showError = false;
  }

}
