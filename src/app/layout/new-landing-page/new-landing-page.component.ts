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
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { LoaderControllerService } from 'src/app/services/loader-controller.service';
import templatesData from 'src/assets/templates/templates.json';

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
  @ViewChild('scrollContainer', { static: false })
  scrollContainer!: ElementRef<HTMLDivElement>;

  resumePaths: { templateLocation: string; templateName: string; templateType: string }[] = [

  ];

  observer!: IntersectionObserver;
  private swiper: any;
  showTour = false;
  templatesData: any;
  categories: string[] = [];
  selectedCategory: any;
  isMobile:boolean = false;

  constructor(
    private ngZone: NgZone,
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router,
    private gs: GlobalService,
    private loader: LoaderControllerService,
    private api: ApiService
  ) { }

  ngOnInit() {
    localStorage.clear();

    this.gs.allTemplates$.subscribe(response => {
      if (!response) return;

      this.templatesData = response;
      this.categories = Object.keys(this.templatesData);
      this.selectedCategory = this.categories[0];
      this.resumePaths = this.templatesData[this.selectedCategory] ?? [];
    });
 
   this.isMobile = this.isMobileDevice();
   
  }

  ngAfterViewInit(): void { }

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


    if (this.isMobileDevice()) {
      localStorage.setItem('templateName', templateName);
      this.gs.setResumeName(templateName);
      this.router.navigate(['choose-direction']);
    } else {
      localStorage.setItem('templateName', templateName);
      this.gs.setResumeName(templateName);
      this.router.navigate(['choose-direction']);
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

  loading = true;

  messages = [
    'Please wait…',
    'Preparing for you…',
    'Almost ready…',
    'Just a moment more…',
    'Ready to view…',
  ];

  currentMessage = this.messages[0];
  msgIndex = 0;
  intervalId: any;


  startProcess() {
    const messages = [
      'Please wait…',
      'Preparing things for you…',
      'Almost ready…',
      'Just a moment more…',
      'Ready to view…',
    ];

    this.loader.showLoader(messages, 2000);
  }



  selectCategory(category: string) {
    this.selectedCategory = category;

    const templates = this.templatesData[category] ?? [];
    this.resumePaths = templates;
  }


  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({
      left: -220,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({
      left: 220,
      behavior: 'smooth'
    });
  }

selectTemplates(){
  // this.router.navigate(['select-template']);

  this.router.navigate(['choose-direction'])

}

}
