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
import { NickNameMobileComponent } from '../nick-name-mobile/nick-name-mobile.component';

@Component({
  selector: 'app-mobile-chosse-template',
  standalone: false,
  templateUrl: './mobile-chosse-template.component.html',
  styleUrl: './mobile-chosse-template.component.css',
})
export class MobileChosseTemplateComponent {
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
  resumePaths: { path: string, name: string }[] = [
    { path: './assets/img/Mercury.png', name: 'Mercury' },
    { path: './assets/img/Venus.png', name: 'Venus' },
    { path: './assets/img/Earth.png', name: 'Earth' },
    { path: './assets/img/Mars.png', name: 'Mars' },
  ];
  

  get currentResumeName(): string {
    return this.resumePaths[this.currentIndex].name;
  }

  currentIndex = 0;
  currentResume = this.resumePaths[this.currentIndex].path;
  isSelected: boolean = false;
  candidates: Array<Candidate> = [];
  candidateId: any;
  candidateImageUrl: any;
  candidatesDetails: any;

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
  ) {}

  ngOnInit() {
    this.gs.candidateDetails$.subscribe((response) => {
      this.candidatesDetails = response;
    });

    if (
      this.candidatesDetails !== null &&
      this.candidatesDetails !== undefined
    ) {
      this.candidateId = this.candidatesDetails?.id;
      this.candidates = this.candidatesDetails;
    }

    this.gs.candidateImage$.subscribe((response) => {
      if (response !== null) {
        this.candidateImageUrl = response;
      }
    });
  }

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
    this.currentResume = this.resumePaths[this.currentIndex].path;
    this.resetPosition();
  }

  nextResume() {
    if (this.currentIndex < this.resumePaths.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.currentResume = this.resumePaths[this.currentIndex].path;
    this.resetPosition();
  }

  chooseTemplate(resume: any) {
    localStorage.setItem('templateName',resume);
    this.gs.setResumeName(resume);
    
    if (this.candidateImageUrl != null &&this.candidateImageUrl !== undefined) {
      this.gs.setCandidateImage(this.candidateImageUrl);
    }
    this.router.navigate(['mob-candidate/edit-candidate']);
  }

  openNickNameField(templateName:any){
    localStorage.setItem('templateName',templateName);
    const ref = this.dialog.open(NickNameMobileComponent,{
          data: {
             resume:templateName,
          },
          closable: true,
          header: 'Enter the Nick Name',
          styleClass: 'for-mobile-payment'
        });
    
        // ref.onClose.subscribe(response => {
        //   if (response) {
    
        //     this.candidates = response;
        //     this.candidateId = response.id;
        //     const candidate = response as Candidate
        //     const candidateClone = JSON.parse(JSON.stringify(candidate));
        //     this.patchCandidateForm(candidateClone);
        //     this.candidateImageUrl = response.candidateLogo;
    
        //     this.resume = null;
            
        //   }
        // });
  }

  getCandidateById(id: any) {
    const route = `candidate/${id}`;

    this.api.get(route).subscribe({
      next: (response) => {
        this.candidatesArray = response as any;
      },
    });
  }

  backToCandidates() {

    this.gs.setCandidateDetails(this.candidates);
    if (this.candidateImageUrl != null &&this.candidateImageUrl !== undefined) {
      this.gs.setCandidateImage(this.candidateImageUrl);
    }
    this.router.navigate(['mob-candidate']);
  }
}
