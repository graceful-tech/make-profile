import { Directive, ElementRef, Input, AfterViewInit, Renderer2, NgZone, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appScrollAnimatesection4]'
})
export class ScrollAnimateDirectiveSection4 implements AfterViewInit, OnDestroy {

  @Input() animationName: string = 'slideInRight';
  @Input() animationDuration: number = 1000;
  @Input() animationDelay: number = 0;

  private scrollHandler!: () => void;

  constructor(private el: ElementRef, private renderer: Renderer2, private ngZone: NgZone) {}

  ngAfterViewInit(): void {
  this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');

  this.ngZone.runOutsideAngular(() => {
    this.scrollHandler = () => this.checkAndAnimate();

    window.addEventListener('scroll', this.scrollHandler, { passive: true });

     setTimeout(() => this.checkAndAnimate(), 200);
  });
}

private checkAndAnimate() {
  const rect = this.el.nativeElement.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  if (rect.top <= windowHeight - 50 && rect.bottom >= 0) {
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
    this.renderer.setStyle(
      this.el.nativeElement,
      'animation',
      `${this.animationName} ${this.animationDuration}ms ease forwards`
    );
    this.renderer.setStyle(this.el.nativeElement, 'animation-delay', `${this.animationDelay}ms`);
  }
}


  ngOnDestroy(): void {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }
}
