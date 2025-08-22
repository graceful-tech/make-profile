import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { ChooseTemplateComponent } from '../choose-template/choose-template.component';
import { Candidate } from 'src/app/models/candidates/candidate.model';
import { VerifyCandidatesComponent } from '../../verify-candidates/verify-candidates.component';
import { NickNameComponent } from '../../nick-name/nick-name.component';

@Component({
  selector: 'app-view-templates',
  standalone: false,
  templateUrl: './view-templates.component.html',
  styleUrl: './view-templates.component.css',
})
export class ViewTemplatesComponent {
  @ViewChild('resumeImage', { static: false }) resumeImage!: ElementRef;
  @ViewChild('resumeContainer', { static: false }) resumeContainer!: ElementRef;

  resumePaths: { path: string; name: string; type: string }[] = [
    { path: './assets/img/Mercury.jpg', name: 'Mercury', type: 'Single Page' },
    { path: './assets/img/Venus.jpg', name: 'Venus', type: 'Multiple Page' },
    { path: './assets/img/Earth.jpg', name: 'Earth', type: 'Single Page' },
    { path: './assets/img/Mars.jpg', name: 'Mars', type: 'Single Page' },
    {path: './assets/img/Jupiter.jpg',name: 'Jupiter',type: 'Multiple Page'},
    {path: './assets/img/Saturn.jpg',name: 'Saturn',type: 'Multiple Page'},
  ];

  currentIndex = 0;
  currentResume = this.resumePaths[this.currentIndex].path;
  currentResumePageType = this.resumePaths[this.currentIndex].type;
  resumeName = this.resumePaths[this.currentIndex].name;
  isSelected: boolean = false;
  candidates: Array<Candidate> = [];
  candidateId: any;
  candidateImageUrl: any;
  candidatesArray: any;
  candidatesUpdateData: any;

  backgroundStyle: string = 'linear-gradient(to bottom, #fff, #63c8ea)';
  private gradientIndex = 0;

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
    private config: DynamicDialogConfig
    
  ) {

     this.candidates = this.config.data?.candidates;
    this.candidateImageUrl = this.config.data?.candidateImage;
  }

  ngOnInit() {
    localStorage.removeItem('resumeName');

    this.gs.candidateDetails$.subscribe((response) => {
      this.candidatesUpdateData = response;
    });

    if (
      this.candidatesUpdateData !== null &&
      this.candidatesUpdateData !== undefined
    ) {
      this.candidates = this.candidatesUpdateData;
    } else {
    }
  }

  chooseTemplate() {
    const ref = this.dialog.open(ChooseTemplateComponent, {
      data: {},
      closable: true,
      width: '40%',
      height: '90%',
      styleClass: 'custom-dialog-header',
    });

    ref.onClose.subscribe((response) => {
      if (response) {
      }
    });
  }

  goBack() {
    this.router.navigate(['/candidate']);
  }

  prevResume() {

    this.changeBackground();

    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.resumePaths.length - 1;
    }
    this.currentResume = this.resumePaths[this.currentIndex].path;
    this.currentResumePageType = this.resumePaths[this.currentIndex].type;
    this.resumeName = this.resumePaths[this.currentIndex].name;

   }

  nextResume() {

    this.changeBackground();

    if (this.currentIndex < this.resumePaths.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.currentResume = this.resumePaths[this.currentIndex].path;
    this.currentResumePageType = this.resumePaths[this.currentIndex].type;
    this.resumeName = this.resumePaths[this.currentIndex].name;

   }

  checkSection(resumeName: any) {
    const route = 'template/checker';
    const payload = {
      ...this.candidates,
      resumeFormatName: resumeName,
    };
    localStorage.setItem('templateName', resumeName);

    this.api.retrieve(route, payload).subscribe({
      next: (response) => {
        console.log('keerthi');
        const name = response?.name;
        this.createResume(name);
      },
    });
  }

  async navigateToMainpage(resumeName: any) {
    await this.router.navigate(['candidate']);
    this.openNickName(resumeName);
  }

  openNickName(resumeName: any) {
    this.ref.close();
    localStorage.setItem('templateName', resumeName);

    const ref = this.dialog.open(NickNameComponent, {
      data: {
        payments: true,
        resumeName: resumeName,
        candidateImage: this.candidateImageUrl,
        candidates: this.candidates,
      },
      closable: true,
      width: '30%',
      header: 'Enter the nick name for this resume',
    });
  }

  createResume(resumeName: any) {
    this.ref.close();
    const candidateId = localStorage.getItem('candidateId');

    localStorage.setItem('templateName', resumeName);

    const ref = this.dialog.open(VerifyCandidatesComponent, {
      data: {
        candidates: this.candidates,
        payments: true,
        candidateImage: this.candidateImageUrl,
        resumeName: resumeName,
        // fieldsName:resumeName
      },
      closable: true,
      width: '70%',
      height: '90%',
      header: 'Check Your Details',
    });

    ref.onClose.subscribe((response) => {
      if (response) {
        this.candidates = response;
        this.candidateId = response.id;
        const candidate = response as Candidate;
        // this.patchCandidateForm(candidate);
      }
    });
  }

  getCandidateById(id: any) {
    const route = `candidate/${id}`;

    this.api.get(route).subscribe({
      next: (response) => {
        this.candidatesArray = response as any;
      },
    });
  }

  private gradients: string[] = [
  'linear-gradient(to bottom, #fff, #63c8ea)',         
  'linear-gradient(to bottom, #ffecd2, #fcb69f)',        
  'linear-gradient(to bottom, #a1c4fd, #c2e9fb)',       
  'linear-gradient(to bottom, #fbc2eb, #a6c1ee)',       
  'linear-gradient(to bottom, #fddb92, #d1fdff)',       
  'linear-gradient(to bottom, #84fab0, #8fd3f4)',        
  'linear-gradient(to bottom, #ff9a9e, #fad0c4)'       
];


changeBackground() {
  this.backgroundStyle = this.gradients[this.gradientIndex];
  this.gradientIndex = (this.gradientIndex + 1) % this.gradients.length;
}
}
