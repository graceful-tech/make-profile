import { Component } from '@angular/core';
import {FormBuilder, Validators,FormsModule, ReactiveFormsModule, FormGroup,} from '@angular/forms';
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

  constructor (private api: ApiService,private fb: FormBuilder,public gs: GlobalService,private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.createForgotPasswordForm();
  }

  createForgotPasswordForm() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', Validators.required],
    });
  }


  sendPasswordResetEmail() {
    if (this.forgotPasswordForm.valid) {
      
    this.loadingFlag = true;

    const email = this.forgotPasswordForm.controls['email'].value

   const route = `forgot-password/users?email=${encodeURIComponent(email)}`;

    const payload = this.forgotPasswordForm.value;

    this.api.get(route).subscribe({
        next: (response) => {
         
        },
        error: (error) => {
          this.loadingFlag = false;
        },
      });
    } 
    else{
      this.showError = true;
       this.gs.showMessage('Error','Please enter the email id');
    }
  }

  login() {
    this.router.navigate(['login']);
  }
}
