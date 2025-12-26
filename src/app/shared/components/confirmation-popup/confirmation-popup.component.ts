import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-popup',
  standalone: false,
  templateUrl: './confirmation-popup.component.html',
  styleUrl: './confirmation-popup.component.css'
})
export class ConfirmationPopupComponent {

  @Output() closePopupTap = new EventEmitter<any>();
  @Output() editContent = new EventEmitter<any>();
  @Output() closePopup = new EventEmitter<any>();
  @Output() changeTemplate = new EventEmitter<any>();


  stillDownload() {
    this.closePopupTap.emit('hai');
  }

  EditContent() {
    this.editContent.emit('hai');
  }

   ClosePopup() {
     this.closePopup.emit('close');
   }
   ChangeTemplate() {
     this.changeTemplate.emit('close');
   }
}
