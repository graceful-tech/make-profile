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

goToLandingPage() {
  this.router.navigate(['/landing']);
}  

goToCandidatePage(){

  this.router.navigate(['/candidate']);
}


}
