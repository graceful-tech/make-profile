import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: false,
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.css'
})
export class ErrorMessageComponent {

   @Output() closePopupTap = new EventEmitter<any>();
   @Input() message: string = ''; 
    @Input() status: string = ''; 

  isClosing = false;
  


  close() {
    this.closePopupTap.emit('hai');
    this.isClosing = false;
  }

}
