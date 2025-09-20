import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

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

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private router: Router
  ) {
    if (config.data) {
      this.userName = config.data.userName || '';
      this.password = config.data.password || '';
    }
  }


  closePopup() {
    this.router.navigate(['mob-candidate/choose-Template']);
    this.ref.close();
  }
}
