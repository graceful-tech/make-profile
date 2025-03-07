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

  constructor(private winRef: WindowRefService, private api: ApiService, private gs: GlobalService, private zone: NgZone) {
    this.gs.customer$.subscribe(response => {
      this.customerDetails = response;
    })
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
              paymentType: this.paymentType,
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

  payWithRazorPay(amount: number, paymentType: string) {
    this.amount = amount / 100;
    this.paymentType = paymentType;
    this.initRazorPay();
    const route = 'payment/generate-order';
    const postData = { amount: amount, tenant: localStorage.getItem('tenant') };
    this.api.create(route, postData).subscribe({
      next: response => {
        const orderId = response.orderId;
        this.paymentOrderId = response.id;
        this.razorPayOptions['order_id'] = orderId;
        this.razorPayOptions.prefill['name'] = this.customerDetails?.name;
        this.razorPayOptions.prefill['email'] = this.customerDetails?.email;
        this.razorPayOptions.prefill['contact'] = this.customerDetails?.mobileNumber;

        var rzp1 = new Razorpay(this.razorPayOptions);
        rzp1.open();
        rzp1.on('payment.failed', (response: any) => {
          const payload = {
            customerId: this.customerDetails.id,
            orderId: response?.error?.metadata?.order_id,
            paymentId: response?.error?.metadata?.payment_id,
            paymentOrderId: this.paymentOrderId,
            paymentType: paymentType,
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
      name: 'Hurecom',
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
            customerId: this.customerDetails.id,
            orderId: response?.razorpay_order_id,
            paymentId: response?.razorpay_payment_id,
            paymentOrderId: this.paymentOrderId,
            paymentType: this.paymentType,
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
    payload['tenant'] = localStorage.getItem('tenant');
    this.api.create(route, payload).subscribe({
      next: response => {
         this.gs.setPaymentStatus(payload?.paymentStatus);
      },
      error: error => { }
    });
  }

  addMoneyToWallet(amount: number) {
    const paymentType = 'ADD_MONEY_TO_WALLET';
    this.payWithRazorPay(amount, paymentType);
  }

}
