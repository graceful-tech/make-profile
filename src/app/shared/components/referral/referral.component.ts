import { Component } from '@angular/core';

@Component({
  selector: 'app-referral',
  standalone: false,
  templateUrl: './referral.component.html',
  styleUrl: './referral.component.css'
})
export class ReferralComponent {

  copyValue : string ='Copy';


  referralCode: string = "ABC123";  
  referralLink: string = "https://yourapp.com/signup?ref=ABC123";

  openWhatsApp() {
    const message = `Hey! Join this app and earn rewards 🎁. Use my referral code ${this.referralCode}. Link: ${this.referralLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  copyReferralCode() {
    navigator.clipboard.writeText(this.referralCode).then(() => {
      this.copyValue = 'Copied'
    });
  }

}
