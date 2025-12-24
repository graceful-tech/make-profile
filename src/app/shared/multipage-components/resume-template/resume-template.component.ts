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
import templatesData from 'src/assets/templates/templates.json';

@Component({
  selector: 'app-resume-template',
  standalone: false,
  templateUrl: './resume-template.component.html',
  styleUrl: './resume-template.component.css',
})
export class ResumeTemplateComponent {
  @ViewChild('resumeImage', { static: false }) resumeImage!: ElementRef;
  @ViewChild('resumeContainer', { static: false }) resumeContainer!: ElementRef;


  resumePaths: { templateLocation: string; templateName: string; templateType: string }[] = [];
  templatesData: any;
  categories: string[] = [];
  selectedCategory: any;
  @ViewChild('scrollContainer', { static: false })
  scrollContainer!: ElementRef<HTMLDivElement>;

  currentIndex = 0;

  isSelected: boolean = false;
  candidates: Array<Candidate> = [];
  candidateId: any;
  candidateImageUrl: any;
  candidatesArray: any;
  candidatesUpdateData: any;
  selected: string = 'All Page';

  backgroundStyle: string = 'linear-gradient(to bottom, #fff, #63c8ea)';
  private gradientIndex = 0;


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
    private config: DynamicDialogConfig
  ) {
    this.candidates = this.config.data?.candidates;
    this.candidateImageUrl = this.config.data?.candidateImage;

    this.gs.allTemplates$.subscribe(response => {
      if (!response) return;

      this.templatesData = response;
      this.categories = Object.keys(this.templatesData);
      this.selectedCategory = this.categories[0];
      this.resumePaths = this.templatesData[this.selectedCategory] ?? [];
    });
  }

  ngOnInit() {

    if (this.isMobileDevice()) {

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

  navigateToMainpage(resumeName: any) {
    localStorage.setItem('templateName', resumeName);

    this.gs.setResumeName(resumeName);

    this.router.navigate(['choose-direction']);
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

  onImageLoad() {
    const image = this.resumeImage.nativeElement;
    image.classList.remove('fade-in');
    void image.offsetWidth; // trigger reflow
    image.classList.add('fade-in');
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
