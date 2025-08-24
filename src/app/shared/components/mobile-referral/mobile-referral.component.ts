import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mobile-referral',
  standalone: false,
  templateUrl: './mobile-referral.component.html',
  styleUrl: './mobile-referral.component.css'
})
export class MobileReferralComponent implements OnInit {
 userName!: string;
 referralCode: any;
  referralLink: any;

  constructor(private deviceDetectorService: DeviceDetectorService) {
    const username = sessionStorage.getItem('userName');
    if (username !== null && username !== undefined) {
      this.userName = username;
    }
  }

  ngOnInit() {
    this.generateReferral();
  }

  generateReferral() {
    const restUrl = environment.restUrl;
    const isMobile = this.deviceDetectorService.isMobile();
    const baseUrl = window.location.origin;
    const redirectUri = isMobile
      ? `${baseUrl}/#/mob-login/mob-create`
      : `${baseUrl}/#/create-account`;

    this.referralCode =redirectUri+'?reference=' + this.userName;
    this.referralLink =this.referralCode;
  }

  copyValue: string = 'Copy';

  openWhatsApp() {
    const message = `Hey! Join this app and earn rewards 🎁. Use my referral code ${this.userName}. Link: ${this.referralLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  copyReferralCode() {
    navigator.clipboard.writeText(this.referralCode).then(() => {
      this.copyValue = 'Copied';
    });
  }
}

