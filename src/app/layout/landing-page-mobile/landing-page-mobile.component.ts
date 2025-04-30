declare var google: any;
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-landing-page-mobile',
  standalone: false,
  templateUrl: './landing-page-mobile.component.html',
  styleUrl: './landing-page-mobile.component.css'
})
export class LandingPageMobileComponent {



  constructor(private fb: FormBuilder, private api: ApiService, private gs: GlobalService, private router: Router,
    private dialog: DialogService, private route: ActivatedRoute,) { }

  ngOnInit() {
    google.accounts.id.initialize({
      client_id: '763124424966-6n5res8rbmhnmshnqvjnv7t2kkbnleib.apps.googleusercontent.com',
      callback: (resp: any) => this.handleLogin(resp)
    })
    google.accounts.id.renderButton(document.getElementById("google-btn"), {
      theme: 'filled_blue',
      size: 'large',
      shape: 'pill',
      width: 50
    })
  }

  candidate() {
    this.router.navigate(['/candidates'],
      { relativeTo: this.route });
  }

  goToLoginPage() {
    this.router.navigate(['/mobile-login']);
  }

  // loginWithGoogle() {
  //   window.location.href = '${environment.restUrl}/oauth2/authorization/google';

  // }
  private decodeToken(token: String) {
    return JSON.parse(atob(token.split(".")[1]));
  }

  handleLogin(response: any) {
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
          console.log(res)
          // Success - set session storage
          sessionStorage.setItem('authType', 'google');
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('userName', res.name);
          sessionStorage.setItem('userId', res.id);

          this.router.navigate(['/mob-candidate']);
        },
        error: (err) => {
          console.error('Login failed:', err);

        }
      });
    }
  }

}
