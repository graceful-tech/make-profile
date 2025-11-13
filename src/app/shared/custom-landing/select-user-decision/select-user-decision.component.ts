import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-user-decision',
  standalone: false,
  templateUrl: './select-user-decision.component.html',
  styleUrl: './select-user-decision.component.css',
})
export class SelectUserDecisionComponent {
  constructor(private router: Router) {}
  ngOnInit() {}

  private isMobileDevice(): boolean {
    const userAgent =
      navigator.userAgent || navigator.vendor || (window as any).opera;
    return /android|iphone|ipad|ipod/i.test(userAgent);
  }

  goToFresher() {
    const sourse = this.isMobileDevice();

    if (sourse) {
      this.router.navigate(['mob-fresher-form']);
    } else {
      this.router.navigate(['fresher-form']);
    }
  }
}
