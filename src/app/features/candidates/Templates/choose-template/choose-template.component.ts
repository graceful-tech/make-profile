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
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { CreateCandidatesComponent } from '../../create-candidates/create-candidates.component';
import { Candidate } from 'src/app/models/candidates/candidate.model';
import { LocalStorage } from '@ng-idle/core';

@Component({
  selector: 'app-choose-template',
  standalone: false,
  templateUrl: './choose-template.component.html',
  styleUrl: './choose-template.component.css',
})
export class ChooseTemplateComponent {
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

  // Array of Resume Paths
  resumePaths: string[] = [
    './assets/img/resume-template-11-w364x2.png',
    './assets/img/resume-template-10-w364x2.png',
    './assets/img/resume-template-9-w364x2.png',
    './assets/img/resume-template-8-w364x2.png',
  ];
  currentIndex = 0;
  currentResume = this.resumePaths[this.currentIndex];
  isSelected: boolean = false;
  candidates: Array<Candidate> = [];
  candidateId: any;
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
    private config: DynamicDialogConfig,
  ) {
    this.candidates = this.config.data?.candidates;
    this.candidateImageUrl = this.config.data?.candidateImage;

  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.resetPosition();
  }

  zoomIn() {
    this.scale += 0.4;
    this.updateTransform();
  }

  zoomOut() {
    if (this.scale > 1) {
      this.scale -= 0.4;

      if (this.scale <= 1.1 && this.scale >= 0.9) {
        this.resetPosition();
      } else {
        this.updateTransform();
      }
    }
  }

  resetPosition() {
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.updateTransform();
  }

  updateTransform() {
    this.resumeImage.nativeElement.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
  }

  onDoubleClick() {
    this.zoomIn();
  }

  startDragging(event: MouseEvent | TouchEvent) {
    this.isDragging = true;

    if (event instanceof MouseEvent) {
      this.startX = event.clientX - this.translateX;
      this.startY = event.clientY - this.translateY;
    } else {
      this.startX = event.touches[0].clientX - this.translateX;
      this.startY = event.touches[0].clientY - this.translateY;
    }
  }

  stopDragging() {
    this.isDragging = false;
  }

  dragResume(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;

    if (event instanceof MouseEvent) {
      this.translateX = event.clientX - this.startX;
      this.translateY = event.clientY - this.startY;
    } else {
      this.translateX = event.touches[0].clientX - this.startX;
      this.translateY = event.touches[0].clientY - this.startY;
    }

    this.updateTransform();
  }

  prevResume() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.resumePaths.length - 1;
    }
    this.currentResume = this.resumePaths[this.currentIndex];
    this.resetPosition();
  }

  nextResume() {
    if (this.currentIndex < this.resumePaths.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.currentResume = this.resumePaths[this.currentIndex];
    this.resetPosition();
  }

  createResume(resume: any) {
    this.ref.close();
    const candidateId = localStorage.getItem('candidateId');
   // this.getCandidateById(candidateId);

   console.log(this.candidates)
    const ref = this.dialog.open(CreateCandidatesComponent, {
      data: {
        candidates: this.candidates,
        payments:true,
        candidateImage :this.candidateImageUrl
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
}
