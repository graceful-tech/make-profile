import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

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
  this.router.navigate(['candidate/template'])
  }

}
