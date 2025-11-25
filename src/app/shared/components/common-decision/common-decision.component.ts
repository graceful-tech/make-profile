import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-common-decision',
  standalone: false,
  templateUrl: './common-decision.component.html',
  styleUrl: './common-decision.component.css'
})
export class CommonDecisionComponent {
  constructor(private router: Router) { }
  ngOnInit() { }

  goToFresher() {
    const sourse = this.isMobileDevice();


    if (sourse) {
      this.router.navigate(['mob-candidate/resume-form']);
    }
    else {
      this.router.navigate(['candidate/fill-form']);

    }

  }

  private isMobileDevice(): boolean {
    const userAgent =
      navigator.userAgent || navigator.vendor || (window as any).opera;
    return /android|iphone|ipad|ipod/i.test(userAgent);
  }


}
