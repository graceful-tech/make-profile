import { Component, ElementRef, ViewChild } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { LoaderControllerService } from 'src/app/services/loader-controller.service';
import templatesData from 'src/assets/templates/templates.json';

@Component({
  selector: 'app-mobile-change-template',
  standalone: false,
  templateUrl: './mobile-change-template.component.html',
  styleUrl: './mobile-change-template.component.css',
})
export class MobileChangeTemplateComponent {
  @ViewChild('scrollContainer', { static: false })
  scrollContainer!: ElementRef<HTMLDivElement>;
  resumePaths: { templateLocation: string; templateName: string; templateType: string }[] = [];

  selectedResume: any = null;
  templatesData: any;
  categories: string[] = [];
  selectedCategory: any;
  selectedTemplatepath: any;
  selected: string = 'All Page';

  constructor(private router: Router, private gs: GlobalService, private api: ApiService, private newLoader: LoaderControllerService) {

  }

  ngOnInit() {
    this.gs.allTemplates$.subscribe(response => {
      if (!response) return;

      this.templatesData = response;
      this.categories = Object.keys(this.templatesData);
      this.selectedCategory = this.categories[0];
      this.resumePaths = this.templatesData[this.selectedCategory] ?? [];
    });

    this.gs.singlePageResumeState$.subscribe((response) => {
      console.log(response)
      if (response) {
        this.selected = 'Multiple Page';
        this.resumePaths = this.resumePaths.filter((s: any) => s.templateType === 'Multiple Page');
      }
    })
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
