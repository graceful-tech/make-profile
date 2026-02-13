import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-update-user-password',
  standalone: false,
  templateUrl: './update-user-password.component.html',
  styleUrl: './update-user-password.component.css'
})
export class UpdateUserPasswordComponent {


  passwordForm!: FormGroup;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  mismatch: boolean = false;
  userName: any
  isMobile: boolean = false;


  constructor(private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute, private gs: GlobalService, private router: Router) {

    this.isMobile = this.isMobileDevice();
  }


  createForm() {
    this.passwordForm = this.fb.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      },
    );
  }

  ngOnInit() {
    this.createForm();

    this.route.paramMap.subscribe(params => {
      this.userName = params.get('userName');

    });

    this.passwordForm.valueChanges.subscribe(() => {
      this.mismatch = false;
    });
  }

  passwordMatchValidator() {
    const password = this.passwordForm.get('password')?.value;
    const confirmPassword = this.passwordForm.get('confirmPassword')?.value;
    this.mismatch = password !== confirmPassword;
    return password === confirmPassword ? null : { mismatch: true };
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    this.passwordMatchValidator();
    if (this.passwordForm.valid && !this.mismatch) {
      this.updatePassword();
    }

  }



  updatePassword() {

    const route = 'forgot-password/update-user'
    const payload = {
      userName: this.userName,
      password: this.passwordForm.get('password')?.value
    };

    this.api.retrieve(route, payload).subscribe(
      (response) => {
        if (this.isMobile) {
          this.gs.showMessage('success', 'Password updated successfully');
          this.router.navigate(['/login']);
        }
        else {
          this.gs.showMobileMessage('success', 'Password updated successfully');
          this.router.navigate(['/mob-login']);
        }

      },
      (error) => {
        if (this.isMobile) {
          this.gs.showMessage('error', 'error in updating password');
          this.router.navigate(['/login']);
        }
        else {
          this.gs.showMobileMessage('error', 'error in updating password');
          this.router.navigate(['/mob-login']);
        }
      }
    );
  }

  private isMobileDevice(): boolean {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    return /android|iphone|ipad|ipod/i.test(userAgent);
  }



}
