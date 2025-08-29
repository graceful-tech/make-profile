import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from '../../../services/api.service';
import { GlobalService } from '../../../services/global.service';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PaymentService } from 'src/app/services/payment.service';

import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-analyse-with-ai',
  standalone: false,
  templateUrl: './analyse-with-ai.component.html',
  styleUrl: './analyse-with-ai.component.css',
})
export class AnalyseWithAiComponent {
  candidateId: any;
  multipartFile: any;
  resume: any;
  candidates: any;
  isUploading: boolean = false;
  isAnalysing: boolean = false;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    public gs: GlobalService,
    private datePipe: DatePipe,
    private dialog: DialogService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public ref: DynamicDialogRef,
    private ngxLoader: NgxUiLoaderService,
    private ps: PaymentService,
    private loader: LoaderService
  ) {}

  togglePopup() {
    const popup = document.getElementById('examplePopup');
    if (popup !== null) {
      popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
    }
  }

  addAttachment(event: any) {
    if (this.candidateId !== null && this.candidateId !== undefined) {
      const confirmDelete = window.confirm(
        'Your existing details will be updated based on your uploaded resume.'
      );

      if (confirmDelete && event.target.files[0]) {
        this.multipartFile = event.target.files[0];
        this.resume = { fileName: this.multipartFile?.name };
        this.parseResume();
      }
    } else {
      if (event.target.files[0]) {
        this.multipartFile = event.target.files[0];
        this.resume = { fileName: this.multipartFile?.name };
        this.parseResume();
      }
    }
  }

  ngxLoaderStart() {
    this.isUploading = true;
  }

  ngxLoaderStop() {
    this.isUploading = false;
  }

  parseResume() {
    this.ngxLoaderStart();

    const route = 'resume-ai/upload';

    const username = sessionStorage.getItem('userName');

    const formData = new FormData();
    formData.append('resume', this.multipartFile);
    formData.append('username', String(username));

    this.api.upload(route, formData).subscribe({
      next: (response) => {
        if (response!== null) {
          this.ngxLoaderStop();
          this.candidates = response;
          this.candidateId = response.id;
          this.gs.setCandidateDetails(this.candidates);
          this.router.navigate(['candidate/new-details-with-ai']);
        } else {
          this.ngxLoaderStop();
          this.gs.showMessage(
            'Note!..',
            'Error in uploading resume please reupload it '
          );
          window.location.reload();
        }
        this.ngxLoaderStop();
      },
      error: (error) => {
        this.ngxLoaderStop();
        this.gs.showMessage(
          'error',
          'Error in uploading resume please reupload it '
        );
        window.location.reload();
      },
    });
  }

  enterDetails() {
    this.router.navigate(['candidate/new-details-with-ai']);
  }


  analyseWithAi(content:any) {
    this.isAnalysing = true;

    const route = 'open-ai/get-details';

    const username = sessionStorage.getItem('userName');

    const formData = new FormData();
    formData.append('content', content);
 
    this.api.upload(route, formData).subscribe({
      next: (response) => {
         this.isAnalysing = true;
        if(response!== null){
           this.gs.setCandidateDetails(response);
           this.router.navigate(['candidate/new-details-with-ai']);
        }
      },
      error: (error) => {
        this.isAnalysing = true;
        this.gs.showMessage('error',error.error?.message);
        window.location.reload();
      },
    });
  }

 

}
