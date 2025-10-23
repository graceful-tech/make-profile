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
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-details-fill-directly',
  standalone: false,
  templateUrl: './details-fill-directly.component.html',
  styleUrl: './details-fill-directly.component.css',
})
export class DetailsFillDirectlyComponent {
  candidateId: any;
  multipartFile: any;
  resume: any;
  candidates: any;
  isUploading: boolean = false;
  isAnalysing: boolean = false;
   
  showErrorPopup: boolean = false;
  errorMessage: any;
  errorStatus: any;
  analysisText: string = '';
  templateName: any;

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
    private loader: LoaderService,
    private toast: ToastService
  ) {

    
  }

  ngOnInit(){
     this.gs.resumeName$.subscribe((response) => {
      if (response !== null) {
        this.templateName = response;
      }
    });
  }

  togglePopup() {
    const popup = document.getElementById('examplePopup');
    if (popup !== null) {
      popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
    }
  }

  hintPopup() {
    const popup = document.getElementById('hintPopup');
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

    const route = 'resume-ai/upload-ai-resume';

    const formData = new FormData();
    formData.append('resume', this.multipartFile);

    this.api.upload(route, formData).subscribe({
      next: (response) => {

        if (response !== null) {
           this.ngxLoaderStop();
         if (Array.isArray(response)) {
              this.ngxLoaderStop();
              this.isAnalysing = false;
              this.showErrorPopup = true;
              this.errorMessage = response;
              this.errorStatus = 'Correct Your Content';
            }
            else{
            this.ngxLoaderStop();
            this.candidates = response;
            this.gs.setCandidateDetails(this.candidates);
            
            if (this.templateName === null || this.templateName === undefined) {
              const templateName = localStorage.getItem('templateName');
              this.gs.setResumeName(templateName);
            } else {
              this.gs.setResumeName(this.templateName);
            }

            this.router.navigate(['common-details']);

          }
         
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
    
    if (this.templateName === null || this.templateName === undefined) {
      const templateName = localStorage.getItem('templateName');
      this.gs.setResumeName(templateName);
    } else {
      this.gs.setResumeName(this.templateName);
    }
    this.router.navigate(['multi-page-details']);
  }

  analyseWithAi(content: any) {
    this.isAnalysing = true;
    if (
      content.replace(/\s/g, '').length > 400 &&
      content.replace(/\s/g, '').length <= 3000
    ) {
      this.isAnalysing = true;

      const route = 'open-ai/get-details-login';

      const username = sessionStorage.getItem('userName');

      let userNamePresent:string;
      if(username !== null && username !== undefined){
         userNamePresent = 'true'
      }
      else{
        userNamePresent = 'false'
      }

      const formData = new FormData();
      formData.append('content', content);
      formData.append('userIsActive', userNamePresent);

      this.api.upload(route, formData).subscribe({
        next: (response) => {
          this.isAnalysing = false;
          if (response !== null) {
            if (Array.isArray(response)) {
              this.isAnalysing = false;
              this.showErrorPopup = true;
              this.errorMessage = response;
              this.errorStatus = 'Correct Your Content';
            } else {
              this.gs.setCandidateDetails(response);
              
            if (this.templateName === null || this.templateName === undefined) {
              const templateName = localStorage.getItem('templateName');
              this.gs.setResumeName(templateName);
            } else {
              this.gs.setResumeName(this.templateName);
            }

              this.router.navigate(['common-details']);
            }
          } else {
            this.toast.showToast(
              'info',
              'Please try After sometime or try Another Way'
            );
          }
        },
        error: (error) => {
          this.isAnalysing = false;
          this.toast.showToast(
            'info',
            'Please try After sometime or try Another Way'
          );
        },
      });
    } else {
      this.isAnalysing = false;
      this.gs.showMessage(
        'Note!..',
        'Please enter more details | below count should between 400 to 3000 '
      );
    }
  }

  goBack() {
    this.router.navigate(['']);
  }

  getCharacterCount(text: string): number {
    if (!text) return 0;
    return text.replace(/\s/g, '').length;
  }

  copyContent() {
    const content = `Hello, my name is Abc. My gender is Male/Female I have completed my B.Tech in Computer Science from XXXXX Engineering College with an overall score of 100%, during the period 29th January 1955 to 30th March 1963.I also have one year of professional experience at YYY Company from 1st April 1963 to 31st March 1964, where I gained strong skills in software development, testing, sales, data entry and analysis, voice and non-voice support, and customer handling. This experience helped me strengthen my abilities in problem-solving, teamwork, communication, adaptability, and multitasking. Along with my technical background, I have developed leadership, time management, negotiation, and creativity skills. I enjoy exploring new ideas, taking on challenges, and contributing to projects that create a meaningful impact across industries.You can reach me at +91-1234567891 or via email at abc@example.com`;

    navigator.clipboard.writeText(content).then(() => {
      this.togglePopup();
    });
  }

  closePopupTap(event: any) {
    this.showErrorPopup = false;
  }
  toLogin() {
    this.router.navigate(['/login']);
  }
}
