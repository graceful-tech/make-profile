import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-mobile-error-login-popup',
  standalone: false,
  templateUrl: './mobile-error-login-popup.component.html',
  styleUrl: './mobile-error-login-popup.component.css'
})
export class MobileErrorLoginPopupComponent {
  @Output() closePopupTap = new EventEmitter<any>();
   @Input() message: string = ''; 
    @Input() status: string = ''; 

  isClosing = false;
  


  close() {
    this.closePopupTap.emit('hai');
    this.isClosing = false;
  }

}
