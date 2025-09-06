import { Component, EventEmitter, Output } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-custom-mobile-message',
  standalone: false,
  templateUrl: './custom-mobile-message.component.html',
  styleUrl: './custom-mobile-message.component.css',
})
export class CustomMobileMessageComponent {
  @Output() valueSent = new EventEmitter<any>();
  @Output() closePopup = new EventEmitter<any>();

  message!: String;
  templateName: any;
  nickName: any;
  amountInput: number = 10;
  showPopup: boolean = false;
  isClosing = false;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private ps: PaymentService
  ) {}

  ngOnInit() {}

  addCredits() {
    const amountNum = Number(this.amountInput);

    if (!isNaN(amountNum) && Number.isInteger(amountNum) && amountNum >= 10) {
      const amount = amountNum * 100;

      this.ps.initRazorPays(() => {
        setTimeout(() => {
          this.valueSent.emit('hai');
        }, 1500);
      });

      this.ps.payWithRazorPay(amount);
    } else {
      alert('Please enter a valid amount ₹10 or more.');
    }
  }

  close() {
    this.closePopup.emit('hai');
    this.isClosing = false;
  }
}
