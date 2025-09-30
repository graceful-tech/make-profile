import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-error-mobile-popup',
  standalone: false,
  templateUrl: './error-mobile-popup.component.html',
  styleUrl: './error-mobile-popup.component.css'
})
export class ErrorMobilePopupComponent {
   @Output() closePopupTap = new EventEmitter<any>();
   @Input() message: string = ''; 
    @Input() status: string = ''; 

  isClosing = false;

  constructor(
     
      private router: Router,
      public ref: DynamicDialogRef,
      private config: DynamicDialogConfig
    ) {
    }
  


  close() {
    this.closePopupTap.emit('hai');
    this.isClosing = false;
  }

  change_template(){
     this.closePopupTap.emit('hai');
     this.router.navigate(['mob-candidate/choose-Template']);
  }
}
