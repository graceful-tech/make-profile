import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
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
  candidates: any;
  candidatesUpdateData: any;
  candidateImageUrl: any;
  resumeName: any;
  availableCredits: any;
  isUploading:boolean=false;
  

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
     this.gs.resumeName$.subscribe(response =>{
      this.resumeName = response
    })
  }

  ngOnInit() {
      this.getCandidates();
  } 
 
  

  async payRupees() {
    const amount = 1 * 100;
    const paymentType = 'Resume';
    
    this.ps.initRazorPays(() => {
       
      this.redeem();
    });
    this.ps.payWithRazorPay(amount);
    this.ref.close();
  }
  
  

    redeem() {
    this.ngxLoaderStart();
    const route = 'credits/redeem';

    const userIds = sessionStorage.getItem('userId');
    const  payload = {
      userId:userIds
    }
    this.api.retrieve(route,payload).subscribe({
      next: (response) => {
        this.credits = response as any;
        if( this.credits){
          
          this.createResume();
        }
        else{
          this.ngxLoaderStop();
          window.alert('Please pay to create the resume')
        }
      },
    });
  }

  createResume() {
    this.ngxLoaderStart();
    const route = 'resume/create';

  const templateName =  localStorage.getItem('templateName');
  if(this.resumeName === null){
     this.resumeName = templateName;
    }
    const payload = {...this.candidates,templateName: this.resumeName,};

    this.api.retrieve(route,payload).subscribe({
      next: (response) => {
        this.ngxLoaderStop();
      },
      error: (err) => {
        this.ngxLoaderStop();
      }
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

  handleRedeemClick(event: Event): void {
    console.log('keerthi')
    if (this.balanceCredits === 0) {
      this.redeem();
    } else {
      event.preventDefault();
    }
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

   getCandidates() {
      const route = 'candidate';
      this.api.get(route).subscribe({
        next: (response) => {
          const candidate = response as Candidate;
          if(candidate !== null){
            this.candidateId =  candidate?.id
            this.candidates = candidate;
        }
        },
      });
    }

}
