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
import { CreateCandidatesComponent } from '../../create-candidates/create-candidates.component';
import { Candidate } from 'src/app/models/candidates/candidate.model';
import { LocalStorage } from '@ng-idle/core';
import { AddCandidatesComponent } from '../../add-candidates/add-candidates.component';
import { VerifyCandidatesComponent } from '../../verify-candidates/verify-candidates.component';
import { LoaderControllerService } from 'src/app/services/loader-controller.service';
 import templatesData from 'src/assets/templates/templates.json';

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

  resumePaths: { templateLocation: string; templateName: string; templateType: string }[] = [];

  currentIndex = 0;

  isSelected: boolean = false;
  candidates: Array<Candidate> = [];
  candidateId: any;
  candidateImageUrl: any;



  get currentResume(): string {
    return this.resumePaths[this.currentIndex]?.templateLocation ?? '';
  }

  get currentResumePageType(): string {
    return this.resumePaths[this.currentIndex]?.templateType ?? '';
  }

  get currentResumeName(): string {
    return this.resumePaths[this.currentIndex]?.templateName ?? '';
  }


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
    private newLoader: LoaderControllerService
  ) {
    this.candidates = this.config.data?.candidates;
    this.candidateImageUrl = this.config.data?.candidateImage;

    
  }

  ngOnInit() {
    localStorage.removeItem('resumeName');

    if (this.candidates === null || this.candidates === undefined) {
      this.getCandidates();
    }

  this.resumePaths = templatesData.resumePaths
   
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

  prevResume() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.resumePaths.length - 1;
    }
    this.currentResume;
    this.currentResumePageType;

  }

  nextResume() {
    if (this.currentIndex < this.resumePaths.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
     this.currentResume;
    this.currentResumePageType;

  }




  toVerify(resumeName: any) {
    this.ref.close();


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


  getCandidates() {
    // this.ngxLoaderStart('Resume is getting ready, please wait...');

    const route = 'candidate';
    this.api.get(route).subscribe({
      next: (response) => {
        const candidate = response as Candidate;
        if (candidate !== null) {
          this.candidates = response as any;
          this.candidateId = candidate?.id;
          localStorage.setItem('candidateId', this.candidateId);

        }
        // this.ngxLoaderStop();
      },
      error: (err) => {
        // this.ngxLoaderStop();
        console.error('Error fetching candidate image:', err);
      },
    });
    //  this.ngxLoaderStop();
  }


}
