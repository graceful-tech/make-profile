declare var google: any;
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
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

  // @ViewChild('googleImage') googleImage!: ElementRef;

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

    // ngAfterViewInit(): void {
    //   google.accounts.id.initialize({
    //     client_id: '763124424966-6n5res8rbmhnmshnqvjnv7t2kkbnleib.apps.googleusercontent.com',
    //     callback: (resp: any) => this.handleLogin(resp)
    //   });
    // }
    
   

  ngOnInit() {
    this.createRegisterForm();
    // this.getCountries();

    google.accounts.id.initialize({
      client_id: '763124424966-6n5res8rbmhnmshnqvjnv7t2kkbnleib.apps.googleusercontent.com',
      callback: (resp: any) => this.handleLogin(resp)
    })


 
    // google.accounts.id.initialize({
    //   client_id: '763124424966-6n5res8rbmhnmshnqvjnv7t2kkbnleib.apps.googleusercontent.com',
    //   callback: (resp: any) => this.handleLogin(resp)  // Custom callback for handling the login response
    //    });
    
    // // Attach click event listener to the custom button
    // document.getElementById('google-btn')?.addEventListener('click', () => {
    //   // Redirect to your OAuth2 login URL
    //   window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    // });
}
  

  createRegisterForm() {
    this.createAccountForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      userName:['',Validators.required],
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

  onGoogleLogin(){
    // Initialize Google OAuth
    // google.accounts.id.initialize({
    //   client_id: '763124424966-6n5res8rbmhnmshnqvjnv7t2kkbnleib.apps.googleusercontent.com',
    //   callback: (resp: any) => this.handleLogin(resp)  // Your custom callback
    // });
  
    // Redirect to your OAuth2 login URL
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }
  


  // onGoogleLogin(): void {
  //   google.accounts.id.initialize({
  //     client_id: '763124424966-6n5res8rbmhnmshnqvjnv7t2kkbnleib.apps.googleusercontent.com',
  //     callback: (resp: any) => this.handleLogin(resp)
  //   })
  //    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  // }

  // Initialize the Google Accounts SDK
  


  // onGoogleLogin() {
  //   // On click, directly open Google Login popup
  //   google.accounts.id.prompt();
  // }
  private decodeToken(token: String) {
    return JSON.parse(atob(token.split(".")[1]));
  }

  handleLogin(response: any) {
    console.log(response)
    if (response) {
      const token = response.credential;
      const payload = this.decodeToken(token);
      const email = payload.email;
      const name = payload.name;

      const dataToSend = {
        name: name,
        email: email,
        signInAccess: 'google'
      };
      this.api.createGoogleUser('auth/google-login', dataToSend).subscribe({
        next: (res: any) => {
          sessionStorage.setItem('authType', 'google');
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('userName', res.name);
          sessionStorage.setItem('userId', res.id);

          this.router.navigate(['/candidate']);
        },
        error: (err) => {
          console.error('Login failed:', err);

        }
      });
    }
  }





}
