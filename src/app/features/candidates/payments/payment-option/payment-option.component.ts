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
import { ResumeCreatingComponent } from '../../resume-creating/resume-creating.component';

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
  templateName:any;
  planetImagePath:any;
  availableCredits:any;
  generating:boolean=false;
  nickName: any;
  

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
    this.templateName = this.config.data?.resumeName;
    this.nickName = this.config.data?.nickName;

    const userId =   sessionStorage.getItem('userId')

    this.userId = userId;
    
  }

  ngOnInit() {
   this.planetImagePath ='./assets/img/'+this.templateName+'.png';
   this.getAvailableCredits(this.templateName,this.userId)
  }

  
  async payRupees() {
  const confirmedAmount = prompt("Enter final amount in ₹", "10");

  const amountNum = Number(confirmedAmount);

   if (!isNaN(amountNum) && Number.isInteger(amountNum) && amountNum >= 10) {
    const amount = amountNum * 100;  
    const paymentType = 'Resume';

    this.ps.initRazorPays(() => {
      setTimeout(() => {
        this.saveNickName();
      }, 2000);
    });

    this.ps.payWithRazorPay(amount, this.templateName);

    

  } else {
    alert("Please enter a valid amount ₹10 or more.");
  }
}

saveNickName(){
  const route = "credits/save-nickname"
  const formData = new FormData();

   const userIds = sessionStorage.getItem('userId');
    this.userId=userIds;

  formData.append('nickName', this.nickName);
  formData.append('userId', this.userId);
  formData.append('templateName', this.templateName);

   this.api.upload(route,formData).subscribe({
      next: (response) => {
         
       this.redeem();
      },
      error: (error) => {
        this.ngxLoaderStop();
        this.gs.showMessage('error',error.error?.message)
      },
    });

}

  
  redeem() {

    setTimeout(() => {
          this.saveNickNameBeforeRedeem();

    }, 1000);
    
    this.ngxLoaderStart();
    const route = 'credits/redeem'

    if(!this.templateName){
      this.templateName = localStorage.getItem('templateName')
    }

    const payload = {
      userId:this.userId,
      templateName: this.templateName
    }

    this.api.retrieve(route,payload).subscribe({
      next: (response) => {
        this.credits = response as any;
        
        if(this.credits){
          this.ngxLoaderStop();
          //this.createResume();
          this.goToOpenAi();
        }
        else{
          this.gs.showMessage('error','You dont have credits');
           this.ngxLoaderStop();
        }
      },
      error: (error) => {
        this.ngxLoaderStop();
        this.gs.showMessage('error','Error in  creating Resume')
      },
    });
  }

  createResume() {
    this.generating = true

    const route = 'resume/create';
    const payload = {...this.candidates, templateName: this.templateName};

     this.api.retrieve(route, payload).subscribe({
      next: (response:any) => {
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

        this.gs.showMessage('Success', 'Your resume is created successfully');
        localStorage.removeItem('resumeName');
         this.generating = false
        this.ref.close();
      }
       this.generating = false
      },
      error: (error) => {
        this.gs.showMessage('Oops..!', error.error?.message)
        this.generating = false
        this.ref.close();

      },

    });
  }

  ngxLoaderStop(){
    setTimeout(() => {
      this.isUploading = false;
    }, 2000);
  }

  ngxLoaderStart(){
      this.isUploading = true;
     
   }

   getAvailableCredits(templateName:any,userId:any) {
     const route = `credits/get-available-credits?templateName=${templateName}&userId=${userId}`;

    this.api.get(route).subscribe({
      next: (response) => {
        this.balanceCredits = response as any;

        const balance = response
      },
    });
  }


  goToOpenAi(){

      this.generating = true

    const route = 'resume/get-content';
    const payload = {...this.candidates};

     this.api.retrieve(route, payload).subscribe({
      next: (response:any) => {

        if(response){
            
        const responseCandidate =  response as Candidate;
        this.openCreateResumeDialog(responseCandidate,this.templateName);
          this.generating = false
        }
              this.generating = false
      },
      error: (error) => {
        this.generating = false
        this.gs.showMessage('error', error.error?.message)

      },

    });
    
  }

  openCreateResumeDialog(candidate:any,templateName:any) {
      this.ref.close();
      const ref = this.dialog.open(ResumeCreatingComponent, {
        data: {
          candidates: candidate,
          templateName: templateName
        },
        closable: true,
        width: '80%',
        height: '90%',
       
        header: 'Reconfirm your details',
      });
  
      // ref.onClose.subscribe(response => {
      //   if (response) {
      //     this.candidateImageUrl = response.candidateLogo;
      //     console.log(this.candidateImageUrl)
      //   }
      // });
    }

    saveNickNameBeforeRedeem(){
  const route = "credits/save-nickname"
  const formData = new FormData();

   const userIds = sessionStorage.getItem('userId');
    this.userId=userIds;

  formData.append('nickName', this.nickName);
  formData.append('userId', this.userId);
  formData.append('templateName', this.templateName);

   this.api.upload(route,formData).subscribe({
      next: (response) => {

      },
      error: (error) => {
        this.ngxLoaderStop();
        this.gs.showMessage('error',error.error?.message)
      },
    });

}
  

}
