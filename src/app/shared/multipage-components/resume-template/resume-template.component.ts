import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { Candidate } from 'src/app/models/candidates/candidate.model';

@Component({
  selector: 'app-resume-template',
  standalone: false,
  templateUrl: './resume-template.component.html',
  styleUrl: './resume-template.component.css',
})
export class ResumeTemplateComponent {
  @ViewChild('resumeImage', { static: false }) resumeImage!: ElementRef;
  @ViewChild('resumeContainer', { static: false }) resumeContainer!: ElementRef;

  resumePaths: { path: string; name: string; type: string }[] = [
    { path: './assets/img/Mercury.png', name: 'Mercury', type: 'Single Page' },
    { path: './assets/img/Venus.png', name: 'Venus', type: 'Multiple Page' },
    { path: './assets/img/Earth.png', name: 'Earth', type: 'Single Page' },
    { path: './assets/img/Mars.png', name: 'Mars', type: 'Single Page' },
    {
      path: './assets/img/Jupiter.png',
      name: 'Jupiter',
      type: 'Multiple Page',
    },
    { path: './assets/img/Saturn.png', name: 'Saturn', type: 'Multiple Page' },
    { path: './assets/img/Uranus.png', name: 'Uranus', type: 'Multiple Page' },
    {
      path: './assets/img/Neptune.png',
      name: 'Neptune',
      type: 'Multiple Page',
    },
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

     if (this.isMobileDevice()) {
      // redirect to mobile login if mobile
      this.router.navigate(['/resume-templates']);
    }

    localStorage.removeItem('resumeName');

    this.gs.candidateDetails$.subscribe((response) => {
      if (response !== null) {
        this.candidates = response;
      }
    });

    this.gs.candidateImage$.subscribe((response) => {
      if (response !== null) {
        this.candidateImageUrl = response;
      }
    });
  }

  goBack() {
    this.router.navigate(['']);
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

  navigateToMainpage(resumeName: any) {
    localStorage.setItem('templateName', resumeName);

    this.gs.setResumeName(resumeName);

    this.router.navigate(['enter-details']);
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
    'linear-gradient(to bottom, #ff9a9e, #fad0c4)',
  ];

  changeBackground() {
    this.backgroundStyle = this.gradients[this.gradientIndex];
    this.gradientIndex = (this.gradientIndex + 1) % this.gradients.length;
  }

   private isMobileDevice(): boolean {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    return /android|iphone|ipad|ipod/i.test(userAgent);
  }

}
