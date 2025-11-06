declare var google: any;
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Lookup } from 'src/app/models/master/lookup.model';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { environment } from 'src/environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-create-resume-directly',
  standalone: false,
  templateUrl: './create-resume-directly.component.html',
  styleUrl: './create-resume-directly.component.css',
})
export class CreateResumeDirectlyComponent {
  createAccountForm!: FormGroup;
  showError = false;
  loadingFlag: boolean = false;
  countries: Array<Lookup> = [];
  states: Array<Lookup> = [];
  cities: Array<Lookup> = [];
  error!: string;
  isReference = false;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private gs: GlobalService,
    private deviceDetectorService: DeviceDetectorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.createRegisterForm();
    const hash = window.location.hash;
    const queryString = hash.includes('?') ? hash.split('?')[1] : '';
    const params = new URLSearchParams(queryString);
    const referenceCode = params.get('reference');

    if (referenceCode) {
      console.log(referenceCode);
      this.createAccountForm.get('reference')?.setValue(referenceCode);
      this.isReference = true;
    }
    // this.getCountries();

    if (this.isMobileDevice()) {
      this.router.navigate(['/mob-login/create-account-directly']);
    }
  }

  createRegisterForm() {
    this.createAccountForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      reference: [''],
    });
  }

  createAccount() {
    if (this.createAccountForm.valid) {
      this.loadingFlag = true;
      const route = 'user/create';
      const postData = this.createAccountForm.value;

      this.api.retrieve(route, postData).subscribe({
        next: (response) => {
          this.loadingFlag = false;

          localStorage.clear();
          this.gs.navigate.next(false);
          // const customer = response as any;
          // this.gs.openLogin('Success', 'Your Account Created Successfully');
          sessionStorage.setItem('authType', 'custom');
          sessionStorage.setItem('token', response.token);
          sessionStorage.setItem('userName', response.userName);
          sessionStorage.setItem('userId', response.id);
          this.router.navigate(['/candidate']);
          console.log(response);
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

  openLogin() {
    this.router.navigate(['/login']);
  }

  onGoogleSignup() {
    const restUrl = environment.restUrl;
    const isMobile = this.deviceDetectorService.isMobile();
    const baseUrl = window.location.origin;
    const redirectUri = isMobile
      ? `${baseUrl}/#/mob-candidate`
      : `${baseUrl}/#/candidate`;
    document.cookie = `redirect_uri=${encodeURIComponent(redirectUri)}; path=/`;
    const hash = window.location.hash; // "#/mob-login/mob-create?reference=mycoupen"
    const queryString = hash.split('?')[1]; // "reference=mycoupen"
    if (queryString) {
      const params = new URLSearchParams(queryString);
      const reference = params.get('reference');
      if (reference) {
        document.cookie = `reference=${encodeURIComponent(reference)}; path=/`;
      }
    }
    const url = `${restUrl}/oauth2/authorization/google`;
    window.location.href = url;
  }

  goBack() {
    this.router.navigate(['/login']);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  createResume() {
    this.router.navigate(['/enter-details']);
  }

  isMobileDevice(): boolean {
    const userAgent =
      navigator.userAgent || navigator.vendor || (window as any).opera;
    return /android|iphone|ipad|ipod/i.test(userAgent);
  }
}
