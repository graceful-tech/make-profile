import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  standalone: false, 
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'make-profile';
  

  constructor(private router: Router) {}

  ngOnInit() {
    if (this.isMobile()) {
      this.router.navigate(['/mobile']); 
    } else {
      this.router.navigate(['/landing']); 
    }
  }

goToLandingPage() {
  this.router.navigate(['/landing']);
}  

goToCandidatePage(){

  this.router.navigate(['/candidate']);
}

goToLandingPageMobile(){

  this.router.navigate(['/mobile']);
}

isMobile(): boolean {
  return window.innerWidth <= 768; 

}
}
