import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
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
export class PaymentOptionComponent  {
  balanceCredits: number = 0;
  candidateId: any;
  credits: any;
  candidates: Array<Candidate> = [];
  userId:any;
  isUploading:boolean=false;
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
    private ps: PaymentService,
    private ngxLoader: NgxUiLoaderService
  ) {
    this.candidates = this.config.data?.candidates;
    this.candidateId = this.config.data?.candidateId;
    this.resumeName = this.config.data?.resumeName;

     const userId =   sessionStorage.getItem('userId')

     this.userId = userId;
  }

  ngOnInit() {
   
  }

  
  async payRupees() {
    const amount = 1 * 100;
    const paymentType = 'Resume';
  
    //  this.ps.initRazorPays(() => {
       
    //   this.redeem();
    // });
    // this.ps.payWithRazorPay(amount);
   
    //remove after the tesing
    this.createResume();

   // this.ref.close();

  }
  
  redeem() {
    //const route = `credits?userId=${this.userId}`;
    this.ngxLoaderStart();
    const route = 'credits/redeem'
    const payload ={
      userId:this.userId
    }

    this.api.retrieve(route,payload).subscribe({
      next: (response) => {
        this.credits = response as any;
        if(this.credits){
            this.createResume();
        }
        else{
          this.gs.showMessage('error','You dont have credits');
        }
      },
      error: (error) => {
        this.ngxLoaderStop();
        this.gs.showMessage('error','Error in  creating Resume')

      },
    });
  }

  createResume() {
    const route = 'resume/create';
    const candidateId = localStorage.getItem('candidateId');
    
    const payload = {
      ...this.candidates,
      resumeFormatName: this.resumeName,
    };

    
    
     this.api.retrieve(route, payload).subscribe({
      next: (response) => {
        this.ngxLoaderStop();
        this.gs.showMessage('Success','your resume is created successfully')
      },
      error: (error) => {
        this.ngxLoaderStop();
        this.gs.showMessage('error','Error in creating Resume')

      },

    });
  }

  ngxLoaderStop(){
    this.ngxLoader.stop();  
    setTimeout(() => {
      this.isUploading = false;
    }, 2000);
  }

  ngxLoaderStart(){
      this.isUploading = true;
      this.ngxLoader.start();
   }

}
