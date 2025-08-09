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

  constructor(private route: ActivatedRoute,private router: Router,private api:ApiService,private ps:PaymentService,
    private gs:GlobalService
  )
   { }

   
   ngOnInit() {
    this.getAvailableCredits();
   }

 


  getAvailableCredits() {
    const id = sessionStorage.getItem('userId');

    const route = `credits?userId=${id}`;
    this.api.get(route).subscribe({
      next: (response) => {
        this.availableCredits = response as any;
        this.totalCreditsAvailable = this.availableCredits.reduce(
          (sum: any, credit: { creditAvailable: any; }) => sum + (credit.creditAvailable || 0),
          0
        );
      },
    });
  }

  payment(templateName:any){
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

    this.ps.payWithRazorPay(amount, templateName);
  } else {
    alert("Please enter a valid amount ₹10 or more.");
  }
  }

   navigateToVerify(templateName:any,availableCredits:any){

    if(availableCredits>0){

     localStorage.setItem('templateName',templateName);
    this.gs.setResumeName(templateName);
    
    if (this.candidateImageUrl != null &&this.candidateImageUrl !== undefined) {
      this.gs.setCandidateImage(this.candidateImageUrl);
    }
    this.router.navigate(['mob-candidate/edit-candidate']);
  }
  else{
    this.gs.customMobileMessage('Oops..!','You don’t have enough credits to check eligibility.',templateName)
   }
  }

  goBack(){
    this.router.navigate(['mob-candidate']);
  }
}
