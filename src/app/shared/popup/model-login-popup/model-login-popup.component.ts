import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-model-login-popup',
  standalone: false,
  templateUrl: './model-login-popup.component.html',
  styleUrl: './model-login-popup.component.css'
})
export class ModelLoginPopupComponent {
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
    this.ref.close('success');
  }
}
