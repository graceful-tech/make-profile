import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-mobile-change-template',
  standalone: false,
  templateUrl: './mobile-change-template.component.html',
  styleUrl: './mobile-change-template.component.css',
})
export class MobileChangeTemplateComponent {
  resumePaths = [
    { path: 'assets/img/Mercury.png', name: 'Mercury', type: 'Single Page' },
    { path: 'assets/img/Venus.png', name: 'Venus', type: 'Multiple Page' },
    { path: 'assets/img/Earth.png', name: 'Earth', type: 'Single Page' },
    { path: 'assets/img/Mars.png', name: 'Mars', type: 'Single Page' },
    { path: 'assets/img/Jupiter.png', name: 'Jupiter', type: 'Multiple Page' },
    { path: 'assets/img/Saturn.png', name: 'Saturn', type: 'Multiple Page' },
    { path: 'assets/img/Uranus.png', name: 'Uranus', type: 'Multiple Page' },
    { path: 'assets/img/Neptune.png', name: 'Neptune', type: 'Multiple Page' },
  ];

  selectedResume: any = null;

  constructor(private router: Router) {}

  goBack(): void {

     this.router.navigate(['mob-candidate/create-resume']);
  }

  openPreview(resume: any): void {
    this.selectedResume = resume;
  }

  closePreview(): void {
    this.selectedResume = null;
  }

  changeTemplate(templateName: any) {
    localStorage.setItem('templateName', templateName);

    this.router.navigate(['mob-candidate/create-resume']);
  }
}
