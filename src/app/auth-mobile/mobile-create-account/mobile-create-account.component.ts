import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Lookup } from 'src/app/models/master/lookup.model';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-mobile-create-account',
  standalone: false,
  templateUrl: './mobile-create-account.component.html',
  styleUrl: './mobile-create-account.component.css'
})
export class MobileCreateAccountComponent {
  createAccountForm!: FormGroup;
  showError = false;
  loadingFlag: boolean = false;
  countries: Array<Lookup> = [];
  states: Array<Lookup> = [];
  cities: Array<Lookup> = [];
  error!: string;

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
      this.loadingFlag = true;
      const route = 'user/create';
      const postData = this.createAccountForm.value;

      this.api.retrieve(route, postData).subscribe({
        next: response => {
          this.loadingFlag = false;
          const customer = response as any;
          // this.gs.openLogin('Success', 'Your Acoount Created Successfully');
          this.router.navigate(['/mobiel-login']);
          console.log(customer);
        },
        error: (error) => {
          this.error = error.error?.message;
          this.loadingFlag = false;
        }
      })
    } else {
      this.showError = true;
    }
  }

}
