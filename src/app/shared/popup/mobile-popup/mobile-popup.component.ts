import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/services/api.service';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mobile-popup',
  standalone: false,
  templateUrl: './mobile-popup.component.html',
  styleUrl: './mobile-popup.component.css'
})
export class MobilePopupComponent {
  message!: String;
  userName: any;
  password: any;
  mobileNumber: string = '';
  email: string = '';
  showError: boolean = false;


  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private router: Router,
    private deviceDetectorService: DeviceDetectorService,
    private api: ApiService,
    private toast: ToastService
  ) {

    this.mobileNumber = config?.data?.mobileNumber || '';
    this.email = config?.data?.email || '';

  }


  closePopup() {
    this.router.navigate(['mob-candidate/edit-candidate']);
    this.ref.close();
  }

  onGoogleSignup() {
    const restUrl = environment.restUrl;
    const isMobile = this.deviceDetectorService.isMobile();
    const baseUrl = window.location.origin;
    const redirectUri = isMobile
      ? `${baseUrl}/#/mob-candidate`
      : `${baseUrl}/#/candidate`;

    document.cookie = `password_flag=false; path=/`;
    document.cookie = `email=${this.email}; path=/`;
    document.cookie = `redirect_uri=${encodeURIComponent(redirectUri)}; path=/`;
    const hash = window.location.hash; // "#/mob-login/mob-create?reference=mycoupen"
    const queryString = hash.split('?')[1]; // "reference=mycoupen"
    if (queryString) {
      const params = new URLSearchParams(queryString);
      const reference = params.get('reference');
      if (reference) {
        document.cookie = `reference=${encodeURIComponent(reference)}; path=/`;
      }
    }
    const url = `${restUrl}/oauth2/authorization/google`;
    window.location.href = url;
  }

  updatePassword() {

    if (this.password?.trim().length > 2) {
      const mobile = sessionStorage.getItem('mobileNumber');

      const route = 'user/update_password'

      const payload = {
        mobileNumber: mobile,
        password: this.password
      }

      this.api.update(route, payload).subscribe({
        next: (response) => {

          sessionStorage.setItem('updatePassword', 'true');
          // this.router.navigate(['mob-candidate']);
          this.toast.showToast('success', 'Password Updated Successfully');
          this.ref.close('success');
        },
        error: (err) => {
          console.error('Error updating user:', err);
          alert('Failed to update user.');
        }
      });
    }
    else {
      this.showError = true;
    }
  }
}
