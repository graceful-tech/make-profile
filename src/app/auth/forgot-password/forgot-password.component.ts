import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  loadingFlag = false;
  showError = false;
  forgotPasswordForm!: FormGroup;
  otpRequested = false;
  otpVerified = false;
  passwordMismatch = false;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    public gs: GlobalService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.createForgotPasswordForm();
  }

  createForgotPasswordForm() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', Validators.required],
      otp: [''],
      newPassword: [''],
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

          this.forgotPasswordForm.controls['otp'].setValidators([
            Validators.required,
          ]);
          this.forgotPasswordForm.controls['otp'].updateValueAndValidity();

          this.gs.showMessage('Success', 'OTP sent to your email.');
        },
        error: (error) => {
          this.loadingFlag = false;
        },
      });
    } else {
      this.showError = true;
      this.gs.showMessage('Error', 'Please enter the email id');
    }
  }

  verifyOtp() {
    if (this.forgotPasswordForm.valid) {
      this.loadingFlag = true;
      const route = `forgot-password/verify-otp`;
      // const payload = this.forgotPasswordForm.value;

      const payload = {
        email: this.forgotPasswordForm.controls['email'].value,
        otp: this.forgotPasswordForm.controls['otp'].value,
      };

      this.api.retrieve(route, payload).subscribe({
        next: (response) => {
          this.loadingFlag = false;
          this.otpVerified = true;

          // Add validators for password fields
          this.forgotPasswordForm.controls['newPassword'].setValidators([Validators.required]);
          this.forgotPasswordForm.controls['confirmPassword'].setValidators([Validators.required]);
          this.forgotPasswordForm.controls['newPassword'].updateValueAndValidity();
          this.forgotPasswordForm.controls['confirmPassword'].updateValueAndValidity();

          this.gs.showMessage('Success', 'OTP Verified. Set your new password.');
        },
        error: (error) => {
          this.loadingFlag = false;
          this.gs.showMessage('Error', 'Invalid OTP. Please try again.');
        },
      });
    } else {
      this.showError = true;
      this.gs.showMessage('Error', 'Please fill in all required fields.');
    }
  }

  submitNewPassword() {
    const pwd = this.forgotPasswordForm.controls['newPassword'].value;
    const cpwd = this.forgotPasswordForm.controls['confirmPassword'].value;

    if (
      this.forgotPasswordForm.controls['newPassword'].valid &&
      this.forgotPasswordForm.controls['confirmPassword'].valid
    ) {
      if (pwd !== cpwd) {
        this.passwordMismatch = true;
        this.gs.showMessage('Error', 'Passwords do not match.');
        return;
      }

      this.passwordMismatch = false;
      this.loadingFlag = true;

      const payload = {
        email: this.forgotPasswordForm.controls['email'].value,
        otp: this.forgotPasswordForm.controls['otp'].value,
        newPassword: pwd,
      };

      this.api.post('forgot-password/reset-password', payload).subscribe({
        next: () => {
          this.loadingFlag = false;
          this.gs.showMessage('Success', 'Password reset successfully!');
          this.router.navigate(['/login']);
        },
        error: () => {
          this.loadingFlag = false;
          this.gs.showMessage('Error', 'Failed to reset password.');
        },
      });
    } else {
      this.showError = true;
      this.gs.showMessage('Error', 'Please fill all password fields.');
    }
  }

  login() {
    this.router.navigate(['login']);
  }
}
