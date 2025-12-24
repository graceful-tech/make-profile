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
import { LoaderControllerService } from 'src/app/services/loader-controller.service';
import templatesData from 'src/assets/templates/templates.json';
import { TemplatesData } from 'src/app/models/Template/template.model';





@Component({
  selector: 'app-view-templates',
  standalone: false,
  templateUrl: './view-templates.component.html',
  styleUrl: './view-templates.component.css',

})
export class ViewTemplatesComponent {
  @ViewChild('resumeImage', { static: false }) resumeImage!: ElementRef;
  @ViewChild('resumeContainer', { static: false }) resumeContainer!: ElementRef;
  @ViewChild('scrollContainer', { static: false })
  scrollContainer!: ElementRef<HTMLDivElement>;

  resumePaths: { templateLocation: string; templateName: string; templateType: string }[] = [];

  currentIndex = 0;



  isSelected: boolean = false;
  candidates: Array<Candidate> = [];
  candidateId: any;
  candidateImageUrl: any;
  candidatesArray: any;
  candidatesUpdateData: any;

  backgroundStyle: string = 'linear-gradient(to bottom, #fff, #63c8ea)';
  private gradientIndex = 0;
  categories: string[] = [];
  templatesData: any;
  selectedCategory = '';
  selected: string = 'All Page';

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
    localStorage.removeItem('templateName');

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

    this.gs.allTemplates$.subscribe(response => {
      if (!response) return;

      this.templatesData = response;
      this.categories = Object.keys(this.templatesData);
      this.selectedCategory = this.categories[0];
      this.resumePaths = this.templatesData[this.selectedCategory] ?? [];
    });

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
    this.currentResume;
    this.currentResumePageType;
    this.currentResumeName;

  }

  nextResume() {

    this.changeBackground();

    if (this.currentIndex < this.resumePaths.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.currentResume;
    this.currentResumePageType;
    this.currentResumeName;

  }

  changeTemplateSection() {
    this.resumePaths = templatesData.Freshers;
  }


  navigateToMainpage(resumeName: any) {

    localStorage.setItem('templateName', resumeName);

    this.gs.setCandidateDetails(this.candidates);
    this.gs.setCandidateImage(this.candidateImageUrl);
    this.gs.setResumeName(resumeName);

    this.router.navigate(['candidate/verify-details']);


  }

  // openNickName(resumeName: any) {
  //   this.ref.close();
  //   localStorage.setItem('templateName', resumeName);

  //   const ref = this.dialog.open(NickNameComponent, {
  //     data: {
  //       payments: true,
  //       resumeName: resumeName,
  //       candidateImage: this.candidateImageUrl,
  //       candidates: this.candidates,
  //     },
  //     closable: true,
  //     width: '30%',
  //     header: 'Enter the nick name for this resume',
  //   });
  // }


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

  toVerifyCandidate(templateName: any) {
    this.ref.close();
    const candidateId = localStorage.getItem('candidateId');

    const ref = this.dialog.open(VerifyCandidatesComponent, {
      data: {
        candidates: this.candidates,
        candidateImage: this.candidateImageUrl,
        resumeName: templateName,
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
      }
    });
  }

  onImageLoad() {
    const image = this.resumeImage.nativeElement;
    image.classList.remove('fade-in');
    void image.offsetWidth; // trigger reflow
    image.classList.add('fade-in');
  }

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({
      left: -220,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({
      left: 220,
      behavior: 'smooth'
    });
  }

  selectCategory(category: string) {
    this.selectedCategory = category;

    const templates = this.templatesData[category] ?? [];
    if (this.selected !== 'All Page') {
      this.resumePaths = templates.filter((s: any) => s.templateType === this.selected);
    }
    else {
      this.resumePaths = templates;
    }
    
  }




  selectTemplate(templateName: string) {
    this.gs.setResumeName(templateName);
    localStorage.setItem('templateName', templateName);
    this.gs.setCandidateDetails(this.candidates);
    this.gs.setCandidateImage(this.candidateImageUrl);
    this.router.navigate(['candidate/verify-details']);
  }

  selectedType(type: any) {
    this.selected = type;
    console.log(this.selected);
    const templates = this.templatesData[this.selectedCategory] ?? [];
    if (this.selected !== 'All Page') {
      this.resumePaths = templates.filter((s: any) => s.templateType === type);
    }
    else {
      this.resumePaths = templates;
    }
  }
}
