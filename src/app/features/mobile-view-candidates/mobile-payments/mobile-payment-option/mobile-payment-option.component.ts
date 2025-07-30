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
  templateName:any;
  planetImagePath: any;
  userId:any;
  nickName:any;
  

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
      this.templateName = response
    })

    this.gs.candidateDetails$.subscribe(response => {
      this.candidates = response;
    });
  }

  ngOnInit() {
     if(this.templateName === null || this.templateName === undefined){
      this.templateName = localStorage.getItem('templateName')
    }
      this.planetImagePath ='./assets/img/'+this.templateName+'.png';
      this.getCandidates();
      this.getAvailableCredits();
  } 


 async payRupees() {
  const confirmedAmount = prompt("Enter final amount in ₹", "10");

  const amountNum = Number(confirmedAmount);

   if (!isNaN(amountNum) && Number.isInteger(amountNum) && amountNum >= 10) {
    const amount = amountNum * 100;  
    const paymentType = 'Resume';

    this.ps.initRazorPays(() => {
      setTimeout(() => {

        // this.redeem();
        this.saveNickName();

      }, 2000);
    });

    this.ps.payWithRazorPay(amount, this.templateName);
  } else {
    alert("Please enter a valid amount ₹10 or more.");
  }
}


    redeem() {
    this.ngxLoaderStart();
    const route = 'credits/redeem';

    if(this.templateName === null || this.templateName === undefined){
      this.templateName = localStorage.getItem('templateName')
    }

    const userIds = sessionStorage.getItem('userId');
    const  payload = {
      userId:userIds,
      templateName:this.templateName
     
    }
    this.api.retrieve(route,payload).subscribe({
      next: (response) => {
        this.credits = response as any;
        if( this.credits){
          this.gs.setResumeName(this.templateName);
          this.gs.setCandidateDetails(this.candidates);
          // this.createResume();
          this.router.navigate(['/mob-candidate/final-verify']);

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
   if(this.templateName === null || this.templateName === undefined){
     this.templateName = templateName;
    }
    const payload = {...this.candidates,templateName: this.templateName};

    this.api.retrieve(route,payload).subscribe({
      next: (response) => {
        this.ngxLoaderStop();
                  if (response.resumePdf) {
         const base64String = response.resumePdf.trim();  
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Create a link element and trigger download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = (response.candidateName || 'resume') + '.pdf';
        document.body.appendChild(a);
        a.click();

        // Clean up
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        window.alert('Your resume is created successfully');
        localStorage.removeItem('resumeName');
        this.ngxLoaderStop();
      }
          this.ngxLoaderStop();
      },
      error: (err) => {
         window.alert('Error in creating Resume');
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
    // this.ngxLoader.stop();  
    setTimeout(() => {
      this.isUploading = false;
    }, 2000);
  }

  ngxLoaderStart(){
      this.isUploading = true;
      // this.ngxLoader.start();
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

    getAvailableCredits() {
       if(this.templateName === null || this.templateName === undefined){
      this.templateName = localStorage.getItem('templateName')
    }
        const userId = sessionStorage.getItem('userId');

     const route = `credits/get-available-credits?templateName=${this.templateName}&userId=${userId}`;

    this.api.get(route).subscribe({
      next: (response) => {
        this.balanceCredits = response as any;

        const balance = response
      },
    });
  }


  goToOpenAi(){

      this.isUploading = true

    const route = 'resume/get-content';
    const payload = {...this.candidates};

     this.api.retrieve(route, payload).subscribe({
      next: (response:any) => {

        if(response){
        const responseCandidate =  response as Candidate;
           this.isUploading = false
        }
              this.isUploading = false
      },
      error: (error) => {
          this.isUploading = false
        this.gs.showMessage('error', error.error?.message)

      },

    });
    
  }

  saveNickName(){
  const route = "credits/save-nickname"
  const formData = new FormData();

   this.userId = sessionStorage.getItem('userId');
  this.nickName = localStorage.getItem('nickName');

  formData.append('nickName', this.nickName);
  formData.append('userId', this.userId);
  formData.append('templateName', this.templateName);

   this.api.upload(route,formData).subscribe({
      next: (response) => {
         
       this.redeem();
      },
      error: (error) => {
        this.ngxLoaderStop();
        this.gs.showMessage('error','Error in  creating Resume')
      },
    });

}
  

}
