import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Lookup } from 'src/app/models/master/lookup.model';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-create-account',
  standalone: false,
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css'
})
export class CreateAccountComponent {
  createAccountForm!: FormGroup;
  showError = false;
  loadingFlag: boolean = false;
  countries: Array<Lookup> = [];
  states: Array<Lookup> = [];
  cities: Array<Lookup> = [];

  constructor(private fb: FormBuilder,
    private api: ApiService,
    private gs: GlobalService,
    private router: Router) { }

  ngOnInit() {
    this.createRegisterForm();
    // this.getCountries();
  }

  createRegisterForm() {
    this.createAccountForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  createAccount() {
    if (this.createAccountForm.valid) {
      const route = 'user/create';
      const postData = this.createAccountForm.value;

      this.api.retrieveFromMakeProfile(route, postData).subscribe({
        next: response => {
          const customer = response as any;
          this.gs.openLogin('Success', 'Your Acoount Created Successfully');
          console.log(customer);
        },
      })
    } else {
      this.showError = true;
    }
  }

}
