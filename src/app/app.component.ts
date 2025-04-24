import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceServiceService } from './services/device.service.service';
@Component({
  standalone: false, 
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'make-profile';
  

  constructor(private router: Router,private deviceServiceService:DeviceServiceService) {}

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

  this.deviceServiceService.directlyTo('candidate');
}

goToLandingPageMobile(){

  this.router.navigate(['/mobile']);
}

isMobile(): boolean {
  return window.innerWidth <= 768; 

}
}
