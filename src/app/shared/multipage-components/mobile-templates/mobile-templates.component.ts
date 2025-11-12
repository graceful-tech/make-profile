import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
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
  selector: 'app-mobile-templates',
  standalone: false,
  templateUrl: './mobile-templates.component.html',
  styleUrl: './mobile-templates.component.css',
})
export class MobileTemplatesComponent {
  @ViewChild('resumeImage', { static: false }) resumeImage!: ElementRef;
  @ViewChild('resumeContainer', { static: false }) resumeContainer!: ElementRef;

  scale = 1;
  isDragging = false;
  startX = 0;
  startY = 0;
  translateX = 0;
  translateY = 0;
  isWorkingHere: boolean = false;
  candidatesArray: Array<Candidate> = [];

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
    { path: './assets/img/Uranus.png', name: 'Uranus', type: 'Multiple Page' },
    {
      path: './assets/img/Neptune.png',
      name: 'Neptune',
      type: 'Multiple Page',
    },
  ];

  get currentResumeName(): string {
    return this.resumePaths[this.currentIndex].name;
  }

  currentIndex = 0;
  currentResume = this.resumePaths[this.currentIndex].path;
  currentResumePageType = this.resumePaths[this.currentIndex].type;
  resumeName = this.resumePaths[this.currentIndex].name;
  isSelected: boolean = false;
  candidates: Array<Candidate> = [];
  candidateId: any;
  candidateImageUrl: any;
  candidatesDetails: any;
  touchStartX: number = 0;
  touchEndX: number = 0;
  backgroundStyle: string = 'linear-gradient(to bottom, #c85f78, #5e84c6))';
  private gradientIndex = 0;

  constructor(
    private gs: GlobalService,

    private router: Router,
    public ref: DynamicDialogRef
  ) {}

  ngOnInit() {}

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

  openNickNameField(templateName: any) {
    localStorage.setItem('templateName', templateName);

    this.gs.setResumeName(templateName);

    this.router.navigate(['choose-direction']);
  }

  backToCandidates() {
    this.router.navigate(['']);
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  handleSwipe() {
    const swipeDistance = this.touchEndX - this.touchStartX;

    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        this.prevResume();
      } else {
        this.nextResume();
      }
    }
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
}
