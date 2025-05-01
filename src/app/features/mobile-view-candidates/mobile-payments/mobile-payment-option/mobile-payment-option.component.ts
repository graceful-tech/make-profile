import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {DialogService,DynamicDialogConfig,DynamicDialogRef,} from 'primeng/dynamicdialog';
import { Candidate } from 'src/app/models/candidates/candidate.model';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';

import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-mobile-payment-option',
  standalone: false,
  templateUrl: './mobile-payment-option.component.html',
  styleUrl: './mobile-payment-option.component.css'
})
export class MobilePaymentOptionComponent {
 balanceCredits: number = 0;
  candidateId: any;
  credits: any;
  candidates: Array<Candidate> = [];
  candidatesUpdateData: any;
  candidateImageUrl: any;
  resumeName: any;
  

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
    
  }

  ngOnInit() {
 
    this.gs.candidateDetails$.subscribe(response => {
      this.candidatesUpdateData = response;
    });

    if(this.candidatesUpdateData !== null && this.candidatesUpdateData !== undefined){
       this.candidateId = this.candidatesUpdateData?.id;
       this.candidates = this.candidatesUpdateData;
    }

    this.gs.candidateImage$.subscribe(response =>{
      if(response !== null){
      this.candidateImageUrl = response
      }
    })

    this.gs.resumeName$.subscribe(response =>{
      this.resumeName = response
    })

  }

  async payRupees() {
    const amount = 1 * 100;
    const paymentType = 'Resume';
    const status =   this.ps.payWithRazorPay(amount);
    this.createResume();  
  }
  
  

  redeem() {
    
    const route = 'credits/redeem';

    const userIds = sessionStorage.getItem('userId');
    const  payload = {
      userId:userIds
    }
    this.api.retrieve(route,payload).subscribe({
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

  goBack(){
    this.gs.setCandidateDetails(this.candidates);
      if(this.candidateImageUrl !== null){
      this.gs.setCandidateImage(this.candidateImageUrl);
      }
      this.gs.setResumeName(this.resumeName);
    this.router.navigate(['mob-candidate/edit-candidate']);
  }

  goToCandidatepage(){
    this.gs.setCandidateDetails(this.candidates);
      if(this.candidateImageUrl !== null){
      this.gs.setCandidateImage(this.candidateImageUrl);
      }
    this.router.navigate(['mob-candidate']);
  }
}
