import { Component, EventEmitter, Output } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-mobile-confirmation-popup',
  standalone: false,
  templateUrl: './mobile-confirmation-popup.component.html',
  styleUrl: './mobile-confirmation-popup.component.css'
})
export class MobileConfirmationPopupComponent {
  @Output() proceedToDownload = new EventEmitter<any>();
  @Output() editContent = new EventEmitter<any>();
  @Output() closePopup = new EventEmitter<any>();
  @Output() changeTemplate = new EventEmitter<any>();


  stillDownload() {
    this.proceedToDownload.emit('hai');
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
