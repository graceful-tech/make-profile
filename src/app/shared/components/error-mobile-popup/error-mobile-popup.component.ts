import { Component, EventEmitter, Input, Output } from '@angular/core';

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
  


  close() {
    this.closePopupTap.emit('hai');
    this.isClosing = false;
  }
}
