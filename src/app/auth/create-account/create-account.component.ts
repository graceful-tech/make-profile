declare var google: any;
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Lookup } from 'src/app/models/master/lookup.model';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { environment } from 'src/environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';


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
  error!: string;
  isReference = false;

  constructor(private fb: FormBuilder,
    private api: ApiService,
    private gs: GlobalService,
    private deviceDetectorService: DeviceDetectorService,
    private router: Router,
    private route: ActivatedRoute) { }


  ngOnInit() {
    this.createRegisterForm();
    const hash = window.location.hash;
    const queryString = hash.includes('?') ? hash.split('?')[1] : '';
    const params = new URLSearchParams(queryString);
    const referenceCode = params.get('reference');

    if (referenceCode) {
      console.log(referenceCode)
      this.createAccountForm.get('reference')?.setValue(referenceCode);
      this.isReference = true;
    }
    // this.getCountries();
  }


  createRegisterForm() {
    this.createAccountForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      reference: [{ value: '', disabled: false }]
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
          this.gs.openLogin('Success', 'Your Acoount Created Successfully');
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

  openLogin() {
    this.router.navigate(['/login']);
  }

  onGoogleLogin() {
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




}
