import { ChangeDetectorRef, Component } from '@angular/core';
import { ChooseTemplateComponent } from '../Templates/choose-template/choose-template.component';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder } from '@angular/forms';
import { GlobalService } from 'src/app/services/global.service';
import { DatePipe } from '@angular/common';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PaymentService } from 'src/app/services/payment.service';
import { ExistingResumeComponent } from '../existing-resume/existing-resume.component';

@Component({
  selector: 'app-choose-template-way',
  standalone: false,
  templateUrl: './choose-template-way.component.html',
  styleUrl: './choose-template-way.component.css'
})
export class ChooseTemplateWayComponent {
  candidates: any;
  candidateImageUrl: any;


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
      private ngxLoader: NgxUiLoaderService,
      private ps: PaymentService,
      private config: DynamicDialogConfig,
    ) {

      this.candidates = this.config.data?.candidates;
      this.candidateImageUrl = this.config.data?.candidateImage;
     }
 
  ngOnInIt(){

  }


  chooseTemplate() {

    this.ref.close();
     
     const ref = this.dialog.open(ChooseTemplateComponent, {
      data: {
        candidates: this.candidates,
        candidateImage: this.candidateImageUrl
      },
      closable: true,
      width: '40%',
      height: '90%',
      styleClass: 'custom-dialog-header',
    });
    
    

    ref.onClose.subscribe(response => {
      if (response) {
        this.candidateImageUrl = response.candidateLogo;
        console.log(this.candidateImageUrl)
      }
        
    });
  }

  useExistingResume(){
    this.ref.close();

    const ref = this.dialog.open(ExistingResumeComponent, {
      data: {
        candidates: this.candidates,
        candidateImage: this.candidateImageUrl
      },
      closable: true,
      width: '80%',
      height: '90%',
      header: 'Use Existing Resume Template',
    });
  }

}
