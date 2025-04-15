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

  constructor(private winRef: WindowRefService, private api: ApiService, private gs: GlobalService, private zone: NgZone) {
    this.gs.candidateId$.subscribe(response => {
      this.candidates = response;
    });
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

  payWithRazorPay(amount: number,candidateId:any){
    this.amount = amount / 100;
   // this.paymentType = paymentType;
    this.initRazorPay();
    this.getCandidateById(candidateId);
    
    const route = 'payment/generate-order';
    const postData = { amount: amount, candidateId: candidateId };
    this.api.create(route, postData).subscribe({
      next: response => {
        const orderId = response.orderId;
        this.paymentOrderId = response.id;
        this.candidateId = response.candiateId;
        this.razorPayOptions['order_id'] = orderId;
        this.razorPayOptions.prefill['name'] = this.candidates?.name;
        this.razorPayOptions.prefill['email'] = this.candidates?.email;
        this.razorPayOptions.prefill['contact'] = this.candidates?.mobileNumber;

        var rzp1 = new Razorpay(this.razorPayOptions);
        rzp1.open();
        rzp1.on('payment.failed', (response: any) => {
          const payload = {
            //customerId: this.customerDetails.id,
            candidateId: this.candidates.id,
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
      key: 'rzp_live_dZo8UMBHgAcaDU',
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
            candidateId: this.candidates.id,
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
    payload['candidateId'] = localStorage.getItem('candidateId');
    this.api.create(route, payload).subscribe({
      next: response => {
         this.gs.setPaymentStatus(payload?.paymentStatus);
      },
      error: error => { }
    });
  }

  addMoneyToWallet(amount: number) {
    const paymentType = 'ADD_MONEY_TO_WALLET';
  //  this.payWithRazorPay(amount, paymentType);
  }


  payWithRazorPays(amount: number, candidateId: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.amount = amount / 100;
      this.initRazorPay();
      this.getCandidateById(candidateId);
  
      const route = 'payment/generate-order';
      const postData = { amount: amount, candidateId: candidateId };
  
      this.api.create(route, postData).subscribe({
        next: response => {
          const orderId = response.orderId;
          this.paymentOrderId = response.id;
          this.candidateId = response.candiateId;
  
          this.razorPayOptions['order_id'] = orderId;
          this.razorPayOptions.prefill['name'] = this.candidates?.name;
          this.razorPayOptions.prefill['email'] = this.candidates?.email;
          this.razorPayOptions.prefill['contact'] = this.candidates?.email;
  
          
          this.razorPayOptions.handler = (response: any) => {
            this.zone.run(() => {
              const payload = {
                candidateId: this.candidates.id,
                orderId: response?.razorpay_order_id,
                paymentId: response?.razorpay_payment_id,
                paymentOrderId: this.paymentOrderId,
                amount: this.amount,
                paymentStatus: 'Completed',
              };
              this.savePayment(payload);
              resolve(true);
            });
          };
  
          const rzp1 = new Razorpay(this.razorPayOptions);
  
          rzp1.on('payment.failed', (response: any) => {
            const payload = {
              candidateId: this.candidates.id,
              orderId: response?.error?.metadata?.order_id,
              paymentId: response?.error?.metadata?.payment_id,
              paymentOrderId: this.paymentOrderId,
              amount: this.amount,
              paymentStatus: 'Failed',
            };
            this.savePayment(payload);
            resolve(false);
          });
  
          rzp1.open();
        },
        error: error => {
          resolve(false);
        }
      });
    });
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
