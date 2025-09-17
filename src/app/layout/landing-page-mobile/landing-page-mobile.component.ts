import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-landing-page-mobile',
  standalone: false,
  templateUrl: './landing-page-mobile.component.html',
  styleUrl: './landing-page-mobile.component.css',
})
export class LandingPageMobileComponent {
  @ViewChild('logoContainer') logoContainer!: ElementRef;
  @ViewChild('signUPContainer') signUPContainer!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private gs: GlobalService,
    private router: Router,
    private dialog: DialogService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.onWindowScroll();
  }

  candidate() {
    this.router.navigate(['/candidates'], { relativeTo: this.route });
  }

  toLogin() {
    this.router.navigate(['/mob-login']);
  }

  toCreateResume(){
    this.router.navigate(['mob-candidate/analyse-ai']);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.scrollY;
    const maxShiftPx = 400;

    if (this.logoContainer) {
      const currentShift = Math.min(scrollTop, maxShiftPx);
      const shiftPercent = (currentShift / maxShiftPx) * 500;

      const logoEl = this.logoContainer.nativeElement;

      if (scrollTop >= 100) {
        logoEl.style.left = '-60px';
        logoEl.style.transform = 'translateX(0%) scale(0.5)';
      } else {
        logoEl.style.left = '20%';
        logoEl.style.transform = `translateX(-${shiftPercent}%) scale(1)`;
      }
    }

    if (this.signUPContainer) {
      const currentShift = Math.min(scrollTop, maxShiftPx);
      const shiftPercent = (currentShift / maxShiftPx) * 500;
      const logoEl = this.logoContainer.nativeElement;

      if (scrollTop >= 100) {
        logoEl.style.left = '-60px';
        logoEl.style.transform = 'translateX(0%) scale(0.5)';
      } else {
        logoEl.style.left = '20%';
        logoEl.style.transform = `translateX(-${shiftPercent}%) scale(1)`;
      }
    }
  }
}
