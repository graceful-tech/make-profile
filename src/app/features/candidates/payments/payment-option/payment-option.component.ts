import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Candidate } from 'src/app/models/candidates/candidate.model';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';

import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment-option',
  standalone: false,
  templateUrl: './payment-option.component.html',
  styleUrl: './payment-option.component.css',
})
export class PaymentOptionComponent {
  balanceCredits: number = 0;
  candidateId: any;
  credits: any;
  candidates: Array<Candidate> = [];
  

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private gs: GlobalService,
    private datePipe: DatePipe,
    private dialog: DialogService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private ps: PaymentService
  ) {
    this.candidates = this.config.data?.candidates;
    this.candidateId = this.config.data?.candidateId;
  }

  ngOnInit() {}

  async payRupees() {
    const amount = 1 * 100;
    const paymentType = 'Resume';
  
   // const status =   this.ps.payWithRazorPay(amount, this.candidateId);
    this.ref.close();
      this.createResume();  
  }
  
  

  redeem() {
    const route = `credits?candidateId=${this.candidateId}`;

    this.api.get(route).subscribe({
      next: (response) => {
        this.credits = response as any;
      },
    });
  }

  createResume() {
    const route = 'resume/create';
    const candidateId = localStorage.getItem('candidateId');
    
    const payload = this.candidates;
    
    this.api.retrieve(route, payload).subscribe({
      next: (response) => {


      },
    });
  }
}
