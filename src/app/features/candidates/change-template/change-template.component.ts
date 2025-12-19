import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { color } from 'html2canvas/dist/types/css/types/color';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { LoaderControllerService } from 'src/app/services/loader-controller.service';
import templatesData from 'src/assets/templates/templates.json';

@Component({
  selector: 'app-change-template',
  standalone: false,
  templateUrl: './change-template.component.html',
  styleUrl: './change-template.component.css',
})
export class ChangeTemplateComponent {
  resumePaths: { templateLocation: string; templateName: string; templateType: string }[] = [];
  templatesData: any;
  categories: string[] = [];
  selectedCategory: any;
  @ViewChild('scrollContainer', { static: false })
  scrollContainer!: ElementRef<HTMLDivElement>;


  constructor(private router: Router,
    private gs: GlobalService,
    private api: ApiService,
    private newLoader: LoaderControllerService) { }

  ngOnInit() {

    this.gs.allTemplates$.subscribe(response => {
      if (!response) return;

      this.templatesData = response;
      this.categories = Object.keys(this.templatesData);
      this.selectedCategory = this.categories[0];
      this.resumePaths = this.templatesData[this.selectedCategory] ?? [];
    });


  }

  openResume(resume: any) {

    console.log('Previewing resume:', resume);
  }

  selectTemplate(templateName: string) {
    this.gs.setResumeName(templateName);

    localStorage.setItem('templateName', templateName);

    this.router.navigate(['candidate/create-resume']);
  }

  goBack() {
    this.router.navigate(['candidate/create-resume']);
  }


  selectCategory(category: string) {
    this.selectedCategory = category;

    const templates = this.templatesData[category] ?? [];
    this.resumePaths = templates;
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
}
