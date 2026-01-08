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
import templatesData from 'src/assets/templates/templates.json';

@Component({
  selector: 'app-mobile-templates',
  standalone: false,
  templateUrl: './mobile-templates.component.html',
  styleUrl: './mobile-templates.component.css',
})
export class MobileTemplatesComponent {
  @ViewChild('resumeImage', { static: false }) resumeImage!: ElementRef;
  @ViewChild('resumeContainer', { static: false }) resumeContainer!: ElementRef;
  @ViewChild('scrollContainer', { static: false })
  scrollContainer!: ElementRef<HTMLDivElement>;

  scale = 1;
  isDragging = false;
  startX = 0;
  startY = 0;
  translateX = 0;
  translateY = 0;
  isWorkingHere: boolean = false;
  candidatesArray: Array<Candidate> = [];
  selectedResume: any = null;
  templatesData: any;
  categories: string[] = [];
  selectedCategory: any;
  selected: string = 'All Page';

  resumePaths: { templateLocation: string; templateName: string; templateType: string }[] = [

  ];


  currentIndex = 0;

  isSelected: boolean = false;
  candidates: Array<Candidate> = [];
  candidateId: any;
  candidateImageUrl: any;
  candidatesDetails: any;
  touchStartX: number = 0;
  touchEndX: number = 0;
  backgroundStyle: string = 'linear-gradient(to bottom, #c85f78, #5e84c6))';
  private gradientIndex = 0;
  selectedTemplatepath: any;

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
    private gs: GlobalService,

    private router: Router,
    public ref: DynamicDialogRef
  ) {

    this.gs.allTemplates$.subscribe(response => {
      if (!response) return;

      this.templatesData = response;
      this.categories = Object.keys(this.templatesData);
      this.selectedCategory = this.categories[0];
      this.resumePaths = this.templatesData[this.selectedCategory] ?? [];
    });
  }

  ngOnInit() { }

  prevResume() {
    this.changeBackground();
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.resumePaths.length - 1;
    }
    this.currentResume;
    this.currentResumePageType;;
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
    this.currentResumePageType;;
    this.currentResumeName;
  }

  openNickNameField(templateName: any) {
    localStorage.setItem('templateName', templateName);

    this.gs.setResumeName(templateName);

    this.router.navigate(['mob-fresher-form']);
  }

  backToCandidates() {
    this.router.navigate(['choose-direction']);
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


  goBack(): void {
    this.router.navigate(['mob-candidate/create-resume']);
  }

  openPreview(resume: any, location: any): void {
    this.selectedResume = resume;
    this.selectedTemplatepath = location;
  }

  closePreview(): void {
    this.selectedResume = null;
    this.selectedTemplatepath = null;
  }

  async changeTemplate(templateName: any) {
    this.gs.setResumeName(templateName);

    await localStorage.setItem('templateName', templateName);

    this.router.navigate(['mob-candidate/create-resume']);
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
