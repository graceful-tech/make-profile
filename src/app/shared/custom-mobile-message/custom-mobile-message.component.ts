import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-custom-mobile-message',
  standalone: false,
  templateUrl: './custom-mobile-message.component.html',
  styleUrl: './custom-mobile-message.component.css'
})
export class CustomMobileMessageComponent {

  message!: String;
  templateName: any;
  nickName:any
  
    constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig,private ps: PaymentService,) { }
  
    ngOnInit() {
      this.message = this.config.data?.message;
      this.templateName = this.config.data?.templateName;
      this.nickName = this.config.data?.nickName;

    }
  
    close() {
      this.ref.close();
    }

    addCredits(){

   const confirmedAmount = prompt("Enter final amount in ₹", "10");

  const amountNum = Number(confirmedAmount);

   if (!isNaN(amountNum) && Number.isInteger(amountNum) && amountNum >= 10) {
    const amount = amountNum * 100;  
    const paymentType = 'Resume';

    this.ps.initRazorPays(() => {

      setTimeout(()=>{
        window.location.href = window.location.href;
      },2000);
      
    });

     //this.ps.payWithRazorPay(amount, this.templateName);
     this.ps.payWithRazorNewPay(amount, this.templateName,this.nickName);

  } else {
    alert("Please enter a valid amount ₹10 or more.");
  }

  this.close();
  }
  
}
