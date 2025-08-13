import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-use-existing-template',
  standalone: false,
  templateUrl: './use-existing-template.component.html',
  styleUrl: './use-existing-template.component.css'
})
export class UseExistingTemplateComponent {
  availableCredits: any;
  totalCreditsAvailable: any;
  candidateImageUrl: any;
  totalRecords: any;
  currentPage: number =1;
  maxLimitPerPageForResume:number = 5;

  constructor(private route: ActivatedRoute,private router: Router,private api:ApiService,private ps:PaymentService,
    private gs:GlobalService
  )
   { }

   ngOnInit() {
    this.getAvailableCredits();
   }

 
getAvailableCredits() {
    const id = sessionStorage.getItem('userId');

    const route = 'credits';
    const payload={
            userId:id,
            page:this.currentPage,
            limit:this.maxLimitPerPageForResume

    }
    this.api.create(route,payload).subscribe({
      next: (response) => {
        if(response){
        this.availableCredits = response?.results as any;
         this.totalCreditsAvailable = this.availableCredits.reduce(
          (sum: any, credit: { creditAvailable: any; }) => sum + (credit.creditAvailable || 0),
          0
        );

      }
       this.totalRecords = response?.totalRecords; 
      },
    });
  }

  payment(templateName:any,nickName:any){
    const confirmedAmount = prompt("Enter final amount in ₹", "10");

  const amountNum = Number(confirmedAmount);

   if (!isNaN(amountNum) && Number.isInteger(amountNum) && amountNum >= 10) {
    const amount = amountNum * 100;  
    const paymentType = 'Resume';

    this.ps.initRazorPays(() => {

       setTimeout(() => {
       this.getAvailableCredits();
       },2000); 
    });

    // this.ps.payWithRazorPay(amount, templateName);
    this.ps.payWithRazorNewPay(amount,templateName,nickName)
  } else {
    alert("Please enter a valid amount ₹10 or more.");
  }
  }

   navigateToVerify(templateName:any,availableCredits:any,nickName:any){

    if(availableCredits>0){

     localStorage.setItem('templateName',templateName);
     this.gs.setResumeName(templateName);

     localStorage.setItem('nickName',nickName);
      this.gs.setNickName(nickName);

    if (this.candidateImageUrl != null &&this.candidateImageUrl !== undefined) {
      this.gs.setCandidateImage(this.candidateImageUrl);
    }
    this.router.navigate(['mob-candidate/edit-candidate']);
  }
  else{
    this.gs.customMobileMessageWithNickName('Oops..!','You don’t have enough credits to check eligibility.',templateName,nickName)
   }
  }

  goBack(){
    this.router.navigate(['mob-candidate']);
  }

   onPageChangeTemplate(event: any) {
    this.currentPage = event.page + 1;
    this.maxLimitPerPageForResume = event.rows;
    this.getAvailableCredits();
    }

}
