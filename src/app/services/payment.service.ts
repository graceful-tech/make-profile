import { Injectable, NgZone } from '@angular/core';
import { ApiService } from './api.service';
import { GlobalService } from './global.service';
import { WindowRefService } from './window-ref.service';

declare var Razorpay: any;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  razorPayOptions: any;
  customerDetails: any;
  paymentType!: string;
  paymentOrderId!: number;
  statementId!: number;
  amount!: number;
  candidateId: any;
  candidates: any;
  status:any;
  userId:any;

  constructor(private winRef: WindowRefService, private api: ApiService, private gs: GlobalService, private zone: NgZone) {
    // this.gs.candidateId$.subscribe(response => {
    //   this.candidates = response;
    // });

    const userIds = sessionStorage.getItem('userId');
    this.userId=userIds;
  }

  payOnAccountCreation(customerDetails: any) {
    this.amount = 100;
    this.initRazorPay();
    const route = 'payment-orders';
    const postData = { amount: this.amount };
    this.api.create(route, postData).subscribe({
      next: response => {
        const orderId = response.orderId;
        this.paymentOrderId = response.id;
        this.razorPayOptions['order_id'] = orderId;
        this.razorPayOptions.prefill['name'] = customerDetails?.name;
        this.razorPayOptions.prefill['email'] = customerDetails?.email;
        this.razorPayOptions.prefill['contact'] = customerDetails?.mobileNumber;

        var rzp1 = new Razorpay(this.razorPayOptions);
        rzp1.open();
        rzp1.on('payment.failed', (response: any) => {
          this.zone.run(() => {
            const payload = {
              customerId: this.customerDetails.id,
              orderId: response?.error?.metadata?.order_id,
              paymentId: response?.error?.metadata?.payment_id,
              paymentOrderId: this.paymentOrderId,
           //   paymentType: this.paymentType,
              statementId: this.statementId,
              amount: this.amount,
              paymentStatus: 'Failed',
            }
            this.savePayment(payload);
          });
        });
      },
      error: error => { }
    });
  }

  payWithRazorPay(amount: number){
    const userIds = sessionStorage.getItem('userId');
    this.userId=userIds;
    
    this.amount = amount / 100;
    this.initRazorPay();
   

    const route = 'payment/generate-order';
    const postData = { amount: amount, userId: userIds };
    this.api.create(route, postData).subscribe({
      next: response => {
        const orderId = response.orderId;
        this.paymentOrderId = response.id;
      // this.candidateId = response.candiateId;
        this.userId= response.userId
        this.razorPayOptions['order_id'] = orderId;
        this.razorPayOptions.prefill['name'] = this.candidates?.name;
        this.razorPayOptions.prefill['email'] = this.candidates?.email;
        this.razorPayOptions.prefill['contact'] = this.candidates?.mobileNumber;

        var rzp1 = new Razorpay(this.razorPayOptions);
        rzp1.open();
        rzp1.on('payment.failed', (response: any) => {
          const payload = {
            userId:this.userId,
            orderId: response?.error?.metadata?.order_id,
            paymentId: response?.error?.metadata?.payment_id,
            paymentOrderId: this.paymentOrderId,
         // paymentType: paymentType,
            amount: this.amount,
            paymentStatus: 'Failed',
          }
          this.savePayment(payload);
        });
      },
      error: error => { }
    });
  }

  initRazorPay() {
    this.razorPayOptions = {
      key: 'rzp_test_RIGcQeTSoyI0qg',
      currency: 'INR',
      name: 'Make Profile',
      description: '',
      order_id: '',
      modal: {
        escape: false,
        ondismiss: (response: any) => { },
      },
      prefill: {
        name: '',
        email: '',
        contact: '',
      },
      theme: {
        color: '#3399cc',
      },
      handler: (response: any) => {
        this.zone.run(() => {
          const payload = {
            userId:this.userId,
            orderId: response?.razorpay_order_id,
            paymentId: response?.razorpay_payment_id,
            paymentOrderId: this.paymentOrderId,
           //  paymentType: this.paymentType,
            amount: this.amount,
            paymentStatus: 'Completed',
          }
          this.savePayment(payload);
        });
      }
    };
  }

  savePayment(payload: any) {
    const route = 'payment/save';
   // payload['userId'] = localStorage.getItem('candidateId');
    this.api.create(route, payload).subscribe({
      next: response => {
         this.gs.setPaymentStatus(payload?.paymentStatus);
      },
      error: error => { 

      }
    });
  }

  addMoneyToWallet(amount: number) {
    const paymentType = 'ADD_MONEY_TO_WALLET';
  //  this.payWithRazorPay(amount, paymentType);
  }


  
  

  getCandidateById(candidateId:any) {
    
    const route = `candidate/${candidateId}`;

    this.api.get(route).subscribe({
      next: (response) => {
       this.candidates = response
      },
    });
  }
  

}
