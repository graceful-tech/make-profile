import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { color } from 'html2canvas/dist/types/css/types/color';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-change-template',
  standalone: false,
  templateUrl: './change-template.component.html',
  styleUrl: './change-template.component.css',
})
export class ChangeTemplateComponent {
  resumePaths: { path: string; name: string; type: string }[] = [];

  constructor(private router: Router,private gs:GlobalService) {}

  ngOnInit(): void {
    this.resumePaths = [
      { path: 'assets/img/Mercury.png', name: 'Mercury', type: 'Single Page' },
      { path: 'assets/img/Venus.png', name: 'Venus', type: 'Multiple Page' },
      { path: 'assets/img/Earth.png', name: 'Earth', type: 'Single Page' },
      { path: 'assets/img/Mars.png', name: 'Mars', type: 'Single Page' },
      {
        path: 'assets/img/Jupiter.png',
        name: 'Jupiter',
        type: 'Multiple Page',
      },
      { path: 'assets/img/Saturn.png', name: 'Saturn', type: 'Multiple Page' },
      { path: 'assets/img/Uranus.png', name: 'Uranus', type: 'Multiple Page' },
      {
        path: 'assets/img/Neptune.png',
        name: 'Neptune',
        type: 'Multiple Page',
      },
    ];
  }

  openResume(resume: any) {
    // Handle click to preview / view full resume
    console.log('Previewing resume:', resume);
  }

  async selectTemplate(templateName: any) {
    this.gs.setResumeName(templateName);

    await localStorage.setItem('templateName', templateName);

    this.router.navigate(['candidate/create-resume']);
  }

  goBack() {
    this.router.navigate(['candidate/create-resume']);
  }
}
