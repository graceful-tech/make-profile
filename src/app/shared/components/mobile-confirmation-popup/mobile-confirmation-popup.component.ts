import { Component, EventEmitter, Output } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-mobile-confirmation-popup',
  standalone: false,
  templateUrl: './mobile-confirmation-popup.component.html',
  styleUrl: './mobile-confirmation-popup.component.css'
})
export class MobileConfirmationPopupComponent {
  @Output() closePopupTap = new EventEmitter<any>();
  @Output() editContent = new EventEmitter<any>();


  stillDownload() {
    this.closePopupTap.emit('hai');
  }

  EditContent() {
    this.editContent.emit('hai');
  }
}
