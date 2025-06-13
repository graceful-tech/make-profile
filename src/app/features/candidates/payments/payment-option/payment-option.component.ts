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
  templateName:any;
  planetImagePath:any;
  availableCredits:any;
  

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

    const userId =   sessionStorage.getItem('userId')

    this.userId = userId;
    
  }

  ngOnInit() {
   this.planetImagePath ='./assets/img/'+this.templateName+'.png';
   this.getAvailableCredits(this.templateName,this.userId)
  }

  
  async payRupees() {
   const confirmedAmount = prompt("Enter final amount in ₹", "10");

  if (confirmedAmount && !isNaN(+confirmedAmount) && +confirmedAmount > 0) {
    const amount = +confirmedAmount * 100;    
    const paymentType = 'Resume';

    this.ps.initRazorPays(() => {
      setTimeout(() => {
        this.redeem();
      }, 2000);
    });

    this.ps.payWithRazorPay(amount, this.templateName);
  } else {
    alert("Invalid amount entered.");
  }
   
  }
  
  redeem() {
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
            this.createResume();
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
    this.ngxLoaderStart()

    const route = 'resume/create';
    const payload = {...this.candidates, templateName: this.templateName};

     this.api.retrieve(route, payload).subscribe({
      next: (response:any) => {
        if(response.resumePdf){
        const base64String = response.resumePdf;

        // Decode Base64 to binary string
        const binaryString = atob(base64String);

        // Convert binary string to byte array
        const byteArray = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          byteArray[i] = binaryString.charCodeAt(i);
        }

        // Create blob
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = response.candidateName;
        a.click();
        window.URL.revokeObjectURL(url);

        this.gs.showMessage('Success', 'Your resume is created successfully');
        localStorage.removeItem('resumeName');

         this.ngxLoaderStop();
      }
       this.ngxLoaderStop();
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

   getAvailableCredits(templateName:any,userId:any) {
     const route = `credits/get-available-credits?templateName=${templateName}&userId=${userId}`;

    this.api.get(route).subscribe({
      next: (response) => {
        this.balanceCredits = response as any;

        const balance = response
      },
    });
  }
  

}
