import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-mobile-forgot',
  standalone: false,
  templateUrl: './mobile-forgot.component.html',
  styleUrl: './mobile-forgot.component.css'
})
export class MobileForgotComponent {
  loadingFlag = false;
  flag = false;
  showError = false;
  forgotPasswordForm!: FormGroup;
  otpRequested = false;
  otpVerified = false;
  passwordMismatch = false;
  values: any;
  otp: any;
  expiryDate: any;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    public gs: GlobalService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.createForgotPasswordForm();
  }

  createForgotPasswordForm() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', Validators.required],
      otp: [''],
      password: [''],
      confirmPassword: [''],
    });
  }

  handleClick() {
    if (!this.otpRequested) {
      this.sendPasswordResetEmail();
    } else if (!this.otpVerified) {
      this.verifyOtp();
    } else {
      this.submitNewPassword();
    }
  }

  regenerateOtp() {
    if (this.forgotPasswordForm.valid) {
      this.flag = true;

      const email = this.forgotPasswordForm.controls['email'].value;

      const route = `forgot-password/users`;

      const payload = this.forgotPasswordForm.value;

      this.api.retrieve(route, payload).subscribe({
        next: (response) => {
          this.loadingFlag = false;
          this.otpRequested = true;
          this.values = response;
          this.otp = this.values.otp;
          this.expiryDate = this.values.expiryDate;

          this.forgotPasswordForm.controls['otp'];
          this.forgotPasswordForm.controls['otp'].updateValueAndValidity();
          window.alert('OTP sent to your email');
        },
        error: (error) => {
          this.loadingFlag = false;
          window.alert('Please enter the correct email id');
        },
      });
    } else {
      this.showError = true;
      window.alert('Please enter the email id');
    }

  }

  sendPasswordResetEmail() {
    if (this.forgotPasswordForm.valid) {
      this.loadingFlag = true;

      const email = this.forgotPasswordForm.controls['email'].value;

      const route = `forgot-password/users`;

      const payload = this.forgotPasswordForm.value;

      this.api.retrieve(route, payload).subscribe({
        next: (response) => {
          this.loadingFlag = false;
          this.otpRequested = true;
          this.values = response;
          this.otp = this.values.otp;
          this.expiryDate = this.values.expiryDate;

          this.forgotPasswordForm.controls['otp'];
          this.forgotPasswordForm.controls['otp'].updateValueAndValidity();
          window.alert('OTP sent to your email');
        },
        error: (error) => {
          this.loadingFlag = false;
          window.alert('Please enter the correct email id');
        },
      });
    } else {
      this.showError = true;
      window.alert('Please enter the email id');
    }
  }

  verifyOtp() {
    const verifyOtp = this.forgotPasswordForm.controls['otp'].value;
    if (verifyOtp === this.otp) {
      if (new Date(this.expiryDate) < new Date()) {
        this.forgotPasswordForm.controls['otp'].reset('');
        window.alert('Your OTP has expired. Please generate a new one.');
      }
      if (this.forgotPasswordForm.valid) {
        this.loadingFlag = true;
        const route = `forgot-password/verify-otp`;
        const payload = this.forgotPasswordForm.value;

        this.api.retrieve(route, payload).subscribe({
          next: (response) => {
            this.loadingFlag = false;
            this.otpVerified = true;

            this.forgotPasswordForm.controls['password'].setValidators([Validators.required]);
            this.forgotPasswordForm.controls['confirmPassword'].setValidators([Validators.required]);
            this.forgotPasswordForm.controls['password'].updateValueAndValidity();
            this.forgotPasswordForm.controls['confirmPassword'].updateValueAndValidity();
            window.alert('OTP Verified.Set your new password');
          },
          error: (error) => {
            this.loadingFlag = false;
            // window.alert('Invalid OTP. Please Enter Correct Otp.');
          },
        });
      }
    } else {
      this.showError = true;
      window.alert('Invalid OTP. Please Enter Correct Otp.');
    }
  }

  submitNewPassword() {
    const pwd = this.forgotPasswordForm.controls['password'].value;
    const cpwd = this.forgotPasswordForm.controls['confirmPassword'].value;

    if (
      this.forgotPasswordForm.controls['password'].valid &&
      this.forgotPasswordForm.controls['confirmPassword'].valid
    ) {
      if (pwd !== cpwd) {
        this.passwordMismatch = true;
        window.alert('Passwords do not match.');
        return;
      }

      this.passwordMismatch = false;
      this.loadingFlag = true;

      const payload = {
        email: this.forgotPasswordForm.controls['email'].value,
        otp: this.forgotPasswordForm.controls['otp'].value,
        password: pwd,
      };

      this.api.update('forgot-password/update-password', payload).subscribe({
        next: () => {
          this.loadingFlag = false;
          window.alert('Password reset successfully!');
          this.router.navigate(['/mob-login']);
        },
        error: () => {
          this.loadingFlag = false;
          window.alert('Failed to reset password.');
        },
      });
    } else {
      this.showError = true;
      window.alert('Please fill all password fields.');
    }
  }

  login() {
    this.router.navigate(['mob-login']);
  }
}
