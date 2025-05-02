import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mobile-login',
  standalone: false,
  templateUrl: './mobile-login.component.html',
  styleUrl: './mobile-login.component.css'
})
export class MobileLoginComponent {

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

  goBack() {
    this.router.navigate(['mobile'])
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
      this.api.retrieve(route, postData).subscribe({
        next: (response) => {
          console.log(response)
          sessionStorage.setItem('authType', 'custom');
          sessionStorage.setItem('token', response.token);
          sessionStorage.setItem('userName', response.name);
          sessionStorage.setItem('userId', response.id);
          this.router.navigate(['/mob-candidate']);
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

  onGoogleLogin() {
    const restUrl = environment.restUrl;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const baseUrl = window.location.origin;
    const redirectUri = isMobile ? `${baseUrl}/#/mob-candidate` : `${baseUrl}/#/candidate`;
    document.cookie = `redirect_uri=${encodeURIComponent(redirectUri)}; path=/`;
    const url = `${restUrl}/oauth2/authorization/google`;
    window.location.href = url;
  }


}
