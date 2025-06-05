import { DatePipe } from '@angular/common';
import {ChangeDetectorRef,Component,} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from '../../../services/api.service';
import { GlobalService } from '../../../services/global.service';
import { PaymentService } from 'src/app/services/payment.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-view-mobile-history-candidates',
  standalone: false,
  templateUrl: './view-mobile-history-candidates.component.html',
  styleUrl: './view-mobile-history-candidates.component.css'
})
export class ViewMobileHistoryCandidatesComponent {
 candidates:any
  dataLoaded: boolean = true;

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
    ) 
    {}

   ngOnInit() {
    this.viewHistory();
   }


  viewHistory(){
    const route = "history/candidate"

   this.api.get(route).subscribe({
      next: response => {
      this.candidates = response;
      //  this.viewCandidateSHistory(candidateList);
      }
    });
  }

    restoreCandidate(candidateDetails:any){
      const route = 'candidate/create';
      const payload ={...candidateDetails}

       this.api.retrieve(route, payload).subscribe({
      next: (response) => {
        if(response){
            this.gs.setCandidateDetails(this.candidates);
          this.router.navigate(['mob-candidate']);
          
        }
      },
      error: (error) => {
         
      },
     });
  
    }
     
}
