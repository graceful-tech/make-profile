import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-login-popup',
  standalone: false,
  templateUrl: './error-login-popup.component.html',
  styleUrl: './error-login-popup.component.css'
})
export class ErrorLoginPopupComponent {
   @Output() closePopupTap = new EventEmitter<any>();
   @Input() message: string = ''; 
    @Input() status: string = ''; 

  isClosing = false;
  


  close() {
    this.closePopupTap.emit('hai');
    this.isClosing = false;
  }


}
