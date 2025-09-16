import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/services/api.service';
import { DeviceServiceService } from 'src/app/services/device.service.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-landing-page',
  standalone: false,
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent {
  @ViewChild('logoContainer') logoContainer!: ElementRef;
  @ViewChild('signUPContainer') signUPContainer!: ElementRef;


  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private gs: GlobalService,
    private router: Router,
    private dialog: DialogService,
    private route: ActivatedRoute,
    private deviceServiceService: DeviceServiceService
  ) {}

  ngOnInit() {
    this.deviceServiceService.directlyTo('landing');
  }

  ngAfterViewInit() {
     this.onWindowScroll();
   }

  candidate() {
    this.router.navigate(['/candidates'], { relativeTo: this.route });
  }

  toLogin() {
    this.router.navigate(['/create-resume-directly']);
  }

  toCreateResume(){
    this.router.navigate(['/enter-details']);
  }

  // @HostListener('window:scroll', [])
  //   onWindowScroll() {
  //     const scrollTop = window.scrollY;
  //     const maxScroll = document.body.scrollHeight - window.innerHeight;

  //     const scrollPercent = Math.min(scrollTop / maxScroll, 1);
  //     const shiftPercent = scrollPercent * 1000;

  //     const logoEl = this.logoContainer.nativeElement;

  //     logoEl.style.transform = `translateX(-${shiftPercent}%) scale(1.5)`;
  //     logoEl.style.transition = 'transform 0.2s ease-out';
  //   }

@HostListener('window:scroll', [])
onWindowScroll() {
  const scrollTop = window.scrollY;
  const maxShiftPx = 400;

  // LOGO container animation
  if (this.logoContainer) {
    const currentShift = Math.min(scrollTop, maxShiftPx);
    const shiftPercent = (currentShift / maxShiftPx) * 500;
    const logoEl = this.logoContainer.nativeElement;

    if (scrollTop >= 100) {
      logoEl.style.left = '10px';
      logoEl.style.transform = 'translateX(0%) scale(0.8)';
    } else {
      logoEl.style.left = '40%';
      logoEl.style.transform = `translateX(-${shiftPercent}%) scale(1.5)`;
    }
  }

   if (this.signUPContainer) {
    const currentShift = Math.min(scrollTop, maxShiftPx);
    const shiftPercent = (currentShift / maxShiftPx) * 500;
    const logoEl = this.logoContainer.nativeElement;

    if (scrollTop >= 100) {
      logoEl.style.left = '10px';
      logoEl.style.transform = 'translateX(0%) scale(0.8)';
    } else {
      logoEl.style.left = '40%';
      logoEl.style.transform = `translateX(-${shiftPercent}%) scale(1.5)`;
    }
  }
}

}
