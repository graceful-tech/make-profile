import {
  Component,
  AfterViewInit,
  NgZone,
  Renderer2,
  ElementRef,
  Input,
  ViewEncapsulation,
  HostListener,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-new-landing-page',
  templateUrl: './new-landing-page.component.html',
  styleUrls: [
    './new-landing-page.component.css',
    './nicepage.css',
    './nicepage-site.css',
    './styles__ltr.css',
  ],

  encapsulation: ViewEncapsulation.None,
})
export class NewLandingPageComponent implements AfterViewInit {
  @Input('scrollAnimate') animationClass = 'animate-on-scroll';

  resumePaths: { path: string; name: string; type: string }[] = [
    { path: './assets/img/Mercury.png', name: 'Mercury', type: 'Single Page' },
    { path: './assets/img/Venus.png', name: 'Venus', type: 'Multiple Page' },
    { path: './assets/img/Earth.png', name: 'Earth', type: 'Single Page' },
    { path: './assets/img/Mars.png', name: 'Mars', type: 'Single Page' },
    {path: './assets/img/Jupiter.png', name: 'Jupiter',  type: 'Multiple Page',},
    { path: './assets/img/Saturn.png', name: 'Saturn', type: 'Multiple Page' },
    { path: './assets/img/Uranus.png', name: 'Uranus', type: 'Multiple Page' },
    {  path: './assets/img/Neptune.png', name: 'Neptune', type: 'Multiple Page', },
  ];

  observer!: IntersectionObserver;
  private swiper: any;
   showTour = false;

  constructor(
    private ngZone: NgZone,
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router,
    private gs: GlobalService
  ) {
    
  }

  ngOnInit(){
    localStorage.clear();
    
  }

  ngAfterViewInit(): void {}

  screenWidth = window.innerWidth;

  @HostListener('window:resize')
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  getSlidesPerView() {
    if (this.screenWidth < 600) return 1;
    if (this.screenWidth < 900) return 2;
    return 3;
  }

  selectTemplate(templateName: any) {
    this.router.navigate(['/select-template']);

    if (this.isMobileDevice()) {
      localStorage.setItem('templateName', templateName);
      this.gs.setResumeName(templateName);
      this.router.navigate(['get-details-using-ai']);
    } else {
      localStorage.setItem('templateName', templateName);
      this.gs.setResumeName(templateName);
      this.router.navigate(['enter-details']);
    }
  }

  toCreateResume() {
    this.router.navigate(['/login']);
  }

  private isMobileDevice(): boolean {
    const userAgent =
      navigator.userAgent || navigator.vendor || (window as any).opera;
    return /android|iphone|ipad|ipod/i.test(userAgent);
  }

  
}
