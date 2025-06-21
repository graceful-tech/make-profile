import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-mobile-message',
  standalone: false,
  templateUrl: './mobile-message.component.html',
  styleUrl: './mobile-message.component.css'
})
export class MobileMessageComponent {

   message!: String;
  
    constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }
  
    ngOnInit() {
      this.message = this.config.data?.message;
    }
  
    close() {
      this.ref.close();
    }
}
